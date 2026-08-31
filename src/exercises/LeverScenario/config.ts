import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { LeverScenarioCategoryEngine } from "@/src/components/exercise/LeverScenarioCategoryEngine";
import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";
import type { Exercise } from "@/src/types/journeyV5";

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export const LeverScenarioConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.LeverScenario,
  formats: [CourseExerciseCategoryEnum.LeverScenario],
  engine: LeverScenarioCategoryEngine,
  goalLabel: "Choose the right lever in a live moment.",
  unavailableCopy: "This lever scenario is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (
      exercise: Exercise,
      response: Record<string, unknown>,
    ): string => {
      if (response.phase !== "feedback") return "Choose an answer";
      if (response.isCorrect === true) return "Continue";
      return readNumber(response.attempts) >= 3
        ? "Try a changed example"
        : "Try again";
    },
    getPrimaryTransition: (
      exercise: Exercise,
      response: Record<string, unknown>,
    ): CoursePrimaryTransition | undefined => {
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
    },
  },
};
