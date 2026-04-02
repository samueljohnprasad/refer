import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const PAGE_SIZE = 500;
const CONVERSION_WINDOW_HOURS = 2;

interface Template {
  id: string;
  category: string;
  title_template: string;
  body_template: string;
  min_segment: string | null;
}

interface UserData {
  user_id: string;
  expo_push_token: string;
  timezone: string;
  display_name: string | null;
  current_streak: number | null;
  last_journal_date: string | null;
  created_at: string | null;
}

// ============================================
// Thompson Sampling Bandit
// ============================================

function gammaSample(shape: number, scale: number): number {
  // Marsaglia and Tsang's method
  if (shape < 1) {
    return gammaSample(shape + 1, scale) * Math.pow(Math.random(), 1 / shape);
  }
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  while (true) {
    let x: number, v: number;
    do {
      x = randn();
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = Math.random();
    if (u < 1 - 0.0331 * (x * x) * (x * x)) return d * v * scale;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v * scale;
  }
}

function randn(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function betaSample(alpha: number, beta: number): number {
  const x = gammaSample(alpha, 1);
  const y = gammaSample(beta, 1);
  return x / (x + y);
}

// ============================================
// User Segmentation
// ============================================

function getSegment(user: UserData): string {
  const daysSinceJoin = user.created_at
    ? Math.floor((Date.now() - new Date(user.created_at).getTime()) / 86400000)
    : 999;

  if (daysSinceJoin < 7) return "new_user";

  const daysSinceEntry = user.last_journal_date
    ? Math.floor((Date.now() - new Date(user.last_journal_date).getTime()) / 86400000)
    : 999;

  if (daysSinceEntry >= 15) return "dormant";
  if (daysSinceEntry >= 4) return "churning";
  if (daysSinceEntry >= 2) return "at_risk";
  if ((user.current_streak || 0) >= 7) return "active_streaker";

  return "active_streaker";
}

// ============================================
// Category Selection
// ============================================

function selectCategory(user: UserData): string {
  const daysSinceEntry = user.last_journal_date
    ? Math.floor((Date.now() - new Date(user.last_journal_date).getTime()) / 86400000)
    : 999;

  // Already journaled today — skip
  if (daysSinceEntry === 0) return "skip";

  // Re-engagement for inactive users
  if (daysSinceEntry >= 2) return "re_engagement";

  // Has an active streak — protect it
  if ((user.current_streak || 0) > 0) {
    return Math.random() < 0.6 ? "streak_maintenance" : "mood_check_in";
  }

  // Default
  return "mood_check_in";
}

// ============================================
// Template Variable Resolution
// ============================================

function resolveTemplate(
  template: string,
  vars: Record<string, string | number>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return vars[key] !== undefined ? String(vars[key]) : `{{${key}}}`;
  });
}

// ============================================
// Main Dispatcher
// ============================================

