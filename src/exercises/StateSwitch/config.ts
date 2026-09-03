import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { StateSwitchCategoryEngine } from "@/src/components/exercise/StateSwitchCategoryEngine";

export const StateSwitchConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.StateSwitch,
  formats: [CourseExerciseCategoryEnum.StateSwitch],
  engine: StateSwitchCategoryEngine,
  goalLabel: "Observe shifting states in a conceptual meter",
  unavailableCopy: "This exercise is not available yet.",
  presentation: {
    hideSkip: () => true,
    hideFooter: (exercise, response) => response?.phase !== "complete"
  },
  interaction: {
    submissionMode: "immediate",
    submissionRequirement: {
      fields: ["phase"],
      values: { phase: "complete" }
    },
    getPrimaryLabel: (exercise, response) => {
      if (response?.phase === "complete") return "Continue";
      return null;
    },
    getPrimaryTransition: (exercise, response) => {
      if (response?.phase === "complete") {
        return {
          kind: "route",
          route: "next",
        };
      }
      return undefined;
    }
  }
};
