import { DiscriminationCategoryEngine } from "@/src/components/exercise/DiscriminationCategoryEngine";
import { RecallCategoryEngine } from "@/src/components/exercise/RecallCategoryEngine";
import { ScenarioCategoryEngine } from "@/src/components/exercise/ScenarioCategoryEngine";
import {
  IMMEDIATE_OPTION_SELECTION,
  type CourseExerciseCategoryConfig,
} from "@/src/components/exercise/courseExerciseCategoryConfig";
import {
  V1ExerciseCategoryEnum,
  V1LearningFormatEnum,
} from "@/src/types/journeyLearning";

export const LEGACY_V1_CATEGORY_CONFIGS = {
  [V1ExerciseCategoryEnum.Recall]: createConfig(
    V1ExerciseCategoryEnum.Recall,
    V1LearningFormatEnum.GuidedRecall,
    RecallCategoryEngine,
    "Rebuild the idea from memory.",
    "This recall exercise is not available yet.",
  ),
  [V1ExerciseCategoryEnum.Scenario]: createConfig(
    V1ExerciseCategoryEnum.Scenario,
    V1LearningFormatEnum.ScenarioWhy,
    ScenarioCategoryEngine,
    "Apply the idea to a changed situation.",
    "This scenario exercise is not available yet.",
    {
      submissionMode: "immediate",
      submissionRequirement: {
        fields: ["selectedSituationId", "selectedReasonId"],
      },
    },
  ),
  [V1ExerciseCategoryEnum.Discrimination]: createConfig(
    V1ExerciseCategoryEnum.Discrimination,
    V1LearningFormatEnum.CloseDiscrimination,
    DiscriminationCategoryEngine,
    "Choose the explanation that fits best.",
    "This comparison exercise is not available yet.",
    IMMEDIATE_OPTION_SELECTION,
  ),
} satisfies Partial<
  Record<V1ExerciseCategoryEnum, CourseExerciseCategoryConfig>
>;

function createConfig(
  category: V1ExerciseCategoryEnum,
  format: V1LearningFormatEnum,
  engine: CourseExerciseCategoryConfig["engine"],
  goalLabel: string,
  unavailableCopy: string,
  interaction?: CourseExerciseCategoryConfig["interaction"],
): CourseExerciseCategoryConfig {
  return {
    category,
    formats: [format],
    engine,
    goalLabel,
    unavailableCopy,
    interaction,
  };
}
