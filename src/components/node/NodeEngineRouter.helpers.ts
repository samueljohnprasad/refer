import { courseExerciseCategoryEngineRegistry } from '@/src/components/exercise/courseExerciseCategoryEngineRegistry';
import { FINAL_BATCH_CATEGORY_CONFIGS } from '@/src/components/exercise/courseExerciseFinalBatchRegistry';
import { resolveCourseExerciseCategory } from "@/src/domains/journey/learning/courseExerciseCategoryResolver";

import type { Exercise } from "@/src/types/journeyV5";
import { getCoursePrimaryLabel } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import {
  V1CheckStatusEnum,
  type V1CheckStatus,
} from "@/src/types/journeyLearning";
import { isMicrolearningCategory } from "@/src/components/exercise/microlearning/microlearningContentValidation";
import { isMatchingFinalMicrolearningResponse } from "@/src/components/exercise/microlearning/microlearningResponse";

const ATTEMPTS_BEFORE_EXPLANATION = 2;

export function getCanContinueAfterExplanation({
  attemptCount,
  checkStatus,
}: {
  attemptCount: number;
  checkStatus: V1CheckStatus;
}): boolean {
  return (
    checkStatus === V1CheckStatusEnum.Error &&
    attemptCount >= ATTEMPTS_BEFORE_EXPLANATION
  );
}

export function getFeedbackText(
  exercise: Exercise | undefined,
  checkStatus: V1CheckStatus,
  response?: Record<string, unknown> | null,
): string | null {
  const responseFeedback = readString(response?.feedbackText);
  const selectedOptionFeedback = getSelectedOptionFeedback(exercise, response);
  if (checkStatus === V1CheckStatusEnum.Success) {
    return (
      responseFeedback ??
      selectedOptionFeedback ??
      readString(exercise?.content?.feedback_correct)
    );
  }

  if (checkStatus === V1CheckStatusEnum.Error) {
    return (
      responseFeedback ??
      selectedOptionFeedback ??
      readString(exercise?.content?.feedback_incorrect)
    );
  }

  return null;
}

function getSelectedOptionFeedback(
  exercise: Exercise | undefined,
  response?: Record<string, unknown> | null,
): string | null {
  if (!exercise) return null;
  const category = resolveCourseExerciseCategory(exercise);
  const config = category ? (courseExerciseCategoryEngineRegistry[category] || FINAL_BATCH_CATEGORY_CONFIGS[category as keyof typeof FINAL_BATCH_CATEGORY_CONFIGS]) : null;
  if (config?.feedback?.getSelectedOptionFeedback) {
    return config.feedback.getSelectedOptionFeedback(exercise, response);
  }
  return null;
}

export function getPrimaryLabel({
  canContinueAfterExplanation,
  checkStatus,
  exercise,
  lastExercise,
}: {
  canContinueAfterExplanation: boolean;
  checkStatus: V1CheckStatus;
  exercise?: Exercise;
  lastExercise: boolean;
}): string {
  if (checkStatus === V1CheckStatusEnum.Idle) {
    return readString(exercise?.content?.primaryLabel) ?? "Check";
  }

  if (checkStatus === V1CheckStatusEnum.Error) {
    return canContinueAfterExplanation ? "Continue" : "Try again";
  }

  return (
    readString(exercise?.content?.successPrimaryLabel) ??
    (lastExercise ? "Finish" : "Continue")
  );
}

export function completesOnPrimaryInteraction(exercise: Exercise): boolean {
  return exercise.content?.completionMode === "direct";
}


export function getDisplayPrimaryLabel(
  exercise: Exercise,
  response: Record<string, unknown> | null,
  ready: boolean,
  defaultLabel: string,
): string {
  const category = resolveCourseExerciseCategory(exercise);
  if (
    isMicrolearningCategory(category) &&
    isMatchingFinalMicrolearningResponse(response, category || exercise.type)
  ) {
    return "Continue";
  }

  const courseLabel = getCoursePrimaryLabel(exercise, response);
  if (courseLabel) {
    return courseLabel;
  }

  const waitingLabel = exercise.content?.waitingPrimaryLabel;
  return !ready && typeof waitingLabel === "string"
    ? waitingLabel
    : defaultLabel;
}

export function buildRetryResponse(
  exercise: Exercise,
  response: Record<string, unknown>,
): Record<string, unknown> | null {
  const category = resolveCourseExerciseCategory(exercise);
  const config = category ? (courseExerciseCategoryEngineRegistry[category] || FINAL_BATCH_CATEGORY_CONFIGS[category as keyof typeof FINAL_BATCH_CATEGORY_CONFIGS]) : null;
  if (config?.interaction?.buildRetryResponse) {
    return config.interaction.buildRetryResponse(exercise, response);
  }

  const retryPhase = exercise.content?.retryPhase;
  if (typeof retryPhase !== "string") {
    return null;
  }

  const baseResponse = {
    ...response,
    phase: retryPhase,
    selectedOptionId: null,
    isCorrect: false,
    feedbackText: null,
  };
  return baseResponse;
}

export function readWorkedExplanation(
  exercise: Exercise | undefined,
): string | null {
  const support = exercise?.content?.support;
  if (support && typeof support === "object" && !Array.isArray(support)) {
    const supportRecord = support as Record<string, unknown>;
    return readString(
      supportRecord.workedAnswer ?? exercise?.content?.workedExample,
    );
  }

  return readString(exercise?.content?.workedExample);
}

export function buildResolvedResponse(
  exercise: Exercise,
  response: Record<string, unknown>,
  attemptCount: number,
): Record<string, unknown> {
  return {
    ...response,
    exerciseId: exercise.id,
    attempts: attemptCount,
    skipped: false,
  };
}

export function buildSkippedResponse(
  exercise: Exercise,
): Record<string, unknown> {
  return {
    format: exercise.type,
    exerciseId: exercise.id,
    isCorrect: false,
    attempts: 0,
    skipped: true,
  };
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}
