import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";

export function getFinalBatchPrimaryLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string | undefined {
  switch (exercise.type) {
    case CourseExerciseCategoryEnum.IfThenPlan:
      return getIfThenLabel(response);
    case CourseExerciseCategoryEnum.CourseCheckpoint:
      return getCheckpointLabel(response);
    case CourseExerciseCategoryEnum.SectionMilestone:
      return response.opened === true ? "Return to Journey" : "Open milestone";
    default:
      return undefined;
  }
}

export function getFinalBatchPrimaryTransition(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition | undefined {
  switch (exercise.type) {
    case CourseExerciseCategoryEnum.IfThenPlan:
      return getIfThenTransition(response);
    case CourseExerciseCategoryEnum.CourseCheckpoint:
      return getCheckpointTransition(exercise, response);
    case CourseExerciseCategoryEnum.SectionMilestone:
      return response.opened === true
        ? undefined
        : {
            kind: "response",
            ready: true,
            response: { ...response, opened: true },
          };
    default:
      return undefined;
  }
}

function getIfThenLabel(response: Record<string, unknown>): string {
  if (response.phase === "feedback") return "Continue";
  return hasPlan(response) ? "Save to My Plans" : "Pick a cue and a move";
}

function getIfThenTransition(
  response: Record<string, unknown>,
): CoursePrimaryTransition | undefined {
  if (response.phase !== "building" || !hasPlan(response)) return undefined;
  return {
    kind: "response",
    ready: true,
    response: { ...response, phase: "feedback", isCorrect: true },
  };
}

function hasPlan(response: Record<string, unknown>): boolean {
  return isIndex(response.cueIndex) && isIndex(response.actionIndex);
}

function getCheckpointLabel(response: Record<string, unknown>): string {
  const phase = response.phase;
  if (phase === "intro") return "Start review";
  if (phase === "summary") return "Continue";
  if (phase === "feedback") {
    return response.isCorrect === true || readNumber(response.attempts) >= 3
      ? "Continue"
      : "Try again";
  }
  return isIndex(response.selectedOptionIndex)
    ? "Check answer"
    : "Choose an answer";
}

function getCheckpointTransition(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition | undefined {
  if (response.phase === "intro") {
    return {
      kind: "response",
      ready: false,
      response: { ...response, phase: "question" },
    };
  }
  if (response.phase === "question" && isIndex(response.selectedOptionIndex)) {
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
  if (response.phase !== "feedback") return undefined;
  if (response.isCorrect !== true && readNumber(response.attempts) < 3) {
    return {
      kind: "response",
      ready: false,
      response: {
        ...response,
        phase: "question",
        selectedOptionIndex: null,
        isCorrect: false,
      },
    };
  }
  return advanceCheckpoint(exercise, response);
}

function advanceCheckpoint(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition {
  const itemIndex = readNumber(response.itemIndex);
  const itemCount = readArray(exercise.content?.items).length;
  const results = readBooleanArray(response.results);
  results[itemIndex] = response.isCorrect === true;
  const isLastItem = itemIndex >= itemCount - 1;
  return {
    kind: "response",
    ready: isLastItem,
    response: {
      ...response,
      phase: isLastItem ? "summary" : "question",
      itemIndex: isLastItem ? itemIndex : itemIndex + 1,
      selectedOptionIndex: null,
      attempts: 0,
      results,
      isCorrect: false,
    },
  };
}

function isIndex(value: unknown): boolean {
  return typeof value === "number" && value >= 0;
}

function readArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function readBooleanArray(value: unknown): boolean[] {
  return Array.isArray(value) ? value.map((item) => item === true) : [];
}

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
