import { useMemo } from "react";
import { useExerciseStats } from "./useExerciseStats";
import { EXERCISE_CATEGORY_MAP } from "@/src/data/exerciseCategoryMap";
import { getTimeRangeCutoff, getWeekKey, average } from "@/src/utils/insights";
import { extractPrePostSessions } from "@/src/utils/insights/extraction";
import type { TimeRange } from "@/src/constants/insights";
import type { DeepDiveConfig, DeepDiveComputedData } from "./config/types";

export function useDeepDive(
  config: DeepDiveConfig,
  timeRange: TimeRange,
): { data: DeepDiveComputedData | null; isLoading: boolean } {
  const { data: stats, isLoading } = useExerciseStats();

  const data = useMemo((): DeepDiveComputedData | null => {
    if (!stats) return null;

    const cutoff = getTimeRangeCutoff(timeRange);
    const timeFiltered = cutoff
      ? stats.entries.filter((e) => new Date(e.completed_at) >= cutoff)
      : stats.entries;

    const entries = config.exerciseTypes
      ? timeFiltered.filter((e) =>
          config.exerciseTypes!.includes(e.exercise_type),
        )
      : timeFiltered.filter(
          (e) => EXERCISE_CATEGORY_MAP[e.exercise_type] === config.category,
        );

    const sessions = extractPrePostSessions(entries, config.fieldMappings);
    const avgShift = average(sessions.map((s) => s.shift));

    const weekCounts: Record<string, number> = {};
    for (const entry of entries) {
      const wk = getWeekKey(entry.completed_at);
      weekCounts[wk] = (weekCounts[wk] || 0) + 1;
    }
    const sessionsPerWeek = Object.entries(weekCounts)
      .map(([week, count]) => ({ week, count }))
      .sort((a, b) => a.week.localeCompare(b.week));

    const custom = config.customAggregator
      ? config.customAggregator(entries)
      : {};

    return {
      entries,
      totalSessions: entries.length,
      sessions,
      avgShift,
      sessionsPerWeek,
      custom,
    };
  }, [stats, timeRange, config]);

  return { data, isLoading };
}
