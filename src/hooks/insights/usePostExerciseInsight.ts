import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { ExerciseType, ExerciseCategory } from "@/src/types/exerciseFlow";
import { useExerciseStatsByType } from "./useExerciseStats";
import { PRE_POST_FIELDS } from "@/src/constants/insights";
import { categoryLabel } from "./i18n";
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
  const { t } = useTranslation("common");
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
          message: t("insights.postExercise.milestone", { count: m, category: categoryLabel(t, category).toLowerCase() }),
          detail: t("insights.nudges.consistency"),
          tone: "celebrating" as const,
        };
      }
    }

    // Show shift for this session if significant
    if (shift !== null && shift > 0) {
      const avgShift = computeAvgShift(entries, exerciseType);
      const detail =
        avgShift !== null
          ? t("insights.postExercise.averageShift", { value: avgShift.toFixed(1), note: shift > avgShift ? t("insights.postExercise.aboveAverage") : t("insights.postExercise.buildingHabit") })
          : null;

      return {
        message: t("insights.postExercise.feelBetter", { shift, plural: shift > 1 ? "s" : "", verb: t(`insights.postExercise.verbs.${category}`, { defaultValue: SHIFT_VERBS[category] || "better" }) }),
        detail,
        tone: shift >= 3 ? ("celebrating" as const) : ("encouraging" as const),
      };
    }

    // Weekly count
    if (thisWeekForType > 1) {
      return {
        message: t("insights.postExercise.weekSession", { count: thisWeekForType + 1, ordinal: getOrdinalSuffix(thisWeekForType + 1) }),
        detail:
          totalForType > 5 ? t("insights.postExercise.totalAndCounting", { count: totalForType + 1 }) : null,
        tone: "encouraging" as const,
      };
    }

    // Generic encouraging
    if (totalForType >= 1) {
      return {
        message: t("insights.postExercise.completed", { count: totalForType + 1, category: categoryLabel(t, category).toLowerCase() }),
        detail: t("insights.postExercise.strengthensSkills"),
        tone: "encouraging" as const,
      };
    }

    return {
      message: t("insights.postExercise.firstDone"),
      detail: t("insights.postExercise.starting"),
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
