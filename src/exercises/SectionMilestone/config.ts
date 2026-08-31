import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { SectionMilestoneCategoryEngine } from "@/src/components/exercise/SectionMilestoneCategoryEngine";
import type { CoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";

export const SectionMilestoneConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.SectionMilestone,
  formats: [CourseExerciseCategoryEnum.SectionMilestone],
  engine: SectionMilestoneCategoryEngine,
  goalLabel: "Recognize the skills completed in this section.",
  unavailableCopy: "This section milestone is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => {
      return response.opened === true ? "Return to Journey" : "Open milestone";
    },
    getPrimaryTransition: (exercise, response) => {
      return response.opened === true
        ? null
        : {
            kind: "response",
            ready: true,
            response: { ...response, opened: true },
          };
    },
  },
};
