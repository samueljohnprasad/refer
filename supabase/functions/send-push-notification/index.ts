// npx supabase functions deploy send-push-notification --no-verify-jwt
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const CHUNK_SIZE = 100; // Expo accepts max 100 per request

interface PushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  sound?: string;
  channelId?: string;
}

interface ExpoPushTicket {
  id?: string;
  status: "ok" | "error";
  message?: string;
  details?: { error?: string };
}

serve(async (req) => {
  try {
    const { messages } = (await req.json()) as { messages: PushMessage[] };

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided" }), {
        status: 400,
      });
    }

      const SUPABASE_URL = "https://xaqeueshxpehijtxwklo.supabase.co";
      const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhcWV1ZXNoeHBlaGlqdHh3a2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1OTY2ODMsImV4cCI6MjA2ODE3MjY4M30.hKxftlcs-j4W1TrsbdycfT2tK9qowc3ZrgG1ZJoFwo4";
      
    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );

    const allTickets: { token: string; ticket: ExpoPushTicket }[] = [];

    // Process in chunks of 100
    for (let i = 0; i < messages.length; i += CHUNK_SIZE) {
      const chunk = messages.slice(i, i + CHUNK_SIZE);

      const response = await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chunk),
      });

      const result = await response.json();
      const tickets: ExpoPushTicket[] = result.data || [];

      tickets.forEach((ticket, idx) => {
        allTickets.push({ token: chunk[idx].to, ticket });
      });
    }

    // Process tickets: update notification_log and handle errors
    const invalidTokens: string[] = [];

    for (const { token, ticket } of allTickets) {
      if (ticket.status === "error") {
        if (ticket.details?.error === "DeviceNotRegistered") {
          invalidTokens.push(token);
        }
      }
    }

    // Invalidate tokens that are no longer registered
    if (invalidTokens.length > 0) {
      await supabase
        .from("push_tokens")
        .update({ is_valid: false })
        .in("expo_push_token", invalidTokens);
    }

    return new Response(
      JSON.stringify({
        sent: allTickets.length,
        errors: allTickets.filter((t) => t.ticket.status === "error").length,
        invalidated: invalidTokens.length,
        tickets: allTickets.map((t) => ({
          token: t.token,
          ticketId: t.ticket.id,
          status: t.ticket.status,
        })),
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
    });
  }
});
