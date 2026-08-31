import type { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryEngineRegistry";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

import { SocraticDialogueConfig } from "@/src/exercises/SocraticDialogue/config";
import { AssociationMeterConfig } from "@/src/exercises/AssociationMeter/config";
import { LensReplayConfig } from "@/src/exercises/LensReplay/config";
import { ToolkitShelfConfig } from "@/src/exercises/ToolkitShelf/config";
import { LeverMatchConfig } from "@/src/exercises/LeverMatch/config";

export const TENTH_BATCH_CATEGORY_CONFIGS = {
  [CourseExerciseCategoryEnum.SocraticDialogue]: SocraticDialogueConfig,
  [CourseExerciseCategoryEnum.AssociationMeter]: AssociationMeterConfig,
  [CourseExerciseCategoryEnum.LensReplay]: LensReplayConfig,
  [CourseExerciseCategoryEnum.ToolkitShelf]: ToolkitShelfConfig,
  [CourseExerciseCategoryEnum.LeverMatch]: LeverMatchConfig,
} satisfies Partial<
  Record<CourseExerciseCategoryEnum, CourseExerciseCategoryConfig>
>;
