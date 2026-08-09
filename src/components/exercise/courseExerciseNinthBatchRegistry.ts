import { AnnotatedDiaryCategoryEngine } from "@/src/components/exercise/AnnotatedDiaryCategoryEngine";
import { EveningComparisonCategoryEngine } from "@/src/components/exercise/EveningComparisonCategoryEngine";
import { LeverCheckCategoryEngine } from "@/src/components/exercise/LeverCheckCategoryEngine";
import { PrivateCheckCategoryEngine } from "@/src/components/exercise/PrivateCheckCategoryEngine";
import { SameButDifferentCategoryEngine } from "@/src/components/exercise/SameButDifferentCategoryEngine";
import type { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryEngineRegistry";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export const NINTH_BATCH_CATEGORY_CONFIGS = {
  [CourseExerciseCategoryEnum.EveningComparison]: createConfig(
    CourseExerciseCategoryEnum.EveningComparison,
    EveningComparisonCategoryEngine,
    "Compare the loop created by two small evening choices.",
    "This evening comparison is not available yet.",
  ),
  [CourseExerciseCategoryEnum.LeverCheck]: createConfig(
    CourseExerciseCategoryEnum.LeverCheck,
    LeverCheckCategoryEngine,
    "Compare relief with a move that reduces tomorrow’s load.",
    "This lever check is not available yet.",
  ),
  [CourseExerciseCategoryEnum.AnnotatedDiary]: createConfig(
    CourseExerciseCategoryEnum.AnnotatedDiary,
    AnnotatedDiaryCategoryEngine,
    "Separate a fact from a story and a verdict.",
    "This annotated diary is not available yet.",
  ),
  [CourseExerciseCategoryEnum.PrivateCheck]: createConfig(
    CourseExerciseCategoryEnum.PrivateCheck,
    PrivateCheckCategoryEngine,
    "Notice familiar loops without scoring or judgment.",
    "This private check is not available yet.",
  ),
  [CourseExerciseCategoryEnum.SameButDifferent]: createConfig(
    CourseExerciseCategoryEnum.SameButDifferent,
    SameButDifferentCategoryEngine,
    "Choose the right first move for worry or body anxiety.",
    "This comparison is not available yet.",
  ),
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
