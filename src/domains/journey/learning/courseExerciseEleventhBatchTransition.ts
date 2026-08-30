import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";
import {
  buildReframeThought,
  createReframeBuilderResponse,
  hasCompleteReframeSelection,
  readReframeBuilderContent,
} from "@/src/components/exercise/reframeBuilderContent";
import {
  getFadedThoughtRecordPrimaryLabel,
  getNextFadedThoughtRecordState,
} from "@/src/domains/journey/learning/fadedThoughtRecordTransition";
import {
  getNextWorkedRewriteState,
  getWorkedRewritePrimaryLabel,
} from "@/src/domains/journey/learning/workedRewriteTransition";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";

export function getEleventhBatchPrimaryLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string | undefined {
  switch (exercise.type) {
    case CourseExerciseCategoryEnum.LeverScenario:
      return getScenarioLabel(response);
    case CourseExerciseCategoryEnum.WorkedRewrite:
      return getWorkedRewritePrimaryLabel(exercise, response);
    case CourseExerciseCategoryEnum.FadedThoughtRecord:
      return getFadedThoughtRecordPrimaryLabel(exercise, response);
    case CourseExerciseCategoryEnum.ReframeBuilder:
      return getReframeLabel(exercise, response);
    case CourseExerciseCategoryEnum.SituationLanguage:
      return readArray(response.modes)[1] === "situation"
        ? "Continue"
        : "Flip the second one yourself";
    default:
      return undefined;
  }
}

export function getEleventhBatchPrimaryTransition(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition | undefined {
  switch (exercise.type) {
    case CourseExerciseCategoryEnum.LeverScenario:
      return getScenarioTransition(response);
    case CourseExerciseCategoryEnum.WorkedRewrite:
      return getNextWorkedRewriteState(exercise, response);
    case CourseExerciseCategoryEnum.FadedThoughtRecord:
      return getNextFadedThoughtRecordState(exercise, response);
    case CourseExerciseCategoryEnum.ReframeBuilder:
      return getReframeTransition(exercise, response);
    default:
      return undefined;
  }
}

function getScenarioLabel(response: Record<string, unknown>): string {
  if (response.phase !== "feedback") return "Choose an answer";
  if (response.isCorrect === true) return "Continue";
  return readNumber(response.attempts) >= 3
    ? "Try a changed example"
    : "Try again";
}

function getScenarioTransition(
  response: Record<string, unknown>,
): CoursePrimaryTransition | undefined {
  if (response.phase === "feedback" && response.isCorrect !== true) {
    const changedExample = readNumber(response.attempts) >= 3;
    return {
      kind: "response",
      ready: false,
      response: {
        ...response,
        phase: "selection",
        selectedOptionId: null,
        variantIndex:
          readNumber(response.variantIndex) + (changedExample ? 1 : 0),
        attempts: changedExample ? 0 : response.attempts,
        isCorrect: false,
      },
    };
  }
  return undefined;
}

function getReframeLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string {
  if (response.phase === "complete") return "Continue";
  const content = readReframeBuilderContent(exercise.content);
  if (!content) return "Complete each slot";
  const normalized = createReframeBuilderResponse(content, response);
  return hasCompleteReframeSelection(content, normalized.selectedByTrayId)
    ? "Compare thoughts"
    : "Complete each slot";
}

function getReframeTransition(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition | undefined {
  if (response.phase !== "active") return undefined;
  const content = readReframeBuilderContent(exercise.content);
  if (!content) return undefined;
  const normalized = createReframeBuilderResponse(content, response);
  if (
    !hasCompleteReframeSelection(content, normalized.selectedByTrayId) ||
    !buildReframeThought(content, normalized.selectedByTrayId)
  ) return undefined;
  return {
    kind: "response",
    ready: true,
    response: {
      ...normalized,
      phase: "complete",
      stageIndex: content.trays.length - 1,
      editingTrayId: null,
      isCorrect: true,
    },
  };
}

function readArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
