import { useMemo, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useExerciseStats } from "./useExerciseStats";
import { usePersonalEffectiveness } from "./usePersonalEffectiveness";
import {
  extractTemporalEntries,
  detectTimeOfDayPattern,
  detectDayOfWeekPattern,
  getNudgeSchedule,
  type TemporalPattern,
} from "@/src/utils/insights/temporalAnalysis";
import { EXERCISE_LABELS } from "@/src/constants/insights";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TemporalPatternsData {
  timeOfDay: TemporalPattern | null;
  dayOfWeek: TemporalPattern | null;
}

const NUDGE_STORAGE_KEY = "smart_nudges_enabled";
const NUDGE_NOTIFICATION_IDS_KEY = "smart_nudge_ids";

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useTemporalPatterns(): {
  data: TemporalPatternsData | null;
  isLoading: boolean;
} {
  const { data: stats, isLoading } = useExerciseStats();
  const { data: effectiveness } = usePersonalEffectiveness();
  const scheduledRef = useRef(false);

  const data = useMemo((): TemporalPatternsData | null => {
    if (!stats || stats.totalCompleted < 5) return null;

    const temporalEntries = extractTemporalEntries(stats.entries);
    if (temporalEntries.length < 5) return null;

    const timeOfDay = detectTimeOfDayPattern(temporalEntries);
    const dayOfWeek = detectDayOfWeekPattern(temporalEntries);

    // Override bestExercise with effectiveness data if available
    if (timeOfDay && effectiveness?.bestOverall) {
      timeOfDay.bestExercise = effectiveness.bestOverall.exerciseType;
    }
    if (dayOfWeek && effectiveness?.bestOverall) {
      dayOfWeek.bestExercise = effectiveness.bestOverall.exerciseType;
    }

    if (!timeOfDay && !dayOfWeek) return null;

    return { timeOfDay, dayOfWeek };
  }, [stats, effectiveness]);

  // ── Schedule notifications when patterns detected ──────────────────────────
  useEffect(() => {
    if (!data || scheduledRef.current) return;
    scheduledRef.current = true;
    scheduleSmartNudges(data);
  }, [data]);

  return { data, isLoading };
}

// ─── Notification scheduling ─────────────────────────────────────────────────

async function scheduleSmartNudges(
  patterns: TemporalPatternsData,
): Promise<void> {
  try {
    const enabled = await AsyncStorage.getItem(NUDGE_STORAGE_KEY);
    if (enabled === "false") return;

    // Cancel existing smart nudges
    const existingIdsJson = await AsyncStorage.getItem(
      NUDGE_NOTIFICATION_IDS_KEY,
    );
    const existingIds: string[] = existingIdsJson
      ? JSON.parse(existingIdsJson)
      : [];
    for (const id of existingIds) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }

    const newIds: string[] = [];

    // Schedule time-of-day nudge
    if (patterns.timeOfDay && patterns.timeOfDay.confidence >= 0.6) {
      const schedule = getNudgeSchedule(patterns.timeOfDay);
      const exerciseLabel =
        EXERCISE_LABELS[patterns.timeOfDay.bestExercise!] ?? "a quick exercise";

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time for a check-in",
          body: `Your anxiety usually peaks soon. ${exerciseLabel} works well for you around now.`,
          data: {
            type: "smart_nudge",
            action: "open_exercises",
            exerciseType: patterns.timeOfDay.bestExercise,
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: schedule.hour,
          minute: schedule.minute,
        },
      });
      newIds.push(id);
    }

    // Schedule day-of-week nudge
    if (patterns.dayOfWeek && patterns.dayOfWeek.confidence >= 0.6) {
      const schedule = getNudgeSchedule(patterns.dayOfWeek);
      const exerciseLabel =
        EXERCISE_LABELS[patterns.dayOfWeek.bestExercise!] ?? "a quick exercise";

      if (schedule.weekday) {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: "Getting ahead of the day",
            body: `This is usually your toughest day. ${exerciseLabel} can set a better tone.`,
            data: {
              type: "smart_nudge",
              action: "open_exercises",
              exerciseType: patterns.dayOfWeek.bestExercise,
            },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: schedule.weekday,
            hour: schedule.hour,
            minute: schedule.minute,
          },
        });
        newIds.push(id);
      }
    }

    await AsyncStorage.setItem(
      NUDGE_NOTIFICATION_IDS_KEY,
      JSON.stringify(newIds),
    );
  } catch (error) {
    // Silently fail — notifications are non-critical
  }
}

// ─── Public utility: toggle nudges ──────────────────────────────────────────

export async function setSmartNudgesEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(NUDGE_STORAGE_KEY, String(enabled));
  if (!enabled) {
    const idsJson = await AsyncStorage.getItem(NUDGE_NOTIFICATION_IDS_KEY);
    const ids: string[] = idsJson ? JSON.parse(idsJson) : [];
    for (const id of ids) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
    await AsyncStorage.setItem(NUDGE_NOTIFICATION_IDS_KEY, "[]");
  }
}

export async function getSmartNudgesEnabled(): Promise<boolean> {
  const val = await AsyncStorage.getItem(NUDGE_STORAGE_KEY);
  return val !== "false"; // default to true
}
