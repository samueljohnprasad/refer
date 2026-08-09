import { AssociationMeterCategoryEngine } from "@/src/components/exercise/AssociationMeterCategoryEngine";
import type { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryEngineRegistry";
import { LensReplayCategoryEngine } from "@/src/components/exercise/LensReplayCategoryEngine";
import { LeverMatchCategoryEngine } from "@/src/components/exercise/LeverMatchCategoryEngine";
import { SocraticDialogueCategoryEngine } from "@/src/components/exercise/SocraticDialogueCategoryEngine";
import { ToolkitShelfCategoryEngine } from "@/src/components/exercise/ToolkitShelfCategoryEngine";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export const TENTH_BATCH_CATEGORY_CONFIGS = {
  [CourseExerciseCategoryEnum.SocraticDialogue]: createConfig(
    CourseExerciseCategoryEnum.SocraticDialogue,
    SocraticDialogueCategoryEngine,
    "Discover worry parking through one adaptive conversation.",
    "This guided conversation is not available yet.",
  ),
  [CourseExerciseCategoryEnum.AssociationMeter]: createConfig(
    CourseExerciseCategoryEnum.AssociationMeter,
    AssociationMeterCategoryEngine,
    "See how repeated checking trains a threat association.",
    "This association meter is not available yet.",
  ),
  [CourseExerciseCategoryEnum.LensReplay]: createConfig(
    CourseExerciseCategoryEnum.LensReplay,
    LensReplayCategoryEngine,
    "Separate one moment into event, alarm, and story.",
    "This lens replay is not available yet.",
  ),
  [CourseExerciseCategoryEnum.ToolkitShelf]: createConfig(
    CourseExerciseCategoryEnum.ToolkitShelf,
    ToolkitShelfCategoryEngine,
    "Choose the right lever for the moment.",
    "This toolkit shelf is not available yet.",
  ),
  [CourseExerciseCategoryEnum.LeverMatch]: createConfig(
    CourseExerciseCategoryEnum.LeverMatch,
    LeverMatchCategoryEngine,
    "Match each habit to its real effect.",
    "This lever matching exercise is not available yet.",
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
