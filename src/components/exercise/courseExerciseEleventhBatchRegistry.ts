import type { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryEngineRegistry";
import { FadedThoughtRecordCategoryEngine } from "@/src/components/exercise/FadedThoughtRecordCategoryEngine";
import { LeverScenarioCategoryEngine } from "@/src/components/exercise/LeverScenarioCategoryEngine";
import { ReframeBuilderCategoryEngine } from "@/src/components/exercise/ReframeBuilderCategoryEngine";
import { SituationLanguageCategoryEngine } from "@/src/components/exercise/SituationLanguageCategoryEngine";
import { WorkedRewriteCategoryEngine } from "@/src/components/exercise/WorkedRewriteCategoryEngine";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export const ELEVENTH_BATCH_CATEGORY_CONFIGS = {
  [CourseExerciseCategoryEnum.LeverScenario]: createConfig(
    CourseExerciseCategoryEnum.LeverScenario,
    LeverScenarioCategoryEngine,
    "Choose the right lever in a live moment.",
    "This lever scenario is not available yet.",
  ),
  [CourseExerciseCategoryEnum.WorkedRewrite]: createConfig(
    CourseExerciseCategoryEnum.WorkedRewrite,
    WorkedRewriteCategoryEngine,
    "Follow the four moves of a realistic thought record.",
    "This worked rewrite is not available yet.",
  ),
  [CourseExerciseCategoryEnum.FadedThoughtRecord]: createConfig(
    CourseExerciseCategoryEnum.FadedThoughtRecord,
    FadedThoughtRecordCategoryEngine,
    "Complete more of a thought record as support fades.",
    "This thought-record practice is not available yet.",
  ),
  [CourseExerciseCategoryEnum.ReframeBuilder]: createConfig(
    CourseExerciseCategoryEnum.ReframeBuilder,
    ReframeBuilderCategoryEngine,
    "Build a believable thought with more of the evidence.",
    "This reframe builder is not available yet.",
  ),
  [CourseExerciseCategoryEnum.SituationLanguage]: createConfig(
    CourseExerciseCategoryEnum.SituationLanguage,
    SituationLanguageCategoryEngine,
    "Shift fixed identity language toward a changeable situation.",
    "This language exercise is not available yet.",
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
