import { useMemo } from "react";
import type { ExerciseType, ExerciseCategory } from "@/src/types/exerciseFlow";
import { useExerciseStatsByType } from "./useExerciseStats";
import { PRE_POST_FIELDS, CATEGORY_LABELS } from "@/src/constants/insights";
import { average } from "@/src/utils/insights";

export interface PostExerciseInsight {
  message: string;
  detail: string | null;
  tone: "encouraging" | "celebrating" | "curious";
}

function getShiftFromResponse(
  response: Record<string, any>,
  exerciseType: ExerciseType,
): number | null {
  const field = PRE_POST_FIELDS[exerciseType];
  if (!field) return null;

  const pre = response[field.pre];
  const post = response[field.post];
  if (typeof pre !== "number" || typeof post !== "number") return null;

  return field.direction === "pre_minus_post" ? pre - post : post - pre;
}

const SHIFT_VERBS: Partial<Record<ExerciseCategory, string>> = {
  mindfulness: "calmer",
  anxiety: "less anxious",
  overthinking: "less stuck",
};

export function usePostExerciseInsight(
  exerciseType: ExerciseType,
  currentResponse: Record<string, any>,
): PostExerciseInsight | null {
  const typeStats = useExerciseStatsByType(exerciseType);

  return useMemo(() => {
    if (!typeStats) return null;

    const { totalForType, thisWeekForType, category, entries } = typeStats;
    const shift = getShiftFromResponse(currentResponse, exerciseType);

    // Milestone celebrations
    const milestones = [50, 25, 10, 5];
    for (const m of milestones) {
      if (totalForType + 1 === m) {
        return {
          message: `That's your ${m}th ${CATEGORY_LABELS[category].toLowerCase()} exercise!`,
          detail: "Consistency is the #1 predictor of progress.",
          tone: "celebrating" as const,
        };
      }
    }

    // Show shift for this session if significant
    if (shift !== null && shift > 0) {
      const avgShift = computeAvgShift(entries, exerciseType);
      const detail =
        avgShift !== null
          ? `Your average shift is ${avgShift.toFixed(1)} points · ${shift > avgShift ? "this session was above average!" : "building the habit matters most."}`
          : null;

      return {
        message: `You feel ${shift} point${shift > 1 ? "s" : ""} ${SHIFT_VERBS[category] || "better"} than when you started.`,
        detail,
        tone: shift >= 3 ? ("celebrating" as const) : ("encouraging" as const),
      };
    }

    // Weekly count
    if (thisWeekForType > 1) {
      return {
        message: `That's your ${thisWeekForType + 1}${getOrdinalSuffix(thisWeekForType + 1)} session this week.`,
        detail:
          totalForType > 5 ? `${totalForType + 1} total and counting.` : null,
        tone: "encouraging" as const,
      };
    }

    // Generic encouraging
    if (totalForType >= 1) {
      return {
        message: `${totalForType + 1} ${CATEGORY_LABELS[category].toLowerCase()} sessions completed.`,
        detail: "Every practice session strengthens your skills.",
        tone: "encouraging" as const,
      };
    }

    return {
      message: "First one done · that's the hardest part.",
      detail: "You've taken the most important step: starting.",
      tone: "celebrating" as const,
    };
  }, [typeStats, currentResponse, exerciseType]);
}

function computeAvgShift(
  entries: { response: Record<string, any>; exercise_type: ExerciseType }[],
  exerciseType: ExerciseType,
): number | null {
  const shifts: number[] = [];
  for (const entry of entries) {
    const s = getShiftFromResponse(entry.response, exerciseType);
    if (s !== null) shifts.push(s);
  }
  return average(shifts);
}

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
