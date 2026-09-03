import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";

import { PrivateCheckContainer } from "@/src/exercises/PrivateCheck/PrivateCheckContainer";

export const PrivateCheckConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.PrivateCheck,
  formats: [CourseExerciseCategoryEnum.PrivateCheck],
  engine: PrivateCheckContainer,
  goalLabel: "Notice familiar loops without scoring or judgment.",
  unavailableCopy: "This private check is not available yet.",
  presentation: {
    hideSkip: (_exercise, response) => response?.phase === "feedback",
  },
  interaction: {
    submissionMode: "explicit",
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
