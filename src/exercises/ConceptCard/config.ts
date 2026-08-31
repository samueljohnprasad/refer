import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { ConceptCardCategoryEngine } from "@/src/components/exercise/ConceptCardCategoryEngine";

export const ConceptCardConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.ConceptCard,
    formats: [CourseExerciseCategoryEnum.ConceptCard],
    engine: ConceptCardCategoryEngine,
    goalLabel: "Replace a sticky myth with a usable rule.",
    unavailableCopy: "This concept card is not available yet.",

};
