import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useExerciseStats } from "./useExerciseStats";
import { useInProgressEntries } from "./useInProgressEntries";
import { usePracticeCounts } from "@/src/domains/exercises/ui/containers/usePracticeCounts";
import type { TopicCounts } from "@/src/domains/exercises/domain/practice";
import type { ExerciseCategory } from "@/src/types/exerciseFlow";
import { EXERCISE_CATEGORY_MAP } from "@/src/data/exerciseCategoryMap";
import type { TFunction } from "i18next";
import { categoryLabel, distortionLabel } from "./i18n";
import { getTimeRangeCutoff, average, countBy } from "@/src/utils/insights";
import type { TimeRange } from "@/src/constants/insights";

export type { TimeRange } from "@/src/constants/insights";

export interface CategorySummary {
  category: ExerciseCategory;
  label: string;
  count: number;
  /** paused runs in the selected range: shown beside completed ones, never counted as done */
  inProgress: number;
  topStat: string;
}

export interface ReframeWin {
  before: number;
  after: number;
  sessions: number;
}

export interface HeatmapDay {
  date: string;
  count: number;
}

export interface InsightsOverview {
  totalExercises: number;
  /** all-time count: unlocking Practice must not depend on the selected time range */
  lifetimeExercises: number;
  /** completed in the selected range before 12:00 local */
  doneBeforeNoon: number;
  avgEmotionShift: number | null;
  topDistortion: { label: string; count: number } | null;
  currentStreak: number;
  reframeSuccessRate: number | null;
  reframeWin: ReframeWin | null;
  heatmap: HeatmapDay[];
  categories: CategorySummary[];
}

export function useInsightsOverview(timeRange: TimeRange): {
  data: InsightsOverview | null;
  isLoading: boolean;
  isError: boolean;
} {
  const { t } = useTranslation("common");
  const { data: stats, isLoading, isError } = useExerciseStats();
  const { data: paused } = useInProgressEntries();
  // AD-16: the shared count feeds the totals and every topic plot
  const { data: counts, isLoading: countsLoading, isError: countsError } = usePracticeCounts();

  const data = useMemo((): InsightsOverview | null => {
    if (!stats || !counts) return null;

    const cutoff = getTimeRangeCutoff(timeRange);
    const filtered = cutoff
      ? stats.entries.filter((e) => new Date(e.completed_at) >= cutoff)
      : stats.entries;

    const heatmap = buildHeatmap(stats.entries);
    const topDistortion = getTopDistortion(filtered, t);
    const avgEmotionShift = getAvgEmotionShift(filtered);
    const reframeSuccessRate = getReframeSuccessRate(filtered);
    const reframeWin = getReframeWin(filtered);
    const pausedInRange = cutoff ? (paused ?? []).filter((e) => new Date(e.created_at) >= cutoff) : (paused ?? []);
    const categories = buildCategorySummaries(filtered, counts.byTopic, pausedInRange, topDistortion, t);

    return {
      totalExercises: counts.lifetime,
      lifetimeExercises: counts.lifetime,
      doneBeforeNoon: stats.entries.filter((e) => new Date(e.completed_at).getHours() < 12).length,
      avgEmotionShift,
      topDistortion,
      currentStreak: stats.currentStreak,
      reframeSuccessRate,
      reframeWin,
      heatmap,
      categories,
    };
  }, [stats, counts, paused, timeRange, t]);

  return { data, isLoading: isLoading || countsLoading, isError: isError || countsError };
}

function buildHeatmap(entries: { completed_at: string }[]): HeatmapDay[] {
  const heatmapCutoff = new Date(Date.now() - 84 * 86_400_000);
  const counts = countBy(
    entries.filter((e) => new Date(e.completed_at) >= heatmapCutoff),
    (e) => e.completed_at.slice(0, 10),
  );
  return Object.entries(counts).map(([date, count]) => ({ date, count }));
}

function getTopDistortion(
  entries: { response: Record<string, any> }[],
  t: TFunction,
): { label: string; count: number } | null {
  const counts = countBy(
    entries.flatMap((e) => (e.response?.selectedDistortions as string[]) ?? []),
    (d) => d,
  );
  const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
  if (sorted.length === 0) return null;
  return {
    label: distortionLabel(t, sorted[0][0]),
    count: sorted[0][1],
  };
}

