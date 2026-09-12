import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { AssociationMeterCategoryEngine } from "@/src/components/exercise/AssociationMeterCategoryEngine";

export const AssociationMeterConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.AssociationMeter,
  formats: [CourseExerciseCategoryEnum.AssociationMeter],
  engine: AssociationMeterCategoryEngine,
  goalLabel: "See how repeated checking trains a threat association.",
  unavailableCopy: "This association meter is not available yet.",
  presentation: {
    hideFooter: (_exercise, response) => response?.hasFlipped !== true,
  },
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => {
      return response.hasFlipped === true
        ? "Continue"
        : (exercise.content?.lockedPrimaryLabel as string) || "Continue";
    },
    getPrimaryTransition: (_exercise, _response) => {
      return null;
    },
  },
};
