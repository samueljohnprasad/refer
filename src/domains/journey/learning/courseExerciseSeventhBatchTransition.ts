import { readWaveOrderVariants } from "@/src/components/exercise/courseExerciseSeventhBatchContent";
import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";

export function getSeventhBatchPrimaryLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string | undefined {
  switch (exercise.type) {
    case CourseExerciseCategoryEnum.CuriosityBet:
      return response.selectedOptionIndex == null
        ? "Pick your bet first"
        : "Lock it in";
    case CourseExerciseCategoryEnum.PanicWaveCommit:
      return getCommitLabel(response);
    case CourseExerciseCategoryEnum.WaveOrdering:
      return getWaveOrderLabel(exercise, response);
    default:
      return undefined;
  }
}

export function getSeventhBatchPrimaryTransition(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition | undefined {
  switch (exercise.type) {
    case CourseExerciseCategoryEnum.PanicWaveCommit:
      return response.phase === "ready"
        ? {
            kind: "response",
            ready: false,
            response: { ...response, phase: "running" },
          }
        : undefined;
    case CourseExerciseCategoryEnum.WaveOrdering:
      return getNextWaveOrderState(exercise, response);
    default:
      return undefined;
  }
}

function getCommitLabel(response: Record<string, unknown>): string {
  if (response.phase === "running") return "Watch…";
  if (response.phase === "revealed") return "Continue";
  return "Commit — run the wave";
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

function getNextWaveOrderState(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition | undefined {
  const variants = readWaveOrderVariants(exercise.content?.variants);
  const variantIndex = readNumber(response.variantIndex);
  const variant = variants[variantIndex] ?? variants[0];
  if (!variant) return undefined;

  if (response.phase !== "feedback") {
    const tray = readStringArray(response.tray);
    const marks = variant.answer.map((answer, index) => tray[index] === answer);
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
    return undefined;
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

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}
