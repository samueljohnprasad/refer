import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { WaveOrderingCategoryEngine } from "@/src/components/exercise/WaveOrderingCategoryEngine";
import { readWaveOrderVariants } from "@/src/components/exercise/courseExerciseSeventhBatchContent";
import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";
import type { Exercise } from "@/src/types/journeyV5";

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function getWaveOrderLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string {
  if (response.phase !== "feedback") return "Check order";
  if (response.isCorrect === true || response.supported === true) {
    return "Continue";
  }

  const attemptCount = readNumber(response.attemptCount);
  if (attemptCount < 3) return "Try again";
  const variants = readWaveOrderVariants(exercise.content?.variants);
  return readNumber(response.variantIndex) < variants.length - 1
    ? "Try a changed example"
    : "Show me the answer";
}

function resetWaveOrderResponse(
  response: Record<string, unknown>,
  variant: ReturnType<typeof readWaveOrderVariants>[number],
  variantIndex: number,
  attemptCount: number,
): CoursePrimaryTransition {
  const pinned = attemptCount >= 2 ? variant.answer.slice(0, 1) : [];
  return {
    kind: "response",
    ready: false,
    response: {
      ...response,
      phase: "entry",
      variantIndex,
      attemptCount,
      tray: pinned,
      pinnedCount: pinned.length,
      marks: null,
      feedbackText: null,
      isCorrect: false,
      supported: false,
    },
  };
}

function getNextWaveOrderState(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition | null {
  const variants = readWaveOrderVariants(exercise.content?.variants);
  const variantIndex = readNumber(response.variantIndex);
  const variant = variants[variantIndex] ?? variants[0];
  if (!variant) return null;

  if (response.phase !== "feedback") {
    const tray = readStringArray(response.tray);
    const marks = variant.answer.map((answer: string, index: number) => tray[index] === answer);
    const correct = marks.every(Boolean);
    const rightCount = marks.filter(Boolean).length;
    return {
      kind: "response",
      ready: true,
      response: {
        ...response,
        phase: "feedback",
        marks,
        isCorrect: correct,
        attemptCount: readNumber(response.attemptCount) + (correct ? 0 : 1),
        feedbackText: correct
          ? variant.correctFeedback
          : `${rightCount} of ${variant.answer.length} in the right place. Look at where the chain starts and ends.`,
      },
    };
  }

  if (response.isCorrect === true || response.supported === true) {
    return null;
  }

  const attemptCount = readNumber(response.attemptCount);
  if (attemptCount >= 3 && variantIndex < variants.length - 1) {
    return resetWaveOrderResponse(
      response,
      variants[variantIndex + 1],
      variantIndex + 1,
      0,
    );
  }
  if (attemptCount >= 3) {
    return {
      kind: "response",
      ready: true,
      response: {
        ...response,
        tray: variant.answer,
        marks: variant.answer.map(() => true),
        supported: true,
        feedbackText: variant.workedExample,
      },
    };
  }
  return resetWaveOrderResponse(response, variant, variantIndex, attemptCount);
}

export const WaveOrderingConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.WaveOrdering,
  formats: [CourseExerciseCategoryEnum.WaveOrdering],
  engine: WaveOrderingCategoryEngine,
  goalLabel: "Rebuild the anxiety wave from memory.",
  unavailableCopy: "This wave ordering exercise is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => getWaveOrderLabel(exercise, response),
    getPrimaryTransition: (exercise, response) => getNextWaveOrderState(exercise, response),
  },
};
