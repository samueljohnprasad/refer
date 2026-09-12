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
    hideSkip: (_exercise, response) => Boolean(response?.selectedChoiceId),
    hideFooter: (_exercise, response) => {
      const phase = response?.phase as string;
      return phase !== "complete";
    },
  },
  interaction: {
    submissionMode: "explicit",
    completesDirectly: true,
    getPrimaryLabel: () => "Continue",
    getPrimaryTransition: () => null,
  },
};
