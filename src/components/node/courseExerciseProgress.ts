import { readString } from "@/src/components/exercise/courseExerciseContent";
import type { Exercise } from "@/src/types/journeyV5";

interface ExerciseProgress {
  progress: number;
  trailingLabel: string;
}

export function getExerciseProgress(
  exercises: Exercise[],
  currentIndex: number,
): ExerciseProgress {
  const currentExercise = exercises[currentIndex];
  const coreExercises = exercises.filter((exercise) => !isPostLesson(exercise));

  if (currentExercise && isPostLesson(currentExercise)) {
    return {
      progress: 1,
      trailingLabel:
        readString(currentExercise.content?.progressLabel) ?? "Complete",
    };
  }

  const coreIndex = exercises
    .slice(0, currentIndex + 1)
    .filter((exercise) => !isPostLesson(exercise)).length;
  const coreCount = Math.max(coreExercises.length, 1);
  return {
    progress: coreIndex / coreCount,
    trailingLabel: `${coreIndex} of ${coreCount}`,
  };
}

function isPostLesson(exercise: Exercise): boolean {
  return exercise.content?.progressRole === "post_lesson";
}
