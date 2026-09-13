import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { WaveOrderingCategoryEngine } from "@/src/components/exercise/WaveOrderingCategoryEngine";
import { readWaveOrderVariants } from "@/src/components/exercise/courseExerciseSeventhBatchContent";
import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";
import type { Exercise } from "@/src/types/journeyV5";

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

// ponytail: straightforward CTA labels: "Continue" when finished, "Try again" on wrong check, else "Check order"
function getWaveOrderLabel(
  _exercise: Exercise,
  response: Record<string, unknown>,
): string {
  if (response?.isCorrect === true || response?.phase === "complete") {
    return "Continue";
  }
  if (response?.phase === "feedback" && !response?.isCorrect) {
    return "Try again";
  }
  return "Check order";
}

// ponytail: check order transition, resets to entry on Try again
function getNextWaveOrderState(
  exercise: Exercise,
  response: Record<string, unknown>,
): CoursePrimaryTransition | null {
  if (response?.isCorrect === true || response?.phase === "complete") {
    return null;
  }

  if (response?.phase === "feedback" && !response?.isCorrect) {
    return {
      kind: "response",
      ready: true,
      response: {
        ...response,
        phase: "entry",
        evaluated: false,
      },
    };
  }

  const variants = readWaveOrderVariants(exercise.content?.variants);
  const variantIndex = readNumber(response?.variantIndex);
  const variant = variants[variantIndex] ?? variants[0];
  if (!variant) return null;

  const tray = readStringArray(response?.tray ?? response?.order);
  const marks = variant.answer.map((ans, idx) => tray[idx] === ans);
  const isCorrect = marks.length === variant.answer.length && marks.every(Boolean);
  const rightCount = marks.filter(Boolean).length;

  return {
    kind: "response",
    ready: true,
    response: {
      ...response,
      tray,
      order: tray,
      phase: isCorrect ? "complete" : "feedback",
      marks,
      isCorrect,
      evaluated: true,
      canCheck: true,
      attemptCount: readNumber(response?.attemptCount) + 1,
      rightCount,
      feedbackText: isCorrect
        ? variant.correctFeedback
        : `${rightCount} of ${variant.answer.length} ${rightCount === 1 ? "is" : "are"} in the right place. Reorder the remaining ${variant.answer.length - rightCount}.`,
    },
  };
}

export const WaveOrderingConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.WaveOrdering,
  formats: [CourseExerciseCategoryEnum.WaveOrdering],
  engine: WaveOrderingCategoryEngine,
  goalLabel: "Order the phases into how they happen.",
  unavailableCopy: "This wave ordering exercise is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => getWaveOrderLabel(exercise, response),
    getPrimaryTransition: (exercise, response) => getNextWaveOrderState(exercise, response),
  },
  presentation: {
    showsFeedbackInline: () => true,
    // ponytail: hide skip once learner evaluates order
    hideSkip: (_exercise, response) => {
      return Boolean(
        response?.evaluated === true ||
        (typeof response?.attemptCount === "number" && response.attemptCount > 0) ||
        response?.isCorrect === true ||
        response?.phase === "complete" ||
        response?.phase === "feedback"
      );
    },
    // ponytail: footer button always visible (disabled when tray incomplete, enabled when ready)
    hideFooter: () => false,
  },
};

