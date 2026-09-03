import {
  readCourseExerciseOptions,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { Exercise } from "@/src/types/journeyV5";

export interface CourseChoiceData {
  title: string;
  instruction: string | null;
  context: string | null;
  prompt: string | null;
  options: ReturnType<typeof readCourseExerciseOptions>;
}

export function readCourseChoiceData(exercise: Exercise): CourseChoiceData {
  const content = exercise.content ?? {};
  return {
    title: readString(content.title) ?? "Quick check",
    instruction: readString(content.instruction),
    context: readString(content.context),
    prompt: readString(content.prompt),
    options: readCourseExerciseOptions(content.options),
  };
}

export function readSelectedCourseChoiceId(response: unknown): string | null {
  return readString(readRecord(response)?.selectedOptionId);
}

export function hasSelectedCourseChoiceFeedback(
  exercise: Exercise,
  response: unknown,
): boolean {
  const selectedOptionId = readSelectedCourseChoiceId(response);
  return readCourseExerciseOptions(exercise.content?.options).some(
    (option) => option.id === selectedOptionId && Boolean(option.feedback),
  );
}
