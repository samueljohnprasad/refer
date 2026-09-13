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
            if (response?.phase === "complete") return "CONTINUE";
            return null;
        },
        getPrimaryTransition: (exercise, response) => {
            if (response?.phase === "complete") return { kind: "check" };
            return null;
        }
    },
    presentation: {
        hideFooter: (exercise, response) => response?.phase !== "complete",
        hideSkip: (exercise, response) => {
            const index = readNumber(response?.currentCardIndex);
            const cardPhase = response?.cardPhase;
            return response?.phase === "complete" || index > 0 || cardPhase === "answer";
        }
    },
    validation: validateRecallWarmupContent,
};
