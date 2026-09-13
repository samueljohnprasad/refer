// ponytail: explicit interaction config for surge diagram
import type { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { SurgeDiagramCategoryEngine } from "@/src/components/exercise/SurgeDiagramCategoryEngine";
import type { Exercise } from "@/src/types/journeyV5";

export const SurgeDiagramConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.SurgeDiagram,
  formats: [CourseExerciseCategoryEnum.SurgeDiagram],
  engine: SurgeDiagramCategoryEngine,
  goalLabel: "Follow how an alarm surge changes over time.",
  unavailableCopy: "This surge diagram is not available yet.",
  interaction: {
    // ponytail: explicit submission so scrubber remains interactive
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
