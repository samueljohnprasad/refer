import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";

export function getTenthBatchPrimaryLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string | undefined {
  switch (exercise.type) {
    case CourseExerciseCategoryEnum.SocraticDialogue:
      return response.done === true ? "Continue" : "Reply above";
    case CourseExerciseCategoryEnum.AssociationMeter:
      return response.hasFlipped === true
        ? "Continue"
        : "Run evenings until the link flips";
    case CourseExerciseCategoryEnum.LensReplay:
      return hasSeenAllHighlights(exercise, response)
        ? "Continue"
        : "Tap the highlights above";
    case CourseExerciseCategoryEnum.ToolkitShelf:
      return typeof response.selectedMomentIndex === "number"
        ? "Continue"
        : "Tap a moment above";
    case CourseExerciseCategoryEnum.LeverMatch:
      return hasMatchedAllPairs(exercise, response)
        ? "Continue"
        : "Match all pairs";
    default:
      return undefined;
  }
}

export function getTenthBatchPrimaryTransition(
  _exercise: Exercise,
  _response: Record<string, unknown>,
): CoursePrimaryTransition | undefined {
  return undefined;
}

function hasSeenAllHighlights(
  exercise: Exercise,
  response: Record<string, unknown>,
): boolean {
  const segments = Array.isArray(exercise.content?.segments)
    ? exercise.content.segments
    : [];
  const highlightCount = segments.filter((segment) => {
    return Boolean(
      segment &&
      typeof segment === "object" &&
      !Array.isArray(segment) &&
      typeof (segment as Record<string, unknown>).key === "string",
    );
  }).length;
  return readArray(response.seenSegmentIndexes).length >= highlightCount;
}

function hasMatchedAllPairs(
  exercise: Exercise,
  response: Record<string, unknown>,
): boolean {
  const pairCount = Array.isArray(exercise.content?.pairs)
    ? exercise.content.pairs.length
    : 0;
  return pairCount > 0 && readArray(response.matchedIds).length >= pairCount;
}

function readArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}
