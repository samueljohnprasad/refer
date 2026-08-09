import { resolveV1ExerciseCategory } from "@/src/domains/journey/learning/v1LearningCategoryResolver";
import {
  CourseExerciseCategoryEnum,
  type RenderableExerciseCategory,
} from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";

export function resolveCourseExerciseCategory(
  exercise: Exercise,
): RenderableExerciseCategory | null {
  const v1Category = resolveV1ExerciseCategory(exercise);
  if (v1Category) {
    return v1Category;
  }

  const contentCategory = readString(exercise.content?.category);
  const contentFormat = readString(exercise.content?.format);
  const key = contentCategory ?? contentFormat ?? exercise.type;

  return Object.values(CourseExerciseCategoryEnum).includes(
    key as CourseExerciseCategoryEnum,
  )
    ? (key as CourseExerciseCategoryEnum)
    : null;
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}
