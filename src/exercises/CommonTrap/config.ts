import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { CommonTrapCategoryEngine } from "@/src/components/exercise/CommonTrapCategoryEngine";

export const CommonTrapConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.CommonTrap,
    formats: [CourseExerciseCategoryEnum.CommonTrap],
    engine: CommonTrapCategoryEngine,
    goalLabel: "See why a tempting coping move rebounds.",
    unavailableCopy: "This common-trap exercise is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => response.revealed === true ? "Continue" : "And then what happens?",
    getPrimaryTransition: (exercise, response) => response.revealed === true ? null : { kind: "response" as const, ready: true, response: { ...response, revealed: true } }
  },

};
