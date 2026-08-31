import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";
import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";

import { LeverCheckCategoryEngine } from "@/src/components/exercise/LeverCheckCategoryEngine";

function readStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export const LeverCheckConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.LeverCheck,
  formats: [CourseExerciseCategoryEnum.LeverCheck],
  engine: LeverCheckCategoryEngine,
  goalLabel: "Compare relief with a move that reduces tomorrow’s load.",
  unavailableCopy: "This lever check is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (_exercise: Exercise, response: Record<string, unknown>) => {
      return readStringArray(response.pulledLeverIds).length >= 2
        ? "Continue"
        : "Pull both levers";
    },
    getPrimaryTransition: (_exercise: Exercise, _response: Record<string, unknown>) => null,
  },
};
