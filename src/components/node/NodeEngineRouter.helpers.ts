import type { Exercise } from "@/src/types/journeyV5";
import {
  V1ActivityResolutionEnum,
  V1CheckStatusEnum,
  type V1CheckStatus,
  type V1SupportLevel,
  V1SupportLevelEnum,
} from "@/src/types/journeyLearning";

export type SupportFallback = {
  clue: string;
  easier: string;
};

export function getCanContinueAfterSupport({
  attemptCount,
  checkStatus,
  maxAttempts,
  supportLevel,
}: {
  attemptCount: number;
  checkStatus: V1CheckStatus;
  maxAttempts: number;
  supportLevel: V1SupportLevel;
}): boolean {
  return (
    checkStatus === V1CheckStatusEnum.Error &&
    supportLevel === V1SupportLevelEnum.Worked &&
    attemptCount >= maxAttempts
  );
}

export function getFeedbackText(
  exercise: Exercise | undefined,
  checkStatus: V1CheckStatus,
): string | null {
  if (checkStatus === V1CheckStatusEnum.Success) {
    return readString(exercise?.content?.feedback_correct);
  }

  if (checkStatus === V1CheckStatusEnum.Error) {
    return readString(exercise?.content?.feedback_incorrect);
  }

  return null;
}

export function getPrimaryLabel({
  canContinueAfterSupport,
  checkStatus,
  lastExercise,
}: {
  canContinueAfterSupport: boolean;
  checkStatus: V1CheckStatus;
  lastExercise: boolean;
}): string {
  if (checkStatus === V1CheckStatusEnum.Idle) {
    return "Check";
  }

  if (checkStatus === V1CheckStatusEnum.Error) {
    return canContinueAfterSupport ? "Continue" : "Try again";
  }

  return lastExercise ? "Finish" : "Continue";
}

export function getCompletionResolution(
  attemptCount: number,
  supportLevel: V1SupportLevel,
): V1ActivityResolutionEnum {
  return supportLevel === V1SupportLevelEnum.None && attemptCount === 0
    ? V1ActivityResolutionEnum.IndependentComplete
    : V1ActivityResolutionEnum.SupportedComplete;
}

export function readSupportText(
  exercise: Exercise | undefined,
  key: V1SupportLevelEnum.Clue | V1SupportLevelEnum.Easier | V1SupportLevelEnum.Worked,
  fallback?: SupportFallback,
): string {
  const support = exercise?.content?.support;
  if (support && typeof support === "object" && !Array.isArray(support)) {
    const supportRecord = support as Record<string, unknown>;
    const value =
      key === V1SupportLevelEnum.Worked
        ? supportRecord.workedAnswer ?? exercise?.content?.workedExample
        : supportRecord[key];
    const text = readString(value);
    if (text) {
      return text;
    }
  }

  if (key === V1SupportLevelEnum.Clue) {
    return fallback?.clue ?? "Look for the simple rule in the question.";
  }

  if (key === V1SupportLevelEnum.Easier) {
    return fallback?.easier ?? "Use the option that matches the main idea from this lesson.";
  }

  return "Here is one safe example. Read it, then continue.";
}

export function readMaxAttempts(exercise: Exercise | undefined): number {
  const raw = exercise?.content?.maxAttempts;
  return typeof raw === "number" && Number.isFinite(raw)
    ? Math.max(1, Math.floor(raw))
    : 3;
}

export function buildResolvedResponse(
  exercise: Exercise,
  response: Record<string, unknown>,
  resolution: V1ActivityResolutionEnum,
  attemptCount: number,
  supportLevel: V1SupportLevel,
  currentStartedAtMs: number,
  firstAnsweredAtMs: number | null,
): Record<string, unknown> {
  const resolvedAtMs = Date.now();
  return {
    ...response,
    exercise_id: exercise.id,
    concept: exercise.concept ?? null,
    category: readString(exercise.content?.category) ?? null,
    retry_variant_id: readString(exercise.content?.retryVariantId) ?? null,
    resolution,
    attemptCount,
    attempt_count: attemptCount,
    supportLevel,
    support_used: supportLevel,
    time_to_first_answer_ms: Math.max(
      0,
      (firstAnsweredAtMs ?? resolvedAtMs) - currentStartedAtMs,
    ),
    time_to_resolution_ms: Math.max(0, resolvedAtMs - currentStartedAtMs),
  };
}

export function buildSkippedResponse(
  exercise: Exercise,
  supportLevel: V1SupportLevel,
  currentStartedAtMs: number,
): Record<string, unknown> {
  const resolvedAtMs = Date.now();
  return {
    format: exercise.type,
    exercise_id: exercise.id,
    concept: exercise.concept ?? null,
    category: readString(exercise.content?.category) ?? null,
    retry_variant_id: readString(exercise.content?.retryVariantId) ?? null,
    resolution: V1ActivityResolutionEnum.Skipped,
    supportLevel,
    support_used: supportLevel,
    time_to_first_answer_ms: null,
    time_to_resolution_ms: Math.max(0, resolvedAtMs - currentStartedAtMs),
  };
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}
