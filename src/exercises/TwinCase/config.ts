import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { TwinCaseCategoryEngine } from "@/src/components/exercise/TwinCaseCategoryEngine";

export const TwinCaseConfig: CourseExerciseCategoryConfig = {
    category: CourseExerciseCategoryEnum.TwinCase,
    formats: [CourseExerciseCategoryEnum.TwinCase],
    engine: TwinCaseCategoryEngine,
    goalLabel: "Build an analogy by matching its parts.",
    unavailableCopy: "This matching exercise is not available yet.",
    interaction: {
      submissionMode: "explicit",
      buildRetryResponse: (exercise, response) => {
        const formedPairs = (response.formedPairs as Record<string, string>) ?? {};
        const correctPairs: Record<string, string> = {};
        const lockedPairIds: string[] = [];
        for (const [left, right] of Object.entries(formedPairs)) {
          if (left === right) {
            correctPairs[left] = right;
            lockedPairIds.push(left);
          }
        }
        return {
          ...response,
          formedPairs: correctPairs,
          matchedPairIds: Object.keys(correctPairs),
          lockedPairIds,
          isCorrect: false,
          selectedLeftId: null,
        };
      }
    }
};
