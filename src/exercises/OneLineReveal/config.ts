import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { OneLineRevealCategoryEngine } from "@/src/components/exercise/OneLineRevealCategoryEngine";

export const OneLineRevealConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.OneLineReveal,
    formats: [CourseExerciseCategoryEnum.OneLineReveal],
    engine: OneLineRevealCategoryEngine,
    goalLabel: "Complete one useful idea about avoidance.",
    unavailableCopy: "This one-line reveal is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => {
      const options = Array.isArray((exercise.content as Record<string, unknown>)?.options) 
        ? ((exercise.content as Record<string, unknown>).options as unknown[]) 
        : [];
      if (options.length > 0 && !response.selectedOptionId) {
        return "Select an option";
      }
      return response.revealed === true ? "Continue" : "Reveal the rest";
    },
    getPrimaryTransition: (exercise, response) => {
      const options = Array.isArray((exercise.content as Record<string, unknown>)?.options) 
        ? ((exercise.content as Record<string, unknown>).options as unknown[]) 
        : [];
        
      if (response.revealed === true) {
        return null; // Move to next node
      }
      
      // If there are options, we can't reveal until an option is selected
      if (options.length > 0 && !response.selectedOptionId) {
        return { kind: "response", ready: false, response };
      }
      
      return { kind: "response", ready: true, response: { ...response, revealed: true } };
    },
  },

};
