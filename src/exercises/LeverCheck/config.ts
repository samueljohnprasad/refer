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
    getPrimaryLabel: (exercise: Exercise, response: Record<string, unknown>) => {
      const levers = Array.isArray(exercise.content?.levers) ? exercise.content?.levers : [];
      const totalLevers = levers.length > 0 ? levers.length : 2;
      const pulledCount = readStringArray(response.pulledLeverIds).length;
      if (pulledCount >= totalLevers) {
        return "Continue";
      }
      return null;
    },
    getPrimaryTransition: (exercise: Exercise, response: Record<string, unknown>) => {
      const levers = Array.isArray(exercise.content?.levers) ? exercise.content?.levers : [];
      const totalLevers = levers.length > 0 ? levers.length : 2;
      const pulledCount = readStringArray(response.pulledLeverIds).length;
      if (pulledCount >= totalLevers) {
        return { kind: "check" };
      }
      return null;
    },
  },
  presentation: {
    hidePrimary: (exercise: Exercise, response: Record<string, unknown>) => {
      const levers = Array.isArray(exercise.content?.levers) ? exercise.content?.levers : [];
      const totalLevers = levers.length > 0 ? levers.length : 2;
      const pulledCount = readStringArray(response?.pulledLeverIds).length;
      return pulledCount < totalLevers;
    },
    hideSkip: (exercise: Exercise, response: Record<string, unknown>) => {
      return readStringArray(response?.pulledLeverIds).length > 0;
    }
  }
};
