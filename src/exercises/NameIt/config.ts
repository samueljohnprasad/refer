import { getNameItLabel, getNextNameItState } from '@/src/domains/journey/learning/courseExercisePrimaryTransition';
import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { NameItCategoryEngine } from "@/src/components/exercise/NameItCategoryEngine";

export const NameItConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.NameIt,
    formats: [CourseExerciseCategoryEnum.NameIt],
    engine: NameItCategoryEngine,
    goalLabel: "Name a feeling precisely and rate its intensity.",
    unavailableCopy: "This feeling ladder is not available yet.",

};