serve(async (req) => {
  try {
      const SUPABASE_URL = "https://xaqeueshxpehijtxwklo.supabase.co";
      const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhcWV1ZXNoeHBlaGlqdHh3a2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1OTY2ODMsImV4cCI6MjA2ODE3MjY4M30.hKxftlcs-j4W1TrsbdycfT2tK9qowc3ZrgG1ZJoFwo4";
      
    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );

    const now = new Date();
    const utcHour = now.getUTCHours();
    const utcMinute = now.getUTCMinutes();

    // Load active templates
    const { data: templates } = await supabase
      .from("notification_templates")
      .select("*")
      .eq("is_active", true);

    if (!templates || templates.length === 0) {
      return new Response(JSON.stringify({ error: "No active templates" }), {
        status: 200,
      });
    }

    // Load bandit stats
    const { data: banditStats } = await supabase
      .from("bandit_arm_stats")
      .select("*");

    const statsMap = new Map<string, { alpha: number; beta: number }>();
    for (const stat of banditStats || []) {
      statsMap.set(`${stat.template_id}:${stat.user_segment}`, {
        alpha: stat.alpha,
        beta: stat.beta,
      });
    }

    let totalSent = 0;
    let totalSkipped = 0;
    let offset = 0;

    while (true) {
      // Fetch a page of users with their tokens and send times
      const { data: users, error: usersError } = await supabase
        .rpc("get_eligible_notification_users", {
          p_utc_hour: utcHour,
          p_utc_minute: utcMinute,
          p_page_size: PAGE_SIZE,
          p_offset: offset,
        });

      // If RPC doesn't exist yet, fall back to a direct query
      if (usersError) {
        // Fallback: query users whose optimal time matches current window
        const { data: fallbackUsers } = await supabase
          .from("push_tokens")
          .select(`
            user_id,
            expo_push_token,
            profiles!inner(display_name, current_streak, last_journal_date, created_at)
          `)
          .eq("is_valid", true)
          .range(offset, offset + PAGE_SIZE - 1);

        if (!fallbackUsers || fallbackUsers.length === 0) break;

        const messagesToSend: any[] = [];
        const logEntries: any[] = [];

        for (const row of fallbackUsers) {
          const profile = (row as any).profiles;
          const userData: UserData = {
            user_id: row.user_id,
            expo_push_token: row.expo_push_token,
            timezone: "UTC",
            display_name: profile?.display_name || "friend",
            current_streak: profile?.current_streak || 0,
            last_journal_date: profile?.last_journal_date || null,
            created_at: profile?.created_at || null,
          };

          // Check if already sent today
          const today = new Date().toISOString().split("T")[0];
          const { count } = await supabase
            .from("notification_log")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userData.user_id)
            .gte("sent_at", `${today}T00:00:00Z`);

          if ((count || 0) > 0) {
            totalSkipped++;
            continue;
          }

          const category = selectCategory(userData);
          if (category === "skip") {
            totalSkipped++;
            continue;
          }

          const segment = getSegment(userData);

          // Get recent notifications sent to this user for novelty rotation
          const { data: recentNotifs } = await supabase
            .from("notification_log")
            .select("template_id")
            .eq("user_id", userData.user_id)
            .order("sent_at", { ascending: false })
            .limit(5);

          const recentTemplateIds = (recentNotifs || [])
            .map((n) => n.template_id)
            .filter(Boolean) as string[];

          // Filter templates by category
          const categoryTemplates = templates.filter(
            (t: Template) => t.category === category
          );

          if (categoryTemplates.length === 0) {
            totalSkipped++;
            continue;
          }

          // Thompson Sampling: select best template
          const selectedTemplate = selectTemplateViaBandit(
            categoryTemplates,
            statsMap,
            recentTemplateIds,
            segment
          );

          // Resolve template variables
          const daysSinceEntry = userData.last_journal_date
            ? Math.floor(
                (Date.now() - new Date(userData.last_journal_date).getTime()) /
                  86400000
              )
            : 0;

          const vars: Record<string, string | number> = {
            display_name: userData.display_name || "friend",
            streak_count: userData.current_streak || 0,
            days_since_last_entry: daysSinceEntry,
          };

          const title = resolveTemplate(selectedTemplate.title_template, vars);
          const body = resolveTemplate(selectedTemplate.body_template, vars);

          const logId = crypto.randomUUID();

          messagesToSend.push({
            to: userData.expo_push_token,
            title,
            body,
            sound: "default",
            channelId: "push",
            data: {
              notification_log_id: logId,
              category,
              template_id: selectedTemplate.id,
            },
          });

          logEntries.push({
            id: logId,
            user_id: userData.user_id,
            template_id: selectedTemplate.id,
            category,
            title,
            body,
            user_segment: segment,
            sent_at: new Date().toISOString(),
          });
        }

        // Insert notification logs
        if (logEntries.length > 0) {
          await supabase.from("notification_log").insert(logEntries);
        }

        // Send to Expo Push API
        if (messagesToSend.length > 0) {
          const sendUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-push-notification`;
          const sendResponse = await fetch(sendUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
            },
            body: JSON.stringify({ messages: messagesToSend }),
          });

          const sendResult = await sendResponse.json();

          // Update notification_log with ticket IDs
          if (sendResult.tickets) {
            for (const ticketInfo of sendResult.tickets) {
              if (ticketInfo.ticketId) {
                const matchingLog = logEntries.find(
                  (log: any) =>
                    messagesToSend.find(
                      (m: any) => m.to === ticketInfo.token && m.data.notification_log_id === log.id
                    )
                );
                if (matchingLog) {
                  await supabase
                    .from("notification_log")
                    .update({
                      expo_ticket_id: ticketInfo.ticketId,
                      delivery_status:
                        ticketInfo.status === "ok" ? "delivered" : "error",
                    })
                    .eq("id", matchingLog.id);
                }
              }
            }
          }

          totalSent += messagesToSend.length;
        }

        if (fallbackUsers.length < PAGE_SIZE) break;
        offset += PAGE_SIZE;
        continue;
      }

      if (!users || users.length === 0) break;
      // Process RPC result path (same logic would go here)
      if (users.length < PAGE_SIZE) break;
      offset += PAGE_SIZE;
    }

    return new Response(
      JSON.stringify({
        total_sent: totalSent,
        total_skipped: totalSkipped,
        dispatched_at: now.toISOString(),
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Dispatcher error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
    });
  }
});

function selectTemplateViaBandit(
  categoryTemplates: Template[],
  statsMap: Map<string, { alpha: number; beta: number }>,
  recentTemplateIds: string[],
  segment: string
): Template {
  // Filter out templates sent in last 3 notifications (novelty rotation)
  const recentSet = new Set(recentTemplateIds.slice(0, 3));
  let candidates = categoryTemplates.filter((t) => !recentSet.has(t.id));

  // If all filtered out, use all templates
  if (candidates.length === 0) {
    candidates = categoryTemplates;
  }

  // Thompson Sampling: score each candidate
  let bestScore = -1;
  let bestTemplate = candidates[0];

  for (const template of candidates) {
    const key = `${template.id}:${segment}`;
    const stats = statsMap.get(key) || { alpha: 1, beta: 1 };

    let score = betaSample(stats.alpha, stats.beta);

    // Novelty bonus for templates not recently sent
    if (!recentTemplateIds.includes(template.id)) {
      score += 0.2;
    }

    if (score > bestScore) {
      bestScore = score;
      bestTemplate = template;
    }
  }

  return bestTemplate;
}
