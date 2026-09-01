import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";
import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";

import { SameButDifferentCategoryEngine } from "@/src/components/exercise/SameButDifferentCategoryEngine";

function readNumberArray(value: unknown): number[] {
  return Array.isArray(value)
    ? value.filter((item): item is number => typeof item === "number")
    : [];
}

export const SameButDifferentConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.SameButDifferent,
  formats: [CourseExerciseCategoryEnum.SameButDifferent],
  engine: SameButDifferentCategoryEngine,
  goalLabel: "Choose the right first move for worry or body anxiety.",
  unavailableCopy: "This comparison is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise: Exercise, response: Record<string, unknown>) => {
      const openedCount = readNumberArray(response.openedRowIndexes).length;
      const rowCount = Array.isArray(exercise.content?.rows)
        ? exercise.content.rows.length
        : 0;
      return rowCount > 0 && openedCount >= rowCount
        ? "Continue"
        : "Find differences above";
    },
    getPrimaryTransition: (_exercise: Exercise, _response: Record<string, unknown>) => null,
  },
};
