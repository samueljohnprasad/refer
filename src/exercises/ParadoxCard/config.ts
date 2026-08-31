import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { ParadoxCardCategoryEngine } from "@/src/components/exercise/ParadoxCardCategoryEngine";

export const ParadoxCardConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.ParadoxCard,
    formats: [CourseExerciseCategoryEnum.ParadoxCard],
    engine: ParadoxCardCategoryEngine,
    goalLabel: "Experience why forcing calm can feed the alarm.",
    unavailableCopy: "This paradox exercise is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => response.revealed === true ? "Continue" : "Push the button above",
    getPrimaryTransition: (exercise, response) => null,
  },

};
