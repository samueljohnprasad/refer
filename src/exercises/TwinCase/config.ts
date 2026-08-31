import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { TwinCaseCategoryEngine } from "@/src/components/exercise/TwinCaseCategoryEngine";

export const TwinCaseConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.TwinCase,
    formats: [CourseExerciseCategoryEnum.TwinCase],
    engine: TwinCaseCategoryEngine,
    goalLabel: "Build an analogy by matching its parts.",
    unavailableCopy: "This matching exercise is not available yet.",

};
