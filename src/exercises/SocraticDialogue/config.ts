// ponytail: SocraticDialogueConfig with dynamic footer hiding until completion
import type { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { SocraticDialogueCategoryEngine } from "@/src/components/exercise/SocraticDialogueCategoryEngine";

export const SocraticDialogueConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.SocraticDialogue,
  formats: [CourseExerciseCategoryEnum.SocraticDialogue],
  engine: SocraticDialogueCategoryEngine,
  goalLabel: "Discover worry parking through one adaptive conversation.",
  unavailableCopy: "This guided conversation is not available yet.",
  presentation: {
    hideFooter: (_exercise, response) => {
      const res = response as { done?: boolean } | null;
      return res?.done !== true;
    },
    hideSkip: (_exercise, response) => {
      const res = response as { done?: boolean; step?: number } | null;
      return res?.done === true || (res?.step ?? 0) > 0;
    },
  },
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: () => "Continue",
    getPrimaryTransition: () => null,
  },
};

