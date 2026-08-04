import { V1_EXERCISE_CATEGORY_CONFIG } from "@/src/domains/journey/learning/v1LearningConfig";
export { resolveV1ExerciseCategory } from "@/src/domains/journey/learning/v1LearningCategoryResolver";
import {
  V1SupportLevelEnum,
} from "@/src/types/journeyLearning";

export const v1ExerciseCategoryEngineRegistry =
  V1_EXERCISE_CATEGORY_CONFIG;

export const V1_DEFAULT_SUPPORT_LEVEL = V1SupportLevelEnum.None;
