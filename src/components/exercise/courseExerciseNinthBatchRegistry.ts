import { AnnotatedDiaryCategoryEngine } from "@/src/components/exercise/AnnotatedDiaryCategoryEngine";
import { EveningComparisonCategoryEngine } from "@/src/components/exercise/EveningComparisonCategoryEngine";
import type { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryEngineRegistry";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

import { LeverCheckConfig } from "@/src/exercises/LeverCheck/config";
import { PrivateCheckConfig } from "@/src/exercises/PrivateCheck/config";
import { SameButDifferentConfig } from "@/src/exercises/SameButDifferent/config";

export const NINTH_BATCH_CATEGORY_CONFIGS = {
  [CourseExerciseCategoryEnum.EveningComparison]: createConfig(
    CourseExerciseCategoryEnum.EveningComparison,
    EveningComparisonCategoryEngine,
    "Compare the loop created by two small evening choices.",
    "This evening comparison is not available yet.",
  ),
  [CourseExerciseCategoryEnum.LeverCheck]: LeverCheckConfig,
  [CourseExerciseCategoryEnum.AnnotatedDiary]: createConfig(
    CourseExerciseCategoryEnum.AnnotatedDiary,
    AnnotatedDiaryCategoryEngine,
    "Separate a fact from a story and a verdict.",
    "This annotated diary is not available yet.",
  ),
  [CourseExerciseCategoryEnum.PrivateCheck]: PrivateCheckConfig,
  [CourseExerciseCategoryEnum.SameButDifferent]: SameButDifferentConfig,
} satisfies Partial<
  Record<CourseExerciseCategoryEnum, CourseExerciseCategoryConfig>
>;

function createConfig(
  category: CourseExerciseCategoryEnum,
  engine: CourseExerciseCategoryConfig["engine"],
  goalLabel: string,
  unavailableCopy: string,
): CourseExerciseCategoryConfig {
  return {
    category,
    formats: [category],
    engine,
    goalLabel,
    unavailableCopy,
  };
}
