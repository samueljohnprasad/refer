import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";
import type { Exercise } from "@/src/types/journeyV5";

export function getStorySerialLabel(
  response: Record<string, unknown>,
): string {
  if (response.selectedReflectionId) return "Continue";
  return response.selectedBranchIndex == null
    ? "Choose for Sam above"
    : "Follow the story above";
}

export function getWhiteBearLabel(
  response: Record<string, unknown>,
): string {
  if (response.started !== true) return "Start the 10 seconds";
  if (readNumber(response.secondsRemaining) > 0) {
    return "Don’t think about it…";
  }
  return response.selectedOptionId ? "Continue" : "So, what happened?";
}

export function getNextWhiteBearState(
  response: Record<string, unknown>,
): CoursePrimaryTransition | null {
  if (response.started === true) return null;
  return {
    kind: "response",
    ready: false,
    response: { ...response, started: true, secondsRemaining: 10 },
  };
}

export function getLearnCardsLabel(
  response: Record<string, unknown>,
): string | null {
  return response.phase === "cards" ? "Continue" : null;
}

export function getNextLearnCardsState(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition | null {
  if (response.phase !== "cards") return null;

  const cardIndex = readNumber(response.cardIndex);
  const cards = readArray(exercise.content?.cards);
  const isLastCard = cardIndex >= cards.length - 1;
  if (isLastCard && !exercise.content?.recall) return null;

  return {
    kind: "response",
    ready: !isLastCard,
    response: {
      ...response,
      phase: isLastCard ? "recall" : "cards",
      cardIndex: isLastCard ? cardIndex : cardIndex + 1,
    },
  };
}

export function getNameItLabel(
  response: Record<string, unknown>,
): string | null {
  if (response.phase === "family") return "Tap the closest family";
  if (response.phase === "word") {
    return response.selectedWord ? "That’s the one" : "Tap the closest word";
  }
  return response.phase === "intensity" ? "Done. One line for you" : null;
}

export function getNextNameItState(
  response: Record<string, unknown>,
): CoursePrimaryTransition | null {
  if (response.phase === "word" && response.selectedWord) {
    return {
      kind: "response",
      ready: true,
      response: { ...response, phase: "intensity", intensity: 5 },
    };
  }
  return response.phase === "intensity" ? { kind: "check" } : null;
}

function readArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
