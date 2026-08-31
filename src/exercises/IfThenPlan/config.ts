import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { IfThenPlanCategoryEngine } from "@/src/components/exercise/IfThenPlanCategoryEngine";
import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";

function getIfThenLabel(response: Record<string, unknown>): string {
  if (response.phase === "feedback") return "Continue";
  return hasPlan(response) ? "Save to My Plans" : "Pick a cue and a move";
}

function getIfThenTransition(
  response: Record<string, unknown>,
): CoursePrimaryTransition | undefined {
  if (response.phase !== "building" || !hasPlan(response)) return undefined;
  return {
    kind: "response",
    ready: true,
    response: { ...response, phase: "feedback", isCorrect: true },
  };
}

function hasPlan(response: Record<string, unknown>): boolean {
  return isIndex(response.cueIndex) && isIndex(response.actionIndex);
}

function isIndex(value: unknown): boolean {
  return typeof value === "number" && value >= 0;
}

export const IfThenPlanConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.IfThenPlan,
  formats: [CourseExerciseCategoryEnum.IfThenPlan],
  engine: IfThenPlanCategoryEngine,
  goalLabel: "Pair a precise cue with one rehearsable response.",
  unavailableCopy: "This if-then plan is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => getIfThenLabel(response),
    getPrimaryTransition: (exercise, response) => getIfThenTransition(response) ?? null,
  },
};
