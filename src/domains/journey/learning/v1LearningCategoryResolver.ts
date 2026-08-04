import type { Exercise } from "@/src/types/journeyV5";
import {
  V1ExerciseCategoryEnum,
  V1LearningFormatEnum,
  type V1ExerciseCategory,
} from "@/src/types/journeyLearning";

export function resolveV1ExerciseCategory(
  exercise: Exercise,
): V1ExerciseCategory | null {
  const contentCategory = readString(exercise.content?.category);
  const contentFormat = readString(exercise.content?.format);
  const key = contentCategory ?? contentFormat ?? exercise.type;

  switch (key) {
    case V1ExerciseCategoryEnum.Recall:
    case V1LearningFormatEnum.GuidedRecall:
      return V1ExerciseCategoryEnum.Recall;
    case V1ExerciseCategoryEnum.Scenario:
    case V1LearningFormatEnum.ScenarioWhy:
      return V1ExerciseCategoryEnum.Scenario;
    case V1ExerciseCategoryEnum.Discrimination:
    case V1LearningFormatEnum.CloseDiscrimination:
      return V1ExerciseCategoryEnum.Discrimination;
    default:
      return null;
  }
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}
