import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { LensReplayCategoryEngine } from "@/src/components/exercise/LensReplayCategoryEngine";
import type { Exercise } from "@/src/types/journeyV5";

function readArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
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

export const LensReplayConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.LensReplay,
  formats: [CourseExerciseCategoryEnum.LensReplay],
  engine: LensReplayCategoryEngine,
  goalLabel: "Separate one moment into event, alarm, and story.",
  unavailableCopy: "This lens replay is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => {
      return hasSeenAllHighlights(exercise, response)
        ? "Continue"
        : "Tap the highlights above";
    },
    getPrimaryTransition: (_exercise, _response) => {
      return null;
    },
  },
};
