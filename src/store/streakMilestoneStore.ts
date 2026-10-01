/**
 * Streak milestones celebrated on the lesson-complete screen.
 * Each milestone is celebrated once per streak run: we remember when it was
 * last celebrated and only celebrate again if enough days have passed for the
 * learner to have rebuilt the streak from scratch.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { differenceInCalendarDays, parseISO } from "date-fns";

export const CELEBRATED_STREAK_MILESTONES = [3, 7, 15, 30] as const;
export type StreakMilestoneDay = (typeof CELEBRATED_STREAK_MILESTONES)[number];

export const STREAK_MILESTONE_MESSAGES: Record<StreakMilestoneDay, string> = {
  3: "Three days in a row — a habit is forming.",
  7: "A full week of showing up. Your mind thanks you.",
  15: "Fifteen days strong. This is who you are now.",
  30: "Thirty days. A whole month of choosing yourself.",
};

const keyFor = (day: number) => `@streak_milestone_celebrated_v1:${day}`;

export function getStreakMilestone(streakDays: number): StreakMilestoneDay | null {
  return (CELEBRATED_STREAK_MILESTONES as readonly number[]).includes(streakDays)
    ? (streakDays as StreakMilestoneDay)
    : null;
}

/** True when this milestone hasn't been celebrated during the current streak run. */
export async function shouldCelebrateStreakMilestone(
  milestone: StreakMilestoneDay,
): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(keyFor(milestone));
    if (!raw) return true;
    // Celebrated less than `milestone` days ago → same run, already celebrated.
    return differenceInCalendarDays(new Date(), parseISO(raw)) >= milestone;
  } catch {
    return false;
  }
}

export async function markStreakMilestoneCelebrated(
  milestone: StreakMilestoneDay,
): Promise<void> {
  try {
    await AsyncStorage.setItem(keyFor(milestone), new Date().toISOString());
  } catch (error) {
    console.error("[StreakMilestoneStore] Failed to persist:", error);
  }
}
