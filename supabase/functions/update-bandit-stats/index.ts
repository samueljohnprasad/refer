// npx supabase functions deploy update-bandit-stats --no-verify-jwt
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const CONVERSION_WINDOW_HOURS = 2;

serve(async (req) => {
  try {
      const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://xaqeueshxpehijtxwklo.supabase.co";
      const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhcWV1ZXNoeHBlaGlqdHh3a2xvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjU5NjY4MywiZXhwIjoyMDY4MTcyNjgzfQ.V5jpUlbJsNQAOH4jFjwfjSG4MK4SA2vVnAKLI99mPlE";
      
    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );

    // Get all notifications from the last 24 hours that have been delivered
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: recentNotifs } = await supabase
      .from("notification_log")
      .select("template_id, user_segment, opened_at, converted_at, sent_at")
      .gte("sent_at", yesterday)
      .not("template_id", "is", null)
      .not("user_segment", "is", null);

    if (!recentNotifs || recentNotifs.length === 0) {
      return new Response(
        JSON.stringify({ updated: 0, message: "No recent notifications to process" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Aggregate stats by (template_id, user_segment)
    const statsUpdates = new Map<
      string,
      { template_id: string; segment: string; successes: number; failures: number }
    >();

    for (const notif of recentNotifs) {
      const key = `${notif.template_id}:${notif.user_segment}`;

      if (!statsUpdates.has(key)) {
        statsUpdates.set(key, {
          template_id: notif.template_id!,
          segment: notif.user_segment!,
          successes: 0,
          failures: 0,
        });
      }

      const stats = statsUpdates.get(key)!;

      // Success = user opened the notification OR converted (journaled)
      const isSuccess = notif.opened_at != null || notif.converted_at != null;

      // Check if enough time has passed to judge (conversion window)
      const sentAt = new Date(notif.sent_at);
      const hoursSinceSent =
        (Date.now() - sentAt.getTime()) / (1000 * 60 * 60);

      if (hoursSinceSent >= CONVERSION_WINDOW_HOURS) {
        if (isSuccess) {
          stats.successes++;
        } else {
          stats.failures++;
        }
      }
    }

    // Upsert bandit arm stats
    let totalUpdated = 0;

    for (const [, stats] of statsUpdates) {
      if (stats.successes === 0 && stats.failures === 0) continue;

      // Get current stats
      const { data: existing } = await supabase
        .from("bandit_arm_stats")
        .select("alpha, beta, total_sent, total_opened")
        .eq("template_id", stats.template_id)
        .eq("user_segment", stats.segment)
        .single();

      const currentAlpha = existing?.alpha || 1.0;
      const currentBeta = existing?.beta || 1.0;
      const currentSent = existing?.total_sent || 0;
      const currentOpened = existing?.total_opened || 0;

      await supabase.from("bandit_arm_stats").upsert(
        {
          template_id: stats.template_id,
          user_segment: stats.segment,
          alpha: currentAlpha + stats.successes,
          beta: currentBeta + stats.failures,
          total_sent: currentSent + stats.successes + stats.failures,
          total_opened: currentOpened + stats.successes,
          last_updated: new Date().toISOString(),
        },
        { onConflict: "template_id,user_segment" }
      );

      totalUpdated++;
    }

    return new Response(
      JSON.stringify({
        processed_notifications: recentNotifs.length,
        arms_updated: totalUpdated,
        updated_at: new Date().toISOString(),
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Update bandit stats error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
    });
  }
});
