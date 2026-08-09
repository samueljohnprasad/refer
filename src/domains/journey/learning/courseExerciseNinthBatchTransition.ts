import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";

export function getNinthBatchPrimaryLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string | undefined {
  switch (exercise.type) {
    case CourseExerciseCategoryEnum.LeverCheck:
      return readStringArray(response.pulledLeverIds).length >= 2
        ? "Continue"
        : "Pull both levers";
    case CourseExerciseCategoryEnum.PrivateCheck:
      return "Continue";
    case CourseExerciseCategoryEnum.SameButDifferent:
      return getSameButDifferentLabel(exercise, response);
    default:
      return undefined;
  }
}

export function getNinthBatchPrimaryTransition(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition | undefined {
  if (
    exercise.type !== CourseExerciseCategoryEnum.PrivateCheck ||
    response.phase === "feedback"
  ) {
    return undefined;
  }

  return {
    kind: "response",
    ready: true,
    response: { ...response, phase: "feedback", isCorrect: true },
  };
}

function getSameButDifferentLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string {
  const openedCount = readNumberArray(response.openedRowIndexes).length;
  const rowCount = Array.isArray(exercise.content?.rows)
    ? exercise.content.rows.length
    : 0;
  return rowCount > 0 && openedCount >= rowCount
    ? "Continue"
    : "Tap each row above";
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function readNumberArray(value: unknown): number[] {
  return Array.isArray(value)
    ? value.filter((item): item is number => typeof item === "number")
    : [];
}
