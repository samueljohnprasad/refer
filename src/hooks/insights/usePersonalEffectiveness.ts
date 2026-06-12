import { useMemo } from "react";
import { useExerciseStats } from "./useExerciseStats";
import type { ExerciseType, ExerciseCategory } from "@/src/types/exerciseFlow";
import { EXERCISE_CATEGORY_MAP } from "@/src/data/exerciseCategoryMap";
import {
  PRE_POST_FIELDS,
  EXERCISE_LABELS,
  CATEGORY_LABELS,
} from "@/src/constants/insights";
import { average } from "@/src/utils/insights";

export interface EffectivenessScore {
  exerciseType: ExerciseType;
  exerciseLabel: string;
  avgDrop: number;
  sampleSize: number;
  category: ExerciseCategory;
}

export interface PersonalEffectiveness {
  ranked: EffectivenessScore[];
  bestOverall: EffectivenessScore | null;
  bestForAnxiety: EffectivenessScore | null;
  bestForOverthinking: EffectivenessScore | null;
  bestForMindfulness: EffectivenessScore | null;
  bestForCBT: EffectivenessScore | null;
}

const MIN_SAMPLE = 2;

export function usePersonalEffectiveness(): {
  data: PersonalEffectiveness | null;
  isLoading: boolean;
} {
  const { data: stats, isLoading } = useExerciseStats();

  const data = useMemo((): PersonalEffectiveness | null => {
    if (!stats || stats.totalCompleted < 5) return null;

    const grouped: Record<string, number[]> = {};

    for (const entry of stats.entries) {
      const field = PRE_POST_FIELDS[entry.exercise_type];
      if (!field) continue;

      const pre = entry.response?.[field.pre];
      const post = entry.response?.[field.post];
      if (typeof pre !== "number" || typeof post !== "number") continue;

      const shift =
        field.direction === "pre_minus_post" ? pre - post : post - pre;

      if (!grouped[entry.exercise_type]) {
        grouped[entry.exercise_type] = [];
      }
      grouped[entry.exercise_type].push(shift);
    }

    const scores: EffectivenessScore[] = [];

    for (const [type, shifts] of Object.entries(grouped)) {
      if (shifts.length < MIN_SAMPLE) continue;
      const avg = average(shifts);
      if (avg === null) continue;

      scores.push({
        exerciseType: type as ExerciseType,
        exerciseLabel: EXERCISE_LABELS[type as ExerciseType] ?? type,
        avgDrop: Math.round(avg * 10) / 10,
        sampleSize: shifts.length,
        category: EXERCISE_CATEGORY_MAP[type as ExerciseType],
      });
    }

    scores.sort((a, b) => b.avgDrop - a.avgDrop);

    const bestForCategory = (cat: ExerciseCategory) =>
      scores.find((s) => s.category === cat) ?? null;

    return {
      ranked: scores,
      bestOverall: scores[0] ?? null,
      bestForAnxiety: bestForCategory("anxiety"),
      bestForOverthinking: bestForCategory("overthinking"),
      bestForMindfulness: bestForCategory("mindfulness"),
      bestForCBT: bestForCategory("cbt_core"),
    };
  }, [stats]);

  return { data, isLoading };
}
