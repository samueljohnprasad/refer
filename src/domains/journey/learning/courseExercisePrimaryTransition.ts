import { courseExerciseCategoryEngineRegistry } from '@/src/components/exercise/courseExerciseCategoryEngineRegistry';
import { FINAL_BATCH_CATEGORY_CONFIGS } from '@/src/components/exercise/courseExerciseFinalBatchRegistry';
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";
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

  const category = resolveCourseExerciseCategory(exercise);
  const config = category ? (courseExerciseCategoryEngineRegistry[category] || FINAL_BATCH_CATEGORY_CONFIGS[category as keyof typeof FINAL_BATCH_CATEGORY_CONFIGS]) : null;
  if (config?.interaction?.getPrimaryLabel) {
    return config.interaction.getPrimaryLabel(exercise, response);
  }
  return null;
}

export function getCoursePrimaryTransition(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition | null {

  const category = resolveCourseExerciseCategory(exercise);
  const config = category ? (courseExerciseCategoryEngineRegistry[category] || FINAL_BATCH_CATEGORY_CONFIGS[category as keyof typeof FINAL_BATCH_CATEGORY_CONFIGS]) : null;
  if (config?.interaction?.getPrimaryTransition) {
    return config.interaction.getPrimaryTransition(exercise, response);
  }
  return null;
}

export function getProgressLabel(
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

export function getNextProgressState(
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

export function getStoryWalkthroughLabel(
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

export function getNextStoryWalkthroughState(
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

export function getDialogueLabel(
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

export function getNextDialogueState(
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


export function getWhatIfLabel(exercise: Exercise, response: Record<string, unknown>): string | null {
  const phase = response.phase;
  if (phase === "prediction") return response.selectedPredictionId ? "Run it" : null;
  if (phase === "running") {
    const consequences = readArray(exercise.content?.consequences);
    return readNumber(response.consequenceIndex) >= consequences.length ? "Continue" : "Next consequence";
  }
  return phase === "complete" ? "Continue" : null;
}

export function getNextWhatIfState(exercise: Exercise, response: Record<string, unknown>): CoursePrimaryTransition | null {
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

export function getCheckpointLabel(exercise: Exercise, response: Record<string, unknown>): string | null {
  const phase = response.phase;
  if (phase === "intro") return "Start check";
  if (phase === "summary") return "Continue";
  if (phase === "complete") return "Continue";
  return null; // For "item" phase, internal buttons handle it
}

export function getNextCheckpointState(exercise: Exercise, response: Record<string, unknown>): CoursePrimaryTransition | null {
  const phase = response.phase;
  if (phase === "intro") return { kind: "response", ready: true, response: { ...response, phase: "item", currentItemIndex: 0 } };
  return null; // Next item transitions happen within the engine
}

export {
  getExplorableModelPrimaryLabel,
  getNextExplorableModelState,
} from "@/src/domains/journey/learning/explorableModelTransition";

export {
  getLayerZoomPrimaryLabel,
  getNextLayerZoomState,
} from "@/src/domains/journey/learning/layerZoomTransition";

export {
  getLearnCardsLabel,
  getNameItLabel,
  getNextLearnCardsState,
  getNextNameItState,
  getNextWhiteBearState,
  getStorySerialLabel,
  getWhiteBearLabel,
} from "@/src/domains/journey/learning/courseExerciseSimpleTransitions";
