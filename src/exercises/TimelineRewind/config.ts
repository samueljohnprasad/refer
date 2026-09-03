import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { TimelineRewindCategoryEngine } from "@/src/components/exercise/TimelineRewindCategoryEngine";

export const TimelineRewindConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.TimelineRewind,
  formats: [CourseExerciseCategoryEnum.TimelineRewind],
  engine: TimelineRewindCategoryEngine,
  goalLabel:
    "Compare an objective timeline against a subjective interpretation.",
  unavailableCopy: "This timeline exercise is not available yet.",
  presentation: {
    hideSkip: () => true,
    hideFooter: (exercise, response) => response?.phase !== "complete",
  },
  interaction: {
    submissionMode: "immediate",
    submissionRequirement: {
      fields: ["phase"],
      values: { phase: "complete" },
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
    },
  },
};
