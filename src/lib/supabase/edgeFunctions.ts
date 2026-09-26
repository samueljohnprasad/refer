// lib/supabase/edgeFunctions.ts
// Single source of truth for all Edge Function URLs and the typed HTTP caller.
// Import EDGE_FUNCTION_URLS and callEdgeFunction from here — never hardcode URLs elsewhere.

import { supabase } from "@/src/network/auth/supabase";

const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  "https://xaqeueshxpehijtxwklo.supabase.co";
export const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhcWV1ZXNoeHBlaGlqdHh3a2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1OTY2ODMsImV4cCI6MjA2ODE3MjY4M30.hKxftlcs-j4W1TrsbdycfT2tK9qowc3ZrgG1ZJoFwo4";

const FUNCTIONS_BASE = `${SUPABASE_URL}/functions/v1`;

/** All Journey Map Edge Function endpoints. */
export const EDGE_FUNCTION_URLS = {
  getCourseTree: `${FUNCTIONS_BASE}/get-course-tree`,
  getCourseProgress: `${FUNCTIONS_BASE}/get-course-progress`,
  startCourse: `${FUNCTIONS_BASE}/start-course`,
  completeNode: `${FUNCTIONS_BASE}/complete-node`,
} as const;

/** Error thrown when an Edge Function returns a non-2xx response. */
export class EdgeFunctionError extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string,
  ) {
    super(message);
    this.name = "EdgeFunctionError";
  }
}

/**
 * Calls an Edge Function with the current user's JWT.
 * Handles auth, serialization, and error normalization in one place.
 *
 * @param url     - Edge Function URL from EDGE_FUNCTION_URLS
 * @param payload - Request body (will be JSON-serialized)
 * @returns Parsed JSON response body as TResponse
 * @throws EdgeFunctionError on non-2xx status
 */
export async function callEdgeFunction<TRequest, TResponse>(
  url: string,
  payload: TRequest,
): Promise<TResponse> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = (await response
      .json()
      .catch(() => ({ error: "Unknown error" }))) as { error?: string };
    throw new EdgeFunctionError(
      response.status,
      errorBody.error ?? "Unknown error",
    );
  }

  return response.json() as Promise<TResponse>;
}
