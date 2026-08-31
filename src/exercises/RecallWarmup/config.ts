import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { RecallWarmupCategoryEngine } from "@/src/components/exercise/microlearning/RecallWarmupCategoryEngine";
import { validateRecallWarmupContent } from "@/src/components/exercise/microlearning/recallWarmupContentValidation";
import { readRecallCards } from "@/src/components/exercise/courseExerciseSixthBatchContent";

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export const RecallWarmupConfig: CourseExerciseCategoryConfig = {
    category: CourseExerciseCategoryEnum.RecallWarmup,
    formats: [CourseExerciseCategoryEnum.RecallWarmup],
    engine: RecallWarmupCategoryEngine as any,
    goalLabel: "Retrieve three core ideas before rereading.",
    unavailableCopy: "This recall warm-up is not available yet.",
    interaction: {
        submissionMode: "explicit",
        getPrimaryLabel: (exercise, response) => {
            if (response.revealed !== true) return "Flip the card";
            const cardIndex = readNumber(response.cardIndex);
            const cardCount = readRecallCards(exercise.content?.cards).length;
            return cardIndex < cardCount - 1 ? "Next one" : "Wrap up";
        },
        getPrimaryTransition: (exercise, response) => {
            if (response.revealed !== true) {
                return {
                    kind: "response",
                    ready: true,
                    response: { ...response, revealed: true },
                };
            }

            const cardIndex = readNumber(response.cardIndex);
            const cardCount = readRecallCards(exercise.content?.cards).length;
            if (cardIndex >= cardCount - 1) return { kind: "check" };
            return {
                kind: "response",
                ready: true,
                response: { ...response, cardIndex: cardIndex + 1, revealed: false },
            };
        }
    },
    validation: validateRecallWarmupContent,
};
