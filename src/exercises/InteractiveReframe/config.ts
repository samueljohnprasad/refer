import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { InteractiveReframeCategoryEngine } from "@/src/components/exercise/InteractiveReframeCategoryEngine";

export const InteractiveReframeConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.InteractiveReframe,
  formats: [CourseExerciseCategoryEnum.InteractiveReframe],
  engine: InteractiveReframeCategoryEngine,
  goalLabel: "Reframe a thought.",
  unavailableCopy: "This exercise is not available yet.",
  presentation: {
    hideSkip: (exercise, response) => {
      const step = typeof response?.step === 'number' ? response.step : 0;
      return step > 0 || response?.isWrong === true;
    },
  },
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => {
      if (response.step === 2) return "Continue";
      if (response.isWrong) return "Try another reading";
      return null;
    },
    getPrimaryTransition: (exercise, response) => {
      if (response.isWrong) {
        return { kind: "response", ready: false, response: { ...response, step: 0, isWrong: false } };
      }
      return null;
    },
  },
};
