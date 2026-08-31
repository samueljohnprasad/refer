import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { GuessRevealCategoryEngine } from "@/src/components/exercise/GuessRevealCategoryEngine";

export const GuessRevealConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.GuessReveal,
    formats: [CourseExerciseCategoryEnum.GuessReveal],
    engine: GuessRevealCategoryEngine,
    goalLabel: "Commit to a guess before seeing the answer.",
    unavailableCopy: "This guess and reveal is not available yet.",

};
