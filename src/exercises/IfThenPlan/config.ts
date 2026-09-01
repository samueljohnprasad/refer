import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { IfThenPlanCategoryEngine } from "@/src/components/exercise/IfThenPlanCategoryEngine";
import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";

function getIfThenLabel(response: Record<string, unknown>): string {
  if (response.phase === "complete" || response.phase === "feedback") return "Continue";
  return hasPlan(response) ? "Save to My Plans" : "Pick a cue and a move";
}

function getIfThenTransition(
  response: Record<string, unknown>,
): CoursePrimaryTransition | undefined {
  if (response.phase !== "review" || !hasPlan(response)) return undefined;
  return {
    kind: "response",
    ready: true,
    response: { ...response, phase: "complete", isCorrect: true },
  };
}

function hasPlan(response: Record<string, unknown>): boolean {
  return typeof response.cueId === "string" && typeof response.actionId === "string";
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
