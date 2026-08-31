import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";

import type { Exercise } from "@/src/types/journeyV5";

import { PrivateCheckCategoryEngine } from "@/src/components/exercise/PrivateCheckCategoryEngine";

export const PrivateCheckConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.PrivateCheck,
  formats: [CourseExerciseCategoryEnum.PrivateCheck],
  engine: PrivateCheckCategoryEngine,
  goalLabel: "Notice familiar loops without scoring or judgment.",
  unavailableCopy: "This private check is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (_exercise: Exercise, _response: Record<string, unknown>) => "Continue",
    getPrimaryTransition: (_exercise: Exercise, response: Record<string, unknown>) => {
      if (response.phase === "feedback") {
        return null;
      }
      return {
        kind: "response",
        ready: true,
        response: { ...response, phase: "feedback", isCorrect: true },
      };
    },
  },
};
