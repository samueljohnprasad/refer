import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";
import {
  getBatchPrimaryLabel,
  getBatchPrimaryTransition,
} from "@/src/domains/journey/learning/courseExerciseBatchTransitions";
import {
  getExplorableModelPrimaryLabel,
  getNextExplorableModelState,
} from "@/src/domains/journey/learning/explorableModelTransition";
import { getLayerZoomPrimaryLabel, getNextLayerZoomState } from "@/src/domains/journey/learning/layerZoomTransition";

export type CoursePrimaryTransition =
  | { kind: "check" }
  | {
      kind: "response";
      ready: boolean;
      response: Record<string, unknown>;
    };

export function getCoursePrimaryLabel(
  exercise: Exercise,
  response: Record<string, unknown> | null,
): string | null {
  if (!response) {
    return null;
  }

  const batchLabel = getBatchPrimaryLabel(exercise, response);
  if (batchLabel !== undefined) {
    return batchLabel;
  }

  switch (exercise.type) {
    case CourseExerciseCategoryEnum.LearnCards:
      return getLearnCardsLabel(exercise, response);
    case CourseExerciseCategoryEnum.NameIt:
      return getNameItLabel(response);
    case CourseExerciseCategoryEnum.LayerZoom:
      return getLayerZoomPrimaryLabel(exercise, response);
    case CourseExerciseCategoryEnum.Dialogue:
      return getProgressLabel(exercise.content?.messages, response, "Next");
    case CourseExerciseCategoryEnum.StoryWalkthrough:
      return getStoryWalkthroughLabel(exercise, response);
    case CourseExerciseCategoryEnum.CommonTrap:
      return response.revealed === true ? "Continue" : "And then what happens?";
    case CourseExerciseCategoryEnum.StorySerial:
      return getStorySerialLabel(response);
    case CourseExerciseCategoryEnum.ExplorableModel:
      return getExplorableModelPrimaryLabel(exercise, response);
    case CourseExerciseCategoryEnum.WhiteBearExperiment:
      return getWhiteBearLabel(response);
    case CourseExerciseCategoryEnum.InventFirst:
      return response.selectedOptionId ? "Look again. What differs?" : null;
    default:
      return null;
  }
}

export function getCoursePrimaryTransition(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition | null {
  const batchTransition = getBatchPrimaryTransition(exercise, response);
  if (batchTransition !== undefined) {
    return batchTransition;
  }

  switch (exercise.type) {
    case CourseExerciseCategoryEnum.LearnCards:
      return getNextLearnCardsState(exercise, response);
    case CourseExerciseCategoryEnum.NameIt:
      return getNextNameItState(response);
    case CourseExerciseCategoryEnum.LayerZoom:
      return getNextLayerZoomState(exercise, response) ?? null;
    case CourseExerciseCategoryEnum.Dialogue:
      return getNextProgressState(exercise.content?.messages, response);
    case CourseExerciseCategoryEnum.StoryWalkthrough:
      return getNextStoryWalkthroughState(exercise, response);
    case CourseExerciseCategoryEnum.CommonTrap:
      return response.revealed === true
        ? null
        : {
            kind: "response",
            ready: true,
            response: { ...response, revealed: true },
          };
    case CourseExerciseCategoryEnum.ExplorableModel:
      return getNextExplorableModelState(exercise, response) ?? null;
    case CourseExerciseCategoryEnum.WhiteBearExperiment:
      return getNextWhiteBearState(response);
    default:
      return null;
  }
}

function getStorySerialLabel(response: Record<string, unknown>): string {
  if (response.selectedReflectionId) {
    return "Continue";
  }
  return response.selectedBranchIndex == null
    ? "Choose for Sam above"
    : "Follow the story above";
}

function getWhiteBearLabel(response: Record<string, unknown>): string {
  if (response.started !== true) {
    return "Start the 10 seconds";
  }
  if (readNumber(response.secondsRemaining) > 0) {
    return "Don’t think about it…";
  }
  return response.selectedOptionId ? "Continue" : "So, what happened?";
}

function getNextWhiteBearState(
  response: Record<string, unknown>,
): CoursePrimaryTransition | null {
  if (response.started === true) {
    return null;
  }
  return {
    kind: "response",
    ready: false,
    response: { ...response, started: true, secondsRemaining: 10 },
  };
}

function getLearnCardsLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string | null {
  if (response.phase !== "cards") {
    return null;
  }

  const cards = readArray(exercise.content?.cards);
  const cardIndex = readNumber(response.cardIndex);
  return cardIndex >= cards.length - 1 ? "Quick recall" : "Next card";
}

function getNextLearnCardsState(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition | null {
  if (response.phase !== "cards") {
    return null;
  }

  const cardIndex = readNumber(response.cardIndex);
  const isLastCard = cardIndex >= readArray(exercise.content?.cards).length - 1;
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

function getNameItLabel(response: Record<string, unknown>): string | null {
  if (response.phase === "family") {
    return "Tap the closest family";
  }
  if (response.phase === "word") {
    return response.selectedWord ? "That’s the one" : "Tap the closest word";
  }
  return response.phase === "intensity" ? "Done. One line for you" : null;
}

function getNextNameItState(
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

function getProgressLabel(
  itemsValue: unknown,
  response: Record<string, unknown>,
  nextLabel: string,
): string | null {
  if (response.phase !== "progress") {
    return null;
  }

  return readNumber(response.cardIndex) >= readArray(itemsValue).length - 1
    ? "Continue"
    : nextLabel;
}

function getNextProgressState(
  itemsValue: unknown,
  response: Record<string, unknown>,
): CoursePrimaryTransition | null {
  if (response.phase !== "progress") {
    return null;
  }

  const cardIndex = readNumber(response.cardIndex);
  if (cardIndex >= readArray(itemsValue).length - 1) {
    return null;
  }

  return {
    kind: "response",
    ready: true,
    response: { ...response, cardIndex: cardIndex + 1 },
  };
}

function getStoryWalkthroughLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string | null {
  if (response.phase !== "story") {
    return null;
  }

  return readNumber(response.cardIndex) >=
    readArray(exercise.content?.beats).length
    ? "Continue"
    : "Next";
}

function getNextStoryWalkthroughState(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition | null {
  if (response.phase !== "story") {
    return null;
  }

  const cardIndex = readNumber(response.cardIndex);
  if (cardIndex >= readArray(exercise.content?.beats).length) {
    return null;
  }

  return {
    kind: "response",
    ready: true,
    response: { ...response, cardIndex: cardIndex + 1 },
  };
}

function readArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
