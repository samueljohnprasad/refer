import type { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryEngineRegistry";
import { CourseCheckpointCategoryEngine } from "@/src/components/exercise/CourseCheckpointCategoryEngine";
import { IfThenPlanCategoryEngine } from "@/src/components/exercise/IfThenPlanCategoryEngine";
import { SectionMilestoneCategoryEngine } from "@/src/components/exercise/SectionMilestoneCategoryEngine";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export const FINAL_BATCH_CATEGORY_CONFIGS = {
  [CourseExerciseCategoryEnum.IfThenPlan]: createConfig(
    CourseExerciseCategoryEnum.IfThenPlan,
    IfThenPlanCategoryEngine,
    "Pair a precise cue with one rehearsable response.",
    "This if-then plan is not available yet.",
  ),
  [CourseExerciseCategoryEnum.CourseCheckpoint]: createConfig(
    CourseExerciseCategoryEnum.CourseCheckpoint,
    CourseCheckpointCategoryEngine,
    "Review the alarm system and coping loops without score pressure.",
    "This checkpoint is not available yet.",
  ),
  [CourseExerciseCategoryEnum.SectionMilestone]: createConfig(
    CourseExerciseCategoryEnum.SectionMilestone,
    SectionMilestoneCategoryEngine,
    "Recognize the skills completed in this section.",
    "This section milestone is not available yet.",
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
