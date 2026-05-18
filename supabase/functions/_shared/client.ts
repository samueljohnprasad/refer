// _shared/client.ts
// Supabase client factory for Journey Map edge functions.
// Two clients: user-scoped (RLS enforced) and service-role (admin operations).

// @ts-ignore — Deno/ESM import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * Returns an authenticated Supabase client scoped to the request user.
 * RLS policies apply — all queries run as auth.uid() from the JWT.
 */
// @ts-ignore — Deno types
export function createUserClient(userToken: string) {
  return createClient(SUPABASE_URL, SUPABASE_ANON, {
    global: { headers: { Authorization: `Bearer ${userToken}` } },
    auth: { persistSession: false },
  });
}

/**
 * Returns a service-role Supabase client that bypasses RLS.
 * Use only for operations that need cross-user visibility or admin logic.
 * Always validate user identity manually when using this client.
 */
export function createServiceClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE, {
    auth: { persistSession: false },
  });
}

/** Extracts the Bearer token from the Authorization header. Returns null if missing. */
export function extractToken(req: Request): string | null {
  const header = req.headers.get("Authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/);
  return match ? match[1]! : null;
}

/** Standard JSON success response. */
export function ok(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

/** Standard JSON error response. */
export function err(message: string, status = 400): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}
