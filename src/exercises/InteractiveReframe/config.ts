import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { InteractiveReframeCategoryEngine } from "@/src/components/exercise/InteractiveReframeCategoryEngine";

export const InteractiveReframeConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.InteractiveReframe,
  formats: [CourseExerciseCategoryEnum.InteractiveReframe],
  engine: InteractiveReframeCategoryEngine,
  goalLabel: "Reframe a thought.",
  unavailableCopy: "This exercise is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => response.step === 3 ? "Continue" : null,
    getPrimaryTransition: (exercise, response) => null,
  },
};
