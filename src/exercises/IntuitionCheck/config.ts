import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { IntuitionCheckCategoryEngine } from "@/src/components/exercise/IntuitionCheckCategoryEngine";

export const IntuitionCheckConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.IntuitionCheck,
    formats: [CourseExerciseCategoryEnum.IntuitionCheck],
    engine: IntuitionCheckCategoryEngine,
    goalLabel: "Commit to an intuition before learning the rule.",
    unavailableCopy: "This intuition check is not available yet.",
    interaction: IMMEDIATE_OPTION_SELECTION,

};
