// npx supabase functions deploy check-push-receipts --no-verify-jwt
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const EXPO_RECEIPTS_URL = "https://exp.host/--/api/v2/push/getReceipts";
const BATCH_SIZE = 300; // Expo recommends max 300 receipt IDs per request

serve(async (req) => {
  try {
      const SUPABASE_URL = "https://xaqeueshxpehijtxwklo.supabase.co";
      const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhcWV1ZXNoeHBlaGlqdHh3a2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1OTY2ODMsImV4cCI6MjA2ODE3MjY4M30.hKxftlcs-j4W1TrsbdycfT2tK9qowc3ZrgG1ZJoFwo4";

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );

    // Get notifications with unchecked tickets (sent at least 15 min ago)
    const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

    const { data: pendingNotifs } = await supabase
      .from("notification_log")
      .select("id, expo_ticket_id, user_id")
      .eq("delivery_status", "pending")
      .not("expo_ticket_id", "is", null)
      .lte("sent_at", fifteenMinAgo)
      .limit(1000);

    if (!pendingNotifs || pendingNotifs.length === 0) {
      return new Response(
        JSON.stringify({ checked: 0, message: "No pending receipts" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    let totalChecked = 0;
    let totalDelivered = 0;
    let totalErrors = 0;
    const invalidTokenUserIds: string[] = [];

    // Process in batches
    for (let i = 0; i < pendingNotifs.length; i += BATCH_SIZE) {
      const batch = pendingNotifs.slice(i, i + BATCH_SIZE);
      const ticketIds = batch.map((n) => n.expo_ticket_id).filter(Boolean);

      if (ticketIds.length === 0) continue;

      const response = await fetch(EXPO_RECEIPTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: ticketIds }),
      });

      const result = await response.json();
      const receipts = result.data || {};

      for (const notif of batch) {
        const receipt = receipts[notif.expo_ticket_id];
        if (!receipt) continue;

        totalChecked++;

        if (receipt.status === "ok") {
          totalDelivered++;
          await supabase
            .from("notification_log")
            .update({ delivery_status: "delivered" })
            .eq("id", notif.id);
        } else if (receipt.status === "error") {
          totalErrors++;
          const isDeviceGone =
            receipt.details?.error === "DeviceNotRegistered";

          await supabase
            .from("notification_log")
            .update({
              delivery_status: isDeviceGone
                ? "device_not_registered"
                : "error",
            })
            .eq("id", notif.id);

          if (isDeviceGone) {
            invalidTokenUserIds.push(notif.user_id);
          }
        }
      }
    }

    // Invalidate tokens for users whose devices are no longer registered
    if (invalidTokenUserIds.length > 0) {
      await supabase
        .from("push_tokens")
        .update({ is_valid: false })
        .in("user_id", invalidTokenUserIds);
    }

    return new Response(
      JSON.stringify({
        checked: totalChecked,
        delivered: totalDelivered,
        errors: totalErrors,
        tokens_invalidated: invalidTokenUserIds.length,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Check receipts error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
    });
  }
});

