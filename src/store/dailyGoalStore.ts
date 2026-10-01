/**
 * Daily XP goal — jotai atom with AsyncStorage persistence.
 * The goal is a number of XP the learner aims to earn each day.
 */

import { atom, useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DAILY_XP_GOAL_KEY = "@daily_xp_goal_v1";

/** 30 XP ≈ three completed lessons. */
export const DEFAULT_DAILY_XP_GOAL = 30;

export const DAILY_XP_GOAL_OPTIONS = [10, 20, 30, 50] as const;

export const dailyXPGoalAtom = atom<number>(DEFAULT_DAILY_XP_GOAL);

export async function loadDailyXPGoal(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(DAILY_XP_GOAL_KEY);
    const parsed = raw ? Number(raw) : NaN;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_DAILY_XP_GOAL;
  } catch {
    return DEFAULT_DAILY_XP_GOAL;
  }
}

export async function saveDailyXPGoal(goal: number): Promise<void> {
  try {
    await AsyncStorage.setItem(DAILY_XP_GOAL_KEY, String(goal));
  } catch (error) {
    console.error("[DailyGoalStore] Failed to save goal:", error);
  }
}

export function useDailyXPGoal(): { goal: number; setGoal: (goal: number) => void } {
  const [goal, setGoalAtom] = useAtom(dailyXPGoalAtom);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    loadDailyXPGoal().then(setGoalAtom);
  }, [setGoalAtom]);

  const setGoal = useCallback(
    (next: number) => {
      setGoalAtom(next);
      void saveDailyXPGoal(next);
    },
    [setGoalAtom],
  );

  return { goal, setGoal };
}

// ─── "Daily goal done" toast — shown once per calendar day ───────────────────

const GOAL_TOAST_KEY_PREFIX = "@daily_goal_toast_shown_v1:";
const todayKey = () => GOAL_TOAST_KEY_PREFIX + new Date().toISOString().slice(0, 10);

export async function hasShownGoalToastToday(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(todayKey())) === "1";
  } catch {
    return true;
  }
}

export async function markGoalToastShownToday(): Promise<void> {
  try {
    await AsyncStorage.setItem(todayKey(), "1");
  } catch (error) {
    console.error("[DailyGoalStore] Failed to persist toast flag:", error);
  }
}
