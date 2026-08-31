import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { InventFirstCategoryEngine } from "@/src/components/exercise/InventFirstCategoryEngine";

export const InventFirstConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.InventFirst,
    formats: [CourseExerciseCategoryEnum.InventFirst],
    engine: InventFirstCategoryEngine,
    goalLabel: "Invent the thought-feeling rule from contrasting cases.",
    unavailableCopy: "This rule lab is not available yet.",
    interaction: IMMEDIATE_OPTION_SELECTION,

};
