import {
  readCourseExerciseOptions,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { Exercise } from "@/src/types/journeyV5";

export interface ReflectionChoiceData {
  title: string | null;
  options: ReturnType<typeof readCourseExerciseOptions>;
}

export function readReflectionChoiceData(
  exercise: Exercise,
): ReflectionChoiceData {
  const content = exercise.content ?? {};
  return {
    title: readString(content.title),
    options: readCourseExerciseOptions(content.options),
  };
}

export function readSelectedReflectionId(response: unknown): string | null {
  return readString(readRecord(response)?.feedbackValue);
}
