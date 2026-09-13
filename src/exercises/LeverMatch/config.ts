import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { LeverMatchCategoryEngine } from "@/src/components/exercise/LeverMatchCategoryEngine";
import type { Exercise } from "@/src/types/journeyV5";

function readArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
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

export const LeverMatchConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.LeverMatch,
  formats: [CourseExerciseCategoryEnum.LeverMatch],
  engine: LeverMatchCategoryEngine,
  goalLabel: "Match each habit to its real effect.",
  unavailableCopy: "This lever matching exercise is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => {
      return "Continue";
    },
    getPrimaryTransition: (_exercise, _response) => {
      return null;
    },
  },
  presentation: {
    hideFooter: (exercise, response) => !hasMatchedAllPairs(exercise, response || {}),
    hideSkip: (exercise, response) => {
      const res = response || {};
      const matched = readArray(res.matchedIds);
      return matched.length > 0 || Boolean(res.selectedLeftId) || Boolean(res.selectedRightId);
    },
  },
};
