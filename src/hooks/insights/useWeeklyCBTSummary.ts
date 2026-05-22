import { useMemo } from "react";
import { useExerciseStats } from "./useExerciseStats";
import { EXERCISE_CATEGORY_MAP } from "@/src/data/exerciseCategoryMap";
import type { ExerciseCategory, ExerciseType } from "@/src/types/exerciseFlow";
import { CATEGORY_LABELS, PRE_POST_FIELDS } from "@/src/constants/insights";
import { average } from "@/src/utils/insights";

export interface WeeklyCBTSummaryData {
  thisWeekCount: number;
  lastWeekCount: number;
  weekOverWeekChange: number | null;
  topCategory: {
    category: ExerciseCategory;
    label: string;
    count: number;
  } | null;
  avgShiftThisWeek: number | null;
  streakDays: number;
  highlights: string[];
}

export function useWeeklyCBTSummary(): {
  data: WeeklyCBTSummaryData | null;
  isLoading: boolean;
} {
  const { data: stats, isLoading } = useExerciseStats();

  const data = useMemo((): WeeklyCBTSummaryData | null => {
    if (!stats || stats.entries.length === 0) return null;

    const now = Date.now();
    const thisWeekStart = getWeekStartMs(now);
    const lastWeekStart = thisWeekStart - 7 * 86_400_000;

    const thisWeekEntries = stats.entries.filter(
      (e) => new Date(e.completed_at).getTime() >= thisWeekStart,
    );
    const lastWeekEntries = stats.entries.filter((e) => {
      const t = new Date(e.completed_at).getTime();
      return t >= lastWeekStart && t < thisWeekStart;
    });

    const thisWeekCount = thisWeekEntries.length;
    const lastWeekCount = lastWeekEntries.length;
    const weekOverWeekChange =
      lastWeekCount > 0
        ? (thisWeekCount - lastWeekCount) / lastWeekCount
        : null;

    const categoryCounts: Record<ExerciseCategory, number> = {
      cbt_core: 0,
      anxiety: 0,
      mindfulness: 0,
      overthinking: 0,
    };
    for (const entry of thisWeekEntries) {
      const cat = EXERCISE_CATEGORY_MAP[entry.exercise_type];
      if (cat) categoryCounts[cat]++;
    }

    const topEntry = Object.entries(categoryCounts)
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])[0];

    const topCategory = topEntry
      ? {
          category: topEntry[0] as ExerciseCategory,
          label: CATEGORY_LABELS[topEntry[0] as ExerciseCategory],
          count: topEntry[1],
        }
      : null;

    const shifts: number[] = [];
    for (const entry of thisWeekEntries) {
      const r = entry.response;
      if (!r) continue;
      const field = PRE_POST_FIELDS[entry.exercise_type as ExerciseType];
      if (!field) continue;
      const pre = r[field.pre];
      const post = r[field.post];
      if (typeof pre === "number" && typeof post === "number") {
        shifts.push(
          field.direction === "pre_minus_post" ? pre - post : post - pre,
        );
      }
    }
    const avgShiftThisWeek = average(shifts);

    const highlights = buildHighlights(
      thisWeekCount,
      lastWeekCount,
      avgShiftThisWeek,
      stats.currentStreak,
    );

    return {
      thisWeekCount,
      lastWeekCount,
      weekOverWeekChange,
      topCategory,
      avgShiftThisWeek,
      streakDays: stats.currentStreak,
      highlights,
    };
  }, [stats]);

  return { data, isLoading };
}

function getWeekStartMs(now: number): number {
  const d = new Date(now);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function buildHighlights(
  thisWeek: number,
  lastWeek: number,
  avgShift: number | null,
  streak: number,
): string[] {
  const highlights: string[] = [];

  if (thisWeek > lastWeek && lastWeek > 0) {
    highlights.push(
      `You're ${thisWeek - lastWeek} sessions ahead of last week`,
    );
  } else if (thisWeek > 0 && lastWeek === 0) {
    highlights.push("Great start to the week!");
  }

  if (avgShift !== null && avgShift > 2) {
    highlights.push("Your exercises are producing strong improvements");
  }

  if (streak >= 7) {
    highlights.push(`${streak}-day streak — consistency is paying off`);
  } else if (streak >= 3) {
    highlights.push(`${streak}-day streak building`);
  }

  return highlights;
}
