import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";

export function getFifthBatchPrimaryLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string | undefined {
  switch (exercise.type) {
    case CourseExerciseCategoryEnum.ParadoxCard:
      return response.revealed === true ? "Continue" : "Push the button above";
    case CourseExerciseCategoryEnum.OneLineReveal:
      return response.revealed === true ? "Continue" : "Reveal the rest";
    case CourseExerciseCategoryEnum.WhatIfMachine:
      return getWhatIfLabel(exercise, response);
    default:
      return undefined;
  }
}

export function getFifthBatchPrimaryTransition(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition | undefined {
  switch (exercise.type) {
    case CourseExerciseCategoryEnum.OneLineReveal:
      return response.revealed === true
        ? undefined
        : {
            kind: "response",
            ready: true,
            response: { ...response, revealed: true },
          };
    case CourseExerciseCategoryEnum.WhatIfMachine:
      return response.selectedOptionId && response.running !== true
        ? {
            kind: "response",
            ready: false,
            response: { ...response, running: true, visibleStepCount: 0 },
          }
        : undefined;
    default:
      return undefined;
  }
}

function getWhatIfLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string {
  if (!response.selectedOptionId) return "Make your bet first";
  if (response.running !== true) return "Run it";

  const stepCount = Array.isArray(exercise.content?.steps)
    ? exercise.content.steps.length
    : 0;
  const visibleStepCount =
    typeof response.visibleStepCount === "number"
      ? response.visibleStepCount
      : 0;
  return visibleStepCount >= stepCount ? "Continue" : "Watch…";
}
