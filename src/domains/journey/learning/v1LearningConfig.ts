import type { ComponentType } from "react";
import { DiscriminationCategoryEngine } from "@/src/components/exercise/DiscriminationCategoryEngine";
import { RecallCategoryEngine } from "@/src/components/exercise/RecallCategoryEngine";
import { ScenarioCategoryEngine } from "@/src/components/exercise/ScenarioCategoryEngine";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import {
  V1ExerciseCategoryEnum,
  V1LearningFormatEnum,
  type V1ExerciseCategory,
  type V1LearningFormat,
} from "@/src/types/journeyLearning";

export interface V1ExerciseCategoryConfig {
  category: V1ExerciseCategoryEnum;
  formats: V1LearningFormatEnum[];
  engine: ComponentType<V1CategoryEngineProps>;
  goalLabel: string;
  unavailableCopy: string;
}

export const V1_EXERCISE_CATEGORY_CONFIG: Record<
  V1ExerciseCategoryEnum,
  V1ExerciseCategoryConfig
> = {
  [V1ExerciseCategoryEnum.Recall]: {
    category: V1ExerciseCategoryEnum.Recall,
    formats: [V1LearningFormatEnum.GuidedRecall],
    engine: RecallCategoryEngine,
    goalLabel: "Build the idea from memory.",
    unavailableCopy: "This recall practice is not available yet.",
  },
  [V1ExerciseCategoryEnum.Scenario]: {
    category: V1ExerciseCategoryEnum.Scenario,
    formats: [V1LearningFormatEnum.ScenarioWhy],
    engine: ScenarioCategoryEngine,
    goalLabel: "Use the idea in a new situation.",
    unavailableCopy: "This scenario practice is not available yet.",
  },
  [V1ExerciseCategoryEnum.Discrimination]: {
    category: V1ExerciseCategoryEnum.Discrimination,
    formats: [V1LearningFormatEnum.CloseDiscrimination],
    engine: DiscriminationCategoryEngine,
    goalLabel: "Choose between close ideas.",
    unavailableCopy: "This discrimination practice is not available yet.",
  },
};

export function getV1CategoryConfig(
  category: V1ExerciseCategory,
): V1ExerciseCategoryConfig | null {
  return isV1Category(category)
    ? V1_EXERCISE_CATEGORY_CONFIG[category as V1ExerciseCategoryEnum]
    : null;
}

export function isV1Format(value: string): value is V1LearningFormat {
  return Object.values(V1LearningFormatEnum).includes(
    value as V1LearningFormatEnum,
  );
}

export function isV1Category(value: string): value is V1ExerciseCategory {
  return Object.values(V1ExerciseCategoryEnum).includes(
    value as V1ExerciseCategoryEnum,
  );
}
