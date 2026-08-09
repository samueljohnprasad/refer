import {
  readFillBlankVariants,
  readRecallCards,
} from "@/src/components/exercise/courseExerciseSixthBatchContent";
import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";

export function getSixthBatchPrimaryLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string | undefined {
  switch (exercise.type) {
    case CourseExerciseCategoryEnum.GuidedDiscoveryTrail:
      return getTrailLabel(exercise, response);
    case CourseExerciseCategoryEnum.TeachBackChain:
      return getTeachBackLabel(exercise, response);
    case CourseExerciseCategoryEnum.RecallWarmup:
      return getRecallLabel(exercise, response);
    case CourseExerciseCategoryEnum.FillBlank:
      return getFillBlankLabel(exercise, response);
    default:
      return undefined;
  }
}

export function getSixthBatchPrimaryTransition(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition | undefined {
  switch (exercise.type) {
    case CourseExerciseCategoryEnum.RecallWarmup:
      return getNextRecallState(exercise, response);
    case CourseExerciseCategoryEnum.FillBlank:
      return getNextFillBlankState(exercise, response);
    default:
      return undefined;
  }
}

function getTrailLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string {
  const selectedCount = readArray(response.selectedOptionIndexes).length;
  const questionCount = readArray(exercise.content?.questions).length;
  return selectedCount >= questionCount
    ? "Continue"
    : "Answer above to continue";
}

function getTeachBackLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string {
  const completedStepCount = readNumber(response.completedStepCount);
  const stepCount = readArray(exercise.content?.steps).length;
  if (completedStepCount < stepCount) return "Build the chain above";
  return response.selectedFollowUpIndex == null
    ? "Answer Pip’s follow-up"
    : "Continue";
}

function getRecallLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string {
  if (response.revealed !== true) return "I said it — flip";
  const cardIndex = readNumber(response.cardIndex);
  const cardCount = readRecallCards(exercise.content?.cards).length;
  return cardIndex < cardCount - 1 ? "Next one" : "Wrap up";
}

function getNextRecallState(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition {
  if (response.revealed !== true) {
    return {
      kind: "response",
      ready: true,
      response: { ...response, revealed: true },
    };
  }

  const cardIndex = readNumber(response.cardIndex);
  const cardCount = readRecallCards(exercise.content?.cards).length;
  if (cardIndex >= cardCount - 1) return { kind: "check" };
  return {
    kind: "response",
    ready: true,
    response: { ...response, cardIndex: cardIndex + 1, revealed: false },
  };
}

function getFillBlankLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string {
  if (response.phase !== "feedback") {
    const input = typeof response.input === "string" ? response.input : "";
    return input.trim() ? "Check answer" : "Type the missing word";
  }
  if (response.isCorrect === true || response.supported === true) {
    return "Continue";
  }

  const attemptCount = readNumber(response.attemptCount);
  if (attemptCount < 3) return "Try again";
  const variants = readFillBlankVariants(exercise.content?.variants);
  return readNumber(response.variantIndex) < variants.length - 1
    ? "Try a changed example"
    : "Show me the answer";
}

function getNextFillBlankState(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition | undefined {
  const variants = readFillBlankVariants(exercise.content?.variants);
  const variantIndex = readNumber(response.variantIndex);
  const variant = variants[variantIndex] ?? variants[0];
  if (!variant) return undefined;

  if (response.phase !== "feedback") {
    const input = typeof response.input === "string" ? response.input : "";
    const answer = input.trim().toLowerCase();
    const correct = variant.answers.includes(answer);
    return {
      kind: "response",
      ready: true,
      response: {
        ...response,
        phase: "feedback",
        isCorrect: correct,
        attemptCount: readNumber(response.attemptCount) + (correct ? 0 : 1),
        feedbackText: correct
          ? variant.correctFeedback
          : variant.incorrectFeedback,
      },
    };
  }

  if (response.isCorrect === true || response.supported === true) {
    return undefined;
  }

  const attemptCount = readNumber(response.attemptCount);
  if (attemptCount >= 3 && variantIndex < variants.length - 1) {
    return resetFillBlankResponse(response, variantIndex + 1);
  }
  if (attemptCount >= 3) {
    return {
      kind: "response",
      ready: true,
      response: {
        ...response,
        input: variant.answers[0],
        isCorrect: false,
        supported: true,
        feedbackText: variant.workedExample,
      },
    };
  }
  return resetFillBlankResponse(response, variantIndex);
}

function resetFillBlankResponse(
  response: Record<string, unknown>,
  variantIndex: number,
): CoursePrimaryTransition {
  return {
    kind: "response",
    ready: false,
    response: {
      ...response,
      phase: "entry",
      variantIndex,
      input: "",
      feedbackText: null,
      isCorrect: false,
      supported: false,
    },
  };
}

function readArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
