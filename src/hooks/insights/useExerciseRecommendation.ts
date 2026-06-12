import { useMemo } from "react";
import { useExerciseStats } from "./useExerciseStats";
import { usePersonalEffectiveness } from "./usePersonalEffectiveness";
import { useTemporalPatterns } from "./useTemporalPatterns";
import type { ExerciseType, ExerciseCategory } from "@/src/types/exerciseFlow";
import {
  EXERCISE_CATEGORY_MAP,
  getExerciseTypesByCategory,
} from "@/src/data/exerciseCategoryMap";
import { CATEGORY_LABELS, EXERCISE_LABELS } from "@/src/constants/insights";
import { countBy } from "@/src/utils/insights";

export interface ExerciseRecommendation {
  exerciseType: ExerciseType;
  reason: string;
}

function getTopDistortion(
  entries: { response: Record<string, any> }[],
): string | null {
  const counts = countBy(
    entries.flatMap((e) => (e.response?.selectedDistortions as string[]) ?? []),
    (d) => d,
  );
  const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
  return sorted.length > 0 ? sorted[0][0] : null;
}

function getLeastPracticedCategory(
  categoryCount: Record<ExerciseCategory, number>,
): ExerciseCategory {
  const entries = Object.entries(categoryCount) as [ExerciseCategory, number][];
  entries.sort(([, a], [, b]) => a - b);
  return entries[0][0];
}

export function useExerciseRecommendation(): ExerciseRecommendation | null {
  const { data: stats } = useExerciseStats();
  const { data: effectiveness } = usePersonalEffectiveness();
  const { data: temporalPatterns } = useTemporalPatterns();

  return useMemo(() => {
    if (!stats || stats.totalCompleted < 5) return null;

    const { entries, categoryCount } = stats;

    // ── Priority 1: Temporal context ────────────────────────────────────────
    // If we're within 1 hour of detected peak, suggest the pattern's best exercise
    if (temporalPatterns?.timeOfDay) {
      const now = new Date().getHours();
      const peakStart = temporalPatterns.timeOfDay.peakWindow.start;
      const hoursBefore = peakStart - now;
      if (
        hoursBefore >= 0 &&
        hoursBefore <= 1 &&
        temporalPatterns.timeOfDay.bestExercise
      ) {
        const label =
          EXERCISE_LABELS[temporalPatterns.timeOfDay.bestExercise] ??
          "this exercise";
        return {
          exerciseType: temporalPatterns.timeOfDay.bestExercise,
          reason: `Your anxiety usually peaks soon. ${label} works best for you right now.`,
        };
      }
    }

    // ── Priority 2: Personal effectiveness data ─────────────────────────────
    // Use actual measured effectiveness when available
    if (effectiveness?.bestOverall) {
      const best = effectiveness.bestOverall;
      return {
        exerciseType: best.exerciseType,
        reason: `Works best for you — drops intensity by ${best.avgDrop} per session.`,
      };
    }

    // ── Priority 3: Heuristic fallbacks (when < 5 entries with pre/post) ────

    // Rule: Top distortion is catastrophizing → suggest decatastrophizing
    const reframingEntries = entries.filter(
      (e) => e.exercise_type === "thought_reframing",
    );
    const topDistortion = getTopDistortion(reframingEntries);
    if (topDistortion === "catastrophizing") {
      return {
        exerciseType: "decatastrophizing",
        reason:
          "Your top thinking trap is catastrophizing — this targets it directly.",
      };
    }

    // Rule: User only does catchers, never reframing
    const catcherCount = entries.filter(
      (e) => e.exercise_type === "thought_catcher",
    ).length;
    const reframingCount = reframingEntries.length;
    if (catcherCount >= 3 && reframingCount === 0) {
      return {
        exerciseType: "thought_reframing",
        reason:
          "Go deeper on your thoughts — try reframing what you've caught.",
      };
    }

    // Rule: No mindfulness in 7+ days
    const mindfulnessEntries = entries.filter(
      (e) => EXERCISE_CATEGORY_MAP[e.exercise_type] === "mindfulness",
    );
    const lastMindfulness = mindfulnessEntries[0];
    if (!lastMindfulness || daysSince(lastMindfulness.completed_at) >= 7) {
      return {
        exerciseType: "mindful_breathing_1min",
        reason: "A quick breathing session can shift your whole day.",
      };
    }

    // Rule: Anxiety exercises show high scores
    const anxietyEntries = entries.filter(
      (e) => EXERCISE_CATEGORY_MAP[e.exercise_type] === "anxiety",
    );
    if (anxietyEntries.length >= 2) {
      const avgPre =
        anxietyEntries.reduce((sum, e) => {
          const pre =
            e.response?.preAnxietyRating ?? e.response?.anxietyBefore ?? 0;
          return sum + pre;
        }, 0) / anxietyEntries.length;

      if (avgPre >= 7) {
        return {
          exerciseType: "grounding_54321",
          reason:
            "Your anxiety levels have been high — grounding can help fast.",
        };
      }
    }

    // Rule: Suggest least-practiced category
    const leastCategory = getLeastPracticedCategory(categoryCount);
    const typesInCategory = getExerciseTypesByCategory(leastCategory);
    if (typesInCategory.length > 0) {
      return {
        exerciseType: typesInCategory[0],
        reason: `You haven't explored ${CATEGORY_LABELS[leastCategory].toLowerCase()} much — give it a try.`,
      };
    }

    return null;
  }, [stats, effectiveness, temporalPatterns]);
}

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
}
