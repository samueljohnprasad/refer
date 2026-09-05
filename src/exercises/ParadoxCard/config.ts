import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { ParadoxCardCategoryEngine } from "@/src/components/exercise/ParadoxCardCategoryEngine";

export const ParadoxCardConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.ParadoxCard,
    formats: [CourseExerciseCategoryEnum.ParadoxCard],
    engine: ParadoxCardCategoryEngine,
    goalLabel: "Experience why forcing calm can feed the alarm.",
    unavailableCopy: "This paradox exercise is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => {
      const stage = response?.stage || "ready";
      if (stage === "ready") return "Try harder";
      if (stage === "result") return "See why";
      return "Continue";
    },
    getPrimaryTransition: (exercise, response) => {
      const stage = response?.stage || "ready";
      if (stage === "ready") {
        return { kind: "response", ready: true, response: { ...response, stage: "result" } };
      }
      if (stage === "result") {
        return { kind: "response", ready: true, response: { ...response, stage: "explanation" } };
      }
      return null;
    },
  },

};
