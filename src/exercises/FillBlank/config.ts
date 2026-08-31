import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { FillBlankCategoryEngine } from "@/src/components/exercise/FillBlankCategoryEngine";
import { readFillBlankVariants } from "@/src/components/exercise/courseExerciseSixthBatchContent";
import { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function resetFillBlankResponse(
  response: Record<string, unknown>,
  variantIndex: number,
): CoursePrimaryTransition {
  return {
    kind: "response",
    ready: false,
    response: {
      ...response,
      phase: "entry",
      variantIndex,
      input: "",
      feedbackText: null,
      isCorrect: false,
      supported: false,
    },
  };
}

export const FillBlankConfig: CourseExerciseCategoryConfig = {
    category: CourseExerciseCategoryEnum.FillBlank,
    formats: [CourseExerciseCategoryEnum.FillBlank],
    engine: FillBlankCategoryEngine,
    goalLabel: "Name adrenaline and recognize its temporary effects.",
    unavailableCopy: "This fill-in-the-blank is not available yet.",
    interaction: {
        submissionMode: "explicit",
        getPrimaryLabel: (exercise, response) => {
            if (response.phase !== "feedback") {
                const input = typeof response.input === "string" ? response.input : "";
                return input.trim() ? "Check answer" : "Type the missing word";
            }
            if (response.isCorrect === true || response.supported === true) {
                return "Continue";
            }

            const attemptCount = readNumber(response.attemptCount);
            if (attemptCount < 3) return "Try again";
            const variants = readFillBlankVariants(exercise.content?.variants);
            return readNumber(response.variantIndex) < variants.length - 1
                ? "Try a changed example"
                : "Show me the answer";
        },
        getPrimaryTransition: (exercise, response) => {
            const variants = readFillBlankVariants(exercise.content?.variants);
            const variantIndex = readNumber(response.variantIndex);
            const variant = variants[variantIndex] ?? variants[0];
            if (!variant) return null;

            if (response.phase !== "feedback") {
                const input = typeof response.input === "string" ? response.input : "";
                const answer = input.trim().toLowerCase();
                const correct = variant.answers.includes(answer);
                return {
                    kind: "response",
                    ready: true,
                    response: {
                        ...response,
                        phase: "feedback",
                        isCorrect: correct,
                        attemptCount: readNumber(response.attemptCount) + (correct ? 0 : 1),
                        feedbackText: correct
                            ? variant.correctFeedback
                            : variant.incorrectFeedback,
                    },
                };
            }

            if (response.isCorrect === true || response.supported === true) {
                return null;
            }

            const attemptCount = readNumber(response.attemptCount);
            if (attemptCount >= 3 && variantIndex < variants.length - 1) {
                return resetFillBlankResponse(response, variantIndex + 1);
            }
            if (attemptCount >= 3) {
                return {
                    kind: "response",
                    ready: true,
                    response: {
                        ...response,
                        input: variant.answers[0],
                        isCorrect: false,
                        supported: true,
                        feedbackText: variant.workedExample,
                    },
                };
            }
            return resetFillBlankResponse(response, variantIndex);
        }
    }
};
