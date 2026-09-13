import type { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { TwoDialSandboxCategoryEngine } from "@/src/components/exercise/TwoDialSandboxCategoryEngine";
import type { Exercise } from "@/src/types/journeyV5";

export const TwoDialSandboxConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.TwoDialSandbox,
  formats: [CourseExerciseCategoryEnum.TwoDialSandbox],
  engine: TwoDialSandboxCategoryEngine,
  goalLabel: "Explore how demand and recovery shape your week.",
  unavailableCopy: "This two-dial model is not available yet.",
  interaction: {
    // ponytail: explicit submission so sandbox dials remain interactive
    submissionMode: "explicit",
    completesDirectly: true,
    getPrimaryLabel: () => "Continue",
  },
  presentation: {
    showsFeedbackInline: () => true,
    hideFooter: (exercise: Exercise, response: Record<string, unknown> | null) => {
      return !response?.isComplete;
    },
    hideSkip: (exercise: Exercise, response: Record<string, unknown> | null) => {
      return Boolean(response?.hasInteracted || response?.isComplete);
    },
  },
};
