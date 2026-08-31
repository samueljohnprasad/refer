import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { TermChipCategoryEngine } from "@/src/components/exercise/TermChipCategoryEngine";

export const TermChipConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.TermChip,
    formats: [CourseExerciseCategoryEnum.TermChip],
    engine: TermChipCategoryEngine,
    goalLabel: "Recognize a safety behavior and its counterexample.",
    unavailableCopy: "This term exercise is not available yet.",

};
