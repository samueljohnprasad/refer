import { getWhiteBearLabel, getNextWhiteBearState } from '@/src/domains/journey/learning/courseExercisePrimaryTransition';
import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { WhiteBearExperimentCategoryEngine } from "@/src/components/exercise/WhiteBearExperimentCategoryEngine";

export const WhiteBearExperimentConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.WhiteBearExperiment,
    formats: [CourseExerciseCategoryEnum.WhiteBearExperiment],
    engine: WhiteBearExperimentCategoryEngine,
    goalLabel: "Feel the thought-suppression effect before naming it.",
    unavailableCopy: "This thought experiment is not available yet.",

};
