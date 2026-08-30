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
import {
  getLearnCardsLabel,
  getNameItLabel,
  getNextLearnCardsState,
  getNextNameItState,
  getNextWhiteBearState,
  getStorySerialLabel,
  getWhiteBearLabel,
} from "@/src/domains/journey/learning/courseExerciseSimpleTransitions";

export type CoursePrimaryTransition =
  | { kind: "check" }
  | {
      kind: "response";
      ready: boolean;
      response: Record<string, unknown>;
    };

import { resolveCourseExerciseCategory } from "@/src/domains/journey/learning/courseExerciseCategoryResolver";

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

  const category = resolveCourseExerciseCategory(exercise);
  switch (category) {

    case CourseExerciseCategoryEnum.WhatIfMachine:
      return getWhatIfLabel(exercise, response);
    case CourseExerciseCategoryEnum.CourseCheckpoint:
      return getCheckpointLabel(exercise, response);

    case CourseExerciseCategoryEnum.LearnCards:
      return getLearnCardsLabel(response);
    case CourseExerciseCategoryEnum.NameIt:
      return getNameItLabel(response);
    case CourseExerciseCategoryEnum.LayerZoom:
      return getLayerZoomPrimaryLabel(exercise, response);
    case CourseExerciseCategoryEnum.Dialogue:
      return getDialogueLabel(exercise, response);
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

  const category = resolveCourseExerciseCategory(exercise);
  switch (category) {

    case CourseExerciseCategoryEnum.WhatIfMachine:
      return getNextWhatIfState(exercise, response);
    case CourseExerciseCategoryEnum.CourseCheckpoint:
      return getNextCheckpointState(exercise, response);

    case CourseExerciseCategoryEnum.LearnCards:
      return getNextLearnCardsState(exercise, response);
    case CourseExerciseCategoryEnum.NameIt:
      return getNextNameItState(response);
    case CourseExerciseCategoryEnum.LayerZoom:
      return getNextLayerZoomState(exercise, response) ?? null;
    case CourseExerciseCategoryEnum.Dialogue:
      return getNextDialogueState(exercise, response);
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

function getDialogueLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string | null {
  if (response.phase === "complete") {
    return "Continue";
  }
  
  if (response.phase === "active") {
    const beats = readArray(exercise.content?.beats);
    const beatIndex = readNumber(response.beatIndex);
    
    // Hide footer if we are on a decision beat and haven't selected an option
    const currentBeat = beats[beatIndex] as any;
    if (currentBeat && currentBeat.type === "decision") {
      const selected = (response.selectedOptionIds as Record<string, string>)?.[currentBeat.id];
      if (!selected) {
        return null;
      }
    }
    
    return beatIndex >= beats.length - 1 ? "Continue" : "Next message";
  }
  
  return null;
}

function getNextDialogueState(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition | null {
  if (response.phase !== "active") {
    return null;
  }

  const beats = readArray(exercise.content?.beats);
  const beatIndex = readNumber(response.beatIndex);
  
  if (beatIndex >= beats.length - 1) {
    return {
      kind: "response",
      ready: true,
      response: { ...response, phase: "complete" },
    };
  }

  return {
    kind: "response",
    ready: true,
    response: { ...response, beatIndex: beatIndex + 1 },
  };
}

function readArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}


function getWhatIfLabel(exercise: Exercise, response: Record<string, unknown>): string | null {
  const phase = response.phase;
  if (phase === "prediction") return response.selectedPredictionId ? "Run it" : null;
  if (phase === "running") {
    const consequences = readArray(exercise.content?.consequences);
    return readNumber(response.consequenceIndex) >= consequences.length ? "Continue" : "Next consequence";
  }
  return phase === "complete" ? "Continue" : null;
}

function getNextWhatIfState(exercise: Exercise, response: Record<string, unknown>): CoursePrimaryTransition | null {
  const phase = response.phase;
  if (phase === "prediction") {
    return response.selectedPredictionId ? { kind: "response", ready: true, response: { ...response, phase: "running", consequenceIndex: 1 } } : null;
  }
  if (phase === "running") {
    const consequences = readArray(exercise.content?.consequences);
    const consequenceIndex = readNumber(response.consequenceIndex);
    if (consequenceIndex >= consequences.length) {
      return { kind: "response", ready: true, response: { ...response, phase: "complete" } };
    }
    return { kind: "response", ready: true, response: { ...response, consequenceIndex: consequenceIndex + 1 } };
  }
  return null;
}

function getCheckpointLabel(exercise: Exercise, response: Record<string, unknown>): string | null {
  const phase = response.phase;
  if (phase === "intro") return "Start check";
  if (phase === "summary") return "Continue";
  if (phase === "complete") return "Continue";
  return null; // For "item" phase, internal buttons handle it
}

function getNextCheckpointState(exercise: Exercise, response: Record<string, unknown>): CoursePrimaryTransition | null {
  const phase = response.phase;
  if (phase === "intro") return { kind: "response", ready: true, response: { ...response, phase: "item", currentItemIndex: 0 } };
  return null; // Next item transitions happen within the engine
}
