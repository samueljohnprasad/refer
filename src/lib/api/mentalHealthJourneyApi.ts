/**
 * Mental Health Journey API Client
 * Functions for fetching mental health journey data with extended content fields.
 *
 * Extends the base journey API with:
 * - Streak management
 * - Insight Points ledger
 *
 * Reuses the base journeyApi for enrollment and progress operations.
 */

import { supabase } from "@/src/network/auth/supabase";

export type ApiResponse<T> =
  | { data: T; success: true; error?: never }
  | { data: null | T; success: false; error: string };
import type {
  UserStreak,
  UpdateStreakResponse,
  IPLedgerEntry,
  IPTotals,
  IPSource,
} from "@/src/types/journey/mentalHealth";
import { createLogger } from "@/src/lib/logger";

const log = createLogger("MentalHealthJourneyAPI");

// ============================================================================
// Streak API
// ============================================================================

/**
 * Fetch the current user's streak data.
 */
export async function fetchUserStreak(): Promise<
  ApiResponse<UserStreak | null>
> {
  try {
    const userId: string | undefined = (await supabase.auth.getUser()).data.user
      ?.id;
    if (!userId) {
      return { data: null, success: false, error: "Not authenticated" };
    }

    const { data, error } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      log.error("fetchUserStreak query error", error.message);
      return { data: null, success: false, error: error.message };
    }

    if (!data) {
      return { data: null, success: true };
    }

    const streak: UserStreak = {
      userId: data.user_id as string,
      currentStreak: data.current_streak as number,
      longestStreak: data.longest_streak as number,
      lastActivityDate: data.last_activity_date as string,
      streakFreezesAvailable: data.streak_freezes_available as number,
      restDaysUsedThisWeek: data.rest_days_used_this_week as number,
      weekStartDate: data.week_start_date as string,
      updatedAt: data.updated_at as string,
    };

    return { data: streak, success: true };
  } catch (err) {
    log.error("fetchUserStreak exception", err);
    return {
      data: null,
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Update the user's streak via the atomic RPC function.
 * Should be called on every node completion.
 */
export async function updateStreak(): Promise<
  ApiResponse<UpdateStreakResponse | null>
> {
  try {
    const { data, error } = await supabase.rpc("update_user_streak");

    if (error) {
      log.error("updateStreak RPC error", error.message);
      return { data: null, success: false, error: error.message };
    }

    return { data: data as unknown as UpdateStreakResponse, success: true };
  } catch (err) {
    log.error("updateStreak exception", err);
    return {
      data: null,
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// ============================================================================
// Insight Points API
// ============================================================================

/**
 * Earn Insight Points — insert an entry into the ledger.
 */
export async function earnInsightPoints(params: {
  amount: number;
  source: IPSource;
  sourceId?: string;
  journeyId?: string;
  metadata?: Record<string, unknown>;
}): Promise<ApiResponse<IPLedgerEntry | null>> {
  try {
    const userId: string | undefined = (await supabase.auth.getUser()).data.user
      ?.id;
    if (!userId) {
      return { data: null, success: false, error: "Not authenticated" };
    }

    const { data, error } = await supabase
      .from("insight_points_ledger")
      .insert({
        user_id: userId,
        amount: params.amount,
        source: params.source,
        source_id: params.sourceId ?? null,
        journey_id: params.journeyId ?? null,
        metadata: params.metadata ?? null,
      } as any)
      .select()
      .single();

    if (error) {
      log.error("earnInsightPoints insert error", error.message);
      return { data: null, success: false, error: error.message };
    }

    const entry: IPLedgerEntry = {
      id: data.id as string,
      userId: data.user_id as string,
      amount: data.amount as number,
      source: data.source as IPSource,
      sourceId: data.source_id as string | null,
      journeyId: data.journey_id as string | null,
      metadata: data.metadata as Record<string, unknown> | null,
      earnedAt: data.earned_at as string,
    };

    return { data: entry, success: true };
  } catch (err) {
    log.error("earnInsightPoints exception", err);
    return {
      data: null,
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Fetch aggregated IP totals for the current user.
 */
export async function fetchIPTotals(): Promise<ApiResponse<IPTotals>> {
  try {
    const userId: string | undefined = (await supabase.auth.getUser()).data.user
      ?.id;
    if (!userId) {
      return {
        data: { totalIp: 0, todayIp: 0, weekIp: 0 },
        success: false,
        error: "Not authenticated",
      };
    }

    const { data, error } = await supabase
      .from("user_ip_totals")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      log.error("fetchIPTotals query error", error.message);
      return {
        data: { totalIp: 0, todayIp: 0, weekIp: 0 },
        success: false,
        error: error.message,
      };
    }

    const totals: IPTotals = {
      totalIp: (data?.total_ip ?? 0) as number,
      todayIp: (data?.today_ip ?? 0) as number,
      weekIp: (data?.week_ip ?? 0) as number,
    };

    return { data: totals, success: true };
  } catch (err) {
    log.error("fetchIPTotals exception", err);
    return {
      data: { totalIp: 0, todayIp: 0, weekIp: 0 },
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
