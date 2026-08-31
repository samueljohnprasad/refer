import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { OneLineRevealCategoryEngine } from "@/src/components/exercise/OneLineRevealCategoryEngine";

export const OneLineRevealConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.OneLineReveal,
    formats: [CourseExerciseCategoryEnum.OneLineReveal],
    engine: OneLineRevealCategoryEngine,
    goalLabel: "Complete one useful idea about avoidance.",
    unavailableCopy: "This one-line reveal is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => response.revealed === true ? "Continue" : "Reveal the rest",
    getPrimaryTransition: (exercise, response) => response.revealed === true
      ? null
      : { kind: "response", ready: true, response: { ...response, revealed: true } },
  },

};