function getAvgEmotionShift(
  entries: { exercise_type: string; response: Record<string, any> }[],
): number | null {
  const shifts: number[] = [];
  for (const entry of entries) {
    if (entry.exercise_type !== "thought_reframing") continue;
    const emotions = entry.response?.selectedEmotions;
    if (!Array.isArray(emotions)) continue;
    for (const em of emotions) {
      if (
        typeof em.initial_intensity === "number" &&
        typeof em.final_intensity === "number"
      ) {
        shifts.push(em.initial_intensity - em.final_intensity);
      }
    }
  }
  return average(shifts);
}

function getReframeWin(
  entries: { exercise_type: string; response: Record<string, any> }[],
): ReframeWin | null {
  const before: number[] = [];
  const after: number[] = [];
  let sessions = 0;
  for (const entry of entries) {
    if (entry.exercise_type !== "thought_reframing") continue;
    const emotions = entry.response?.selectedEmotions;
    if (!Array.isArray(emotions)) continue;
    const rated = emotions.filter(
      (em: any) => typeof em.initial_intensity === "number" && typeof em.final_intensity === "number",
    );
    if (rated.length === 0) continue;
    sessions += 1;
    for (const em of rated) {
      before.push(em.initial_intensity);
      after.push(em.final_intensity);
    }
  }
  const b = average(before);
  const a = average(after);
  return b === null || a === null ? null : { before: b, after: a, sessions };
}

function getReframeSuccessRate(
  entries: { exercise_type: string; response: Record<string, any> }[],
): number | null {
  const reframing = entries.filter(
    (e) => e.exercise_type === "thought_reframing",
  );
  if (reframing.length === 0) return null;
  const successes = reframing.filter((entry) => {
    const emotions = entry.response?.selectedEmotions;
    if (!Array.isArray(emotions)) return false;
    return emotions.some(
      (em: any) =>
        typeof em.initial_intensity === "number" &&
        typeof em.final_intensity === "number" &&
        em.initial_intensity - em.final_intensity >= 2,
    );
  }).length;
  return successes / reframing.length;
}

function buildCategorySummaries(
  entries: { exercise_type: string; response: Record<string, any> }[],
  catCounts: TopicCounts,
  paused: { exercise_type: string }[],
  topDistortion: { label: string; count: number } | null,
  t: TFunction,
): CategorySummary[] {
  const pausedCounts: Record<ExerciseCategory, number> = { cbt_core: 0, mindfulness: 0, anxiety: 0, overthinking: 0 };
  for (const entry of paused) {
    const cat = EXERCISE_CATEGORY_MAP[entry.exercise_type as keyof typeof EXERCISE_CATEGORY_MAP];
    if (cat) pausedCounts[cat]++;
  }

  return [
    {
      category: "cbt_core",
      label: categoryLabel(t, "cbt_core"),
      count: catCounts.cbt_core,
      inProgress: pausedCounts.cbt_core,
      topStat: topDistortion
        ? t("insights.overview.top", { label: topDistortion.label })
        : t("insights.overview.sessions", { count: catCounts.cbt_core }),
    },
    {
      category: "anxiety",
      label: categoryLabel(t, "anxiety"),
      count: catCounts.anxiety,
      inProgress: pausedCounts.anxiety,
      topStat: getAnxietyStat(entries, t),
    },
    {
      category: "mindfulness",
      label: categoryLabel(t, "mindfulness"),
      count: catCounts.mindfulness,
      inProgress: pausedCounts.mindfulness,
      topStat: t("insights.overview.sessions", { count: catCounts.mindfulness }),
    },
    {
      category: "overthinking",
      label: categoryLabel(t, "overthinking"),
      count: catCounts.overthinking,
      inProgress: pausedCounts.overthinking,
      topStat: t("insights.overview.sessions", { count: catCounts.overthinking }),
    },
  ];
}

function getAnxietyStat(
  entries: { exercise_type: string; response: Record<string, any> }[],
  t: TFunction,
): string {
  const anxietyEntries = entries.filter(
    (e) =>
      EXERCISE_CATEGORY_MAP[
        e.exercise_type as keyof typeof EXERCISE_CATEGORY_MAP
      ] === "anxiety",
  );
  if (anxietyEntries.length === 0) return t("insights.ui.notStarted");

  const shifts: number[] = [];
  for (const e of anxietyEntries) {
    const pre = e.response?.preAnxietyRating ?? e.response?.anxietyBefore;
    const post = e.response?.postAnxietyRating ?? e.response?.anxietyAfter;
    if (typeof pre === "number" && typeof post === "number") {
      shifts.push(pre - post);
    }
  }
  const avg = average(shifts);
  if (avg === null) return t("insights.overview.sessions", { count: anxietyEntries.length });
  return t("insights.overview.average", { value: avg.toFixed(1) });
}
