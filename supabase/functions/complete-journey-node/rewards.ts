/**
 * rewards.ts — XP, gem, and heart reward application for complete-journey-node.
 *
 * Responsibilities:
 *  - Parse raw reward JSON into typed totals
 *  - Apply XP to user_xp + xp_history
 *  - Apply gems to user_wallet
 *  - Orchestrate both via a single `applyRewards` call
 */

import { adminSupabase } from "./db.ts";
import type { ParsedRewards } from "./types.ts";

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

/**
 * Parse an unknown `rewards` column value into aggregated totals.
 * Skips entries with invalid/non-positive amounts and unknown types.
 */
export function parseRewards(rawRewards: unknown): ParsedRewards {
  const rewards = Array.isArray(rawRewards)
    ? (rawRewards as Array<{ type?: string; amount?: number }>)
    : [];

  return rewards.reduce<ParsedRewards>(
    (totals, reward) => {
      const amount = Number(reward?.amount ?? 0);
      if (!Number.isFinite(amount) || amount <= 0) return totals;

      switch (reward?.type) {
        case "xp":
          totals.xp += amount;
          break;
        case "gems":
          totals.gems += amount;
          break;
        case "hearts":
          totals.hearts += amount;
          break;
        default:
          break;
      }

      return totals;
    },
    { xp: 0, gems: 0, hearts: 0 },
  );
}

// ---------------------------------------------------------------------------
// XP
// ---------------------------------------------------------------------------

/**
 * Increment a user's total and daily XP, then append an XP history entry.
 * No-op when `xp` is 0.
 */
export async function applyXpRewards(
  userId: string,
  nodeId: string,
  xp: number,
): Promise<void> {
  if (xp <= 0) return;

  const { data: userXp, error: userXpError } = await adminSupabase
    .from("user_xp")
    .select("user_id, total_xp, today_xp")
    .eq("user_id", userId)
    .maybeSingle();

  if (userXpError) throw new Error(userXpError.message);

  const { error: upsertXpError } = await adminSupabase
    .from("user_xp")
    .upsert(
      {
        user_id: userId,
        total_xp: (userXp?.total_xp ?? 0) + xp,
        today_xp: (userXp?.today_xp ?? 0) + xp,
      },
      { onConflict: "user_id" },
    );

  if (upsertXpError) throw new Error(upsertXpError.message);

  const { error: historyError } = await adminSupabase
    .from("xp_history")
    .insert({
      user_id: userId,
      action: "journey_node_complete",
      amount: xp,
      description: `Completed journey node ${nodeId}`,
    });

  if (historyError) throw new Error(historyError.message);
}

// ---------------------------------------------------------------------------
// Gems
// ---------------------------------------------------------------------------

/**
 * Increment a user's gem balance.
 * No-op when `gems` is 0.
 */
export async function applyGemRewards(
  userId: string,
  gems: number,
): Promise<void> {
  if (gems <= 0) return;

  const { data: wallet, error: walletError } = await adminSupabase
    .from("user_wallet")
    .select("user_id, coins, gems, total_coins_earned")
    .eq("user_id", userId)
    .maybeSingle();

  if (walletError) throw new Error(walletError.message);

  const { error: upsertError } = await adminSupabase
    .from("user_wallet")
    .upsert(
      {
        user_id: userId,
        coins: wallet?.coins ?? 0,
        gems: (wallet?.gems ?? 0) + gems,
        total_coins_earned: wallet?.total_coins_earned ?? 0,
      },
      { onConflict: "user_id" },
    );

  if (upsertError) throw new Error(upsertError.message);
}

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

/**
 * Parse raw rewards and apply all of them in parallel.
 * Returns the parsed reward totals so callers can include them in the response.
 */
export async function applyRewards(
  userId: string,
  nodeId: string,
  rawRewards: unknown,
): Promise<ParsedRewards> {
  const rewards = parseRewards(rawRewards);

  await Promise.all([
    applyXpRewards(userId, nodeId, rewards.xp),
    applyGemRewards(userId, rewards.gems),
  ]);

  return rewards;
}
