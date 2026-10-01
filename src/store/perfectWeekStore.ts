/**
 * Perfect week reward: when all seven weekday dots are lit (a 7+ day streak on
 * the last day of the week), the learner earns a bonus XP chest — once per week.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, getDay, startOfWeek } from "date-fns";

export const PERFECT_WEEK_BONUS_XP = 50;

const KEY_PREFIX = "@perfect_week_claimed_v1:";

const weekKey = (now: Date) =>
  KEY_PREFIX + format(startOfWeek(now, { weekStartsOn: 0 }), "yyyy-MM-dd");

/** All seven Sun→Sat dots are active: it's Saturday and the streak covers the week. */
export function isPerfectWeek(streakDays: number, now: Date = new Date()): boolean {
  return getDay(now) === 6 && streakDays >= 7;
}

export async function hasClaimedPerfectWeek(now: Date = new Date()): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(weekKey(now))) === "1";
  } catch {
    return true;
  }
}

export async function markPerfectWeekClaimed(now: Date = new Date()): Promise<void> {
  try {
    await AsyncStorage.setItem(weekKey(now), "1");
  } catch (error) {
    console.error("[PerfectWeekStore] Failed to persist:", error);
  }
}
