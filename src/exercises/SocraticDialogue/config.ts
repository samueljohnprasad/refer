import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { SocraticDialogueCategoryEngine } from "@/src/components/exercise/SocraticDialogueCategoryEngine";

export const SocraticDialogueConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.SocraticDialogue,
  formats: [CourseExerciseCategoryEnum.SocraticDialogue],
  engine: SocraticDialogueCategoryEngine,
  goalLabel: "Discover worry parking through one adaptive conversation.",
  unavailableCopy: "This guided conversation is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => {
      return response.done === true ? "Continue" : "Reply above";
    },
    getPrimaryTransition: (_exercise, _response) => {
      return null;
    },
  },
};
