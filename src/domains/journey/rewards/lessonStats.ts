// Pure helpers for lesson-completion stats (perfect lesson detection, bonus XP).

import { XP_REWARDS, XPActionType } from "@/src/types/xp";

/** Bonus XP granted on top of the base lesson reward for a flawless lesson. */
export const PERFECT_LESSON_BONUS_XP = 5;

/** Base XP for finishing a lesson/exercise. */
export const LESSON_BASE_XP = XP_REWARDS[XPActionType.EXERCISE_COMPLETE];

/**
 * A lesson is "perfect" when it contains at least one graded item and every
 * graded item was answered correctly on the first attempt without skipping.
 * Graded items are responses carrying a boolean `isCorrect`.
 */
export function isPerfectLesson(responses: Record<string, unknown>): boolean {
  let gradedCount = 0;

  for (const value of Object.values(responses)) {
    if (!value || typeof value !== "object") continue;
    const r = value as { isCorrect?: unknown; attempts?: unknown; skipped?: unknown };
    if (typeof r.isCorrect !== "boolean") continue;

    gradedCount += 1;
    if (!r.isCorrect || r.skipped === true) return false;
    if (typeof r.attempts === "number" && r.attempts > 1) return false;
  }

  return gradedCount > 0;
}
