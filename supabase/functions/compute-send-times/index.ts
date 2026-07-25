// npx supabase functions deploy compute-send-times --no-verify-jwt
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const PAGE_SIZE = 500;
const LOOKBACK_DAYS = 30;
const HALF_LIFE_DAYS = 7;
const MIN_DATA_POINTS = 5;

serve(async (req) => {
  try {
      const SUPABASE_URL = "https://xaqeueshxpehijtxwklo.supabase.co";
      const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhcWV1ZXNoeHBlaGlqdHh3a2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1OTY2ODMsImV4cCI6MjA2ODE3MjY4M30.hKxftlcs-j4W1TrsbdycfT2tK9qowc3ZrgG1ZJoFwo4";
      
    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );

    let offset = 0;
    let totalComputed = 0;

    while (true) {
      // Get a page of users who have push tokens
      const { data: users } = await supabase
        .from("push_tokens")
        .select("user_id")
        .eq("is_valid", true)
        .range(offset, offset + PAGE_SIZE - 1);

      if (!users || users.length === 0) break;

      const uniqueUserIds = [...new Set(users.map((u) => u.user_id))];
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - LOOKBACK_DAYS);
      const cutoff = cutoffDate.toISOString();

      for (const userId of uniqueUserIds) {
        // Get user's timezone
        const { data: prefs } = await supabase
          .from("user_preferences")
          .select("timezone")
          .eq("user_id", userId)
          .single();

        const timezone = prefs?.timezone || "UTC";

        // Collect activity timestamps from multiple sources
        const [journals, moods, habits] = await Promise.all([
          supabase
            .from("moods")
            .select("selected_date")
            .eq("user_id", userId)
            .gte("selected_date", cutoff.split("T")[0])
            .order("selected_date", { ascending: false }),
          supabase
            .from("daily_moods")
            .select("day")
            .eq("user_id", userId)
            .gte("day", cutoff.split("T")[0]),
          supabase
            .from("xp_history")
            .select("created_at")
            .eq("user_id", userId)
            .gte("created_at", cutoff),
        ]);

        // Combine all timestamps
        const timestamps: Date[] = [];

        for (const m of moods?.data || []) {
          if (m.selected_date) timestamps.push(new Date(m.selected_date));
        }
        for (const j of journals?.data || []) {
          if (j.day) timestamps.push(new Date(j.day + "T12:00:00Z")); // Approximate mid-day
        }
        for (const h of habits?.data || []) {
          if (h.created_at) timestamps.push(new Date(h.created_at));
        }

        if (timestamps.length < MIN_DATA_POINTS) {
          // Not enough data — use default based on any available signal
          const hasAnyMorning = timestamps.some((t) => {
            const localHour = getLocalHour(t, timezone);
            return localHour < 10;
          });

          const hasAnyEvening = timestamps.some((t) => {
            const localHour = getLocalHour(t, timezone);
            return localHour >= 18;
          });

          let defaultHour = 9;
          let defaultMinute = 0;

          if (hasAnyEvening && !hasAnyMorning) {
            defaultHour = 19;
            defaultMinute = 30;
          } else if (hasAnyMorning) {
            defaultHour = 8;
            defaultMinute = 30;
          }

          await supabase.from("user_send_times").upsert({
            user_id: userId,
            optimal_hour: defaultHour,
            optimal_minute: defaultMinute,
            confidence: 0.0,
            data_points: timestamps.length,
            computed_at: new Date().toISOString(),
          });

          totalComputed++;
          continue;
        }

        // Bucket into hours with exponential decay weighting
        const hourBuckets = new Array(24).fill(0);
        const now = Date.now();

        for (const ts of timestamps) {
          const localHour = getLocalHour(ts, timezone);
          const daysAgo = (now - ts.getTime()) / 86400000;
          const weight = Math.exp((-Math.LN2 * daysAgo) / HALF_LIFE_DAYS);
          hourBuckets[localHour] += weight;
        }

        // Find peak hour
        let peakHour = 9;
        let peakWeight = 0;

        for (let h = 0; h < 24; h++) {
          if (hourBuckets[h] > peakWeight) {
            peakWeight = hourBuckets[h];
            peakHour = h;
          }
        }

        // Nudge 30 minutes before the peak
        let optimalHour = peakHour;
        let optimalMinute = 30; // Send at HH:30 to nudge before the natural peak

        // If peak is in the first half hour, nudge to previous hour
        if (optimalMinute === 30) {
          optimalHour = peakHour;
          optimalMinute = 0; // Send at the start of the peak hour
        }

        // Ensure we're not in quiet hours (10 PM - 7 AM)
        if (optimalHour >= 22 || optimalHour < 7) {
          optimalHour = 9;
          optimalMinute = 0;
        }

        const totalWeight = hourBuckets.reduce((a, b) => a + b, 0);
        const confidence = totalWeight > 0 ? peakWeight / totalWeight : 0;

        await supabase.from("user_send_times").upsert({
          user_id: userId,
          optimal_hour: optimalHour,
          optimal_minute: optimalMinute,
          confidence: Math.min(confidence, 1.0),
          data_points: timestamps.length,
          computed_at: new Date().toISOString(),
        });

        totalComputed++;
      }

      if (users.length < PAGE_SIZE) break;
      offset += PAGE_SIZE;
    }

    return new Response(
      JSON.stringify({
        total_computed: totalComputed,
        computed_at: new Date().toISOString(),
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Compute send times error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
    });
  }
});

function getLocalHour(date: Date, timezone: string): number {
  try {
    const formatted = date.toLocaleString("en-US", {
      timeZone: timezone,
      hour: "numeric",
      hour12: false,
    });
    return parseInt(formatted, 10);
  } catch {
    return date.getUTCHours();
  }
}
