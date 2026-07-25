// _shared/timezone.ts
// Reusable timezone utilities for edge functions // ponytail: DRY timezone handling across all functions

// @ts-ignore — Deno/ESM import
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { fromZonedTime } from "npm:date-fns-tz@^3.0.0";

/**
 * Fetch a user's timezone from user_preferences table, falling back to UTC if missing or errored.
 */
export async function getUserTimezone(
  supabase: SupabaseClient,
  userId: string,
): Promise<string> {
  try {
    const { data } = await supabase
      .from("user_preferences")
      .select("timezone")
      .eq("user_id", userId)
      .maybeSingle();
    return data?.timezone || "UTC";
  } catch {
    return "UTC";
  }
}

/**
 * Compute the exact UTC start and end timestamps for a YYYY-MM-DD local calendar day in a given timezone.
 */
export function getUtcDateRange(
  date: string,
  timezone: string = "UTC",
): { startOfDay: string; endOfDay: string } {
  let startOfDay = `${date}T00:00:00.000Z`;
  let endOfDay = `${date}T23:59:59.999Z`;
  try {
    startOfDay = fromZonedTime(`${date}T00:00:00`, timezone).toISOString();
    endOfDay = fromZonedTime(`${date}T23:59:59.999`, timezone).toISOString();
  } catch (err) {
    console.warn(`[timezone] Fallback to UTC for ${timezone}:`, err);
  }
  return { startOfDay, endOfDay };
}

/**
 * Helper to fetch a user's timezone and immediately return their UTC date bounds for a specific YYYY-MM-DD date.
 */
export async function getUserUtcDateRange(
  supabase: SupabaseClient,
  userId: string,
  date: string,
): Promise<{ startOfDay: string; endOfDay: string; timezone: string }> {
  const timezone = await getUserTimezone(supabase, userId);
  const { startOfDay, endOfDay } = getUtcDateRange(date, timezone);
  return { startOfDay, endOfDay, timezone };
}
