import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { PanicWaveCommitCategoryEngine } from "@/src/components/exercise/PanicWaveCommitCategoryEngine";

function getCommitLabel(response: Record<string, unknown>): string {
  if (response.phase === "running") return "Watch…";
  if (response.phase === "revealed") return "Continue";
  return "Run the wave";
}

export const PanicWaveCommitConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.PanicWaveCommit,
  formats: [CourseExerciseCategoryEnum.PanicWaveCommit],
  engine: PanicWaveCommitCategoryEngine,
  goalLabel: "Compare a prediction with the wave’s built-in fade.",
  unavailableCopy: "This panic-wave prediction is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => getCommitLabel(response),
    getPrimaryTransition: (exercise, response) => {
      return response.phase === "ready"
        ? {
            kind: "response",
            ready: false,
            response: { ...response, phase: "running" },
          }
        : null;
    },
  },
};
