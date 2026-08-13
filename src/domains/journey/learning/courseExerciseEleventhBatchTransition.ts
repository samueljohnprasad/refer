import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";
import {
  buildReframeThought,
  createReframeBuilderResponse,
  hasCompleteReframeSelection,
  readReframeBuilderContent,
} from "@/src/components/exercise/reframeBuilderContent";
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
      return isLastIndex(exercise.content?.rows, response.cardIndex)
        ? "Continue"
        : "Next move";
    case CourseExerciseCategoryEnum.FadedThoughtRecord:
      return getFadedRecordLabel(exercise, response);
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
      return getNextIndexedTransition(
        exercise.content?.rows,
        response,
        "cardIndex",
      );
    case CourseExerciseCategoryEnum.FadedThoughtRecord:
      return getNextFadedRecordTransition(exercise, response);
    case CourseExerciseCategoryEnum.ReframeBuilder:
      return getReframeTransition(exercise, response);
    default:
      return undefined;
  }
}

function getScenarioLabel(response: Record<string, unknown>): string {
  if (response.phase !== "feedback") return "Check answer";
  if (response.isCorrect === true) return "Continue";
  return readNumber(response.attempts) >= 3
    ? "Try a changed example"
    : "Try again";
}

function getScenarioTransition(
  response: Record<string, unknown>,
): CoursePrimaryTransition | undefined {
  if (response.phase === "selection" && response.selectedOptionId) {
    const attempts = readNumber(response.attempts);
    return {
      kind: "response",
      ready: true,
      response: {
        ...response,
        phase: "feedback",
        attempts: response.isCorrect === true ? attempts : attempts + 1,
      },
    };
  }
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

function getFadedRecordLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string {
  const screens = readArray(exercise.content?.screens);
  const screenIndex = readNumber(response.screenIndex);
  if (screenIndex >= screens.length - 1) {
    return isFadedScreenComplete(screens[screenIndex], response)
      ? "Continue"
      : "Two moves are yours";
  }
  return isFadedScreenComplete(screens[screenIndex], response)
    ? "Next screen"
    : "Pick the evidence below";
}

function getNextFadedRecordTransition(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition | undefined {
  const screens = readArray(exercise.content?.screens);
  const screenIndex = readNumber(response.screenIndex);
  if (
    screenIndex >= screens.length - 1 ||
    !isFadedScreenComplete(screens[screenIndex], response)
  ) {
    return undefined;
  }
  return {
    kind: "response",
    ready: false,
    response: {
      ...response,
      screenIndex: screenIndex + 1,
      selectedEvidenceIndex: null,
      selectedRealisticIndex: null,
      coachFeedback: null,
    },
  };
}

function isFadedScreenComplete(
  screenValue: unknown,
  response: Record<string, unknown>,
): boolean {
  const screen = readRecord(screenValue);
  const evidenceOptions = readArray(screen?.evidenceOptions);
  const realisticOptions = readArray(screen?.realisticOptions);
  if (!evidenceOptions.length) return true;
  if (typeof response.selectedEvidenceIndex !== "number") return false;
  return (
    !realisticOptions.length ||
    typeof response.selectedRealisticIndex === "number"
  );
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

function getNextIndexedTransition(
  itemsValue: unknown,
  response: Record<string, unknown>,
  indexKey: string,
): CoursePrimaryTransition | undefined {
  const items = readArray(itemsValue);
  const index = readNumber(response[indexKey]);
  if (index >= items.length - 1) return undefined;
  return {
    kind: "response",
    ready: true,
    response: { ...response, [indexKey]: index + 1 },
  };
}

function isLastIndex(itemsValue: unknown, indexValue: unknown): boolean {
  const items = readArray(itemsValue);
  return items.length > 0 && readNumber(indexValue) >= items.length - 1;
}

function readRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function readArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
