import { getDialogueLabel, getNextDialogueState } from '@/src/domains/journey/learning/courseExercisePrimaryTransition';
import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { DialogueCategoryEngine } from "@/src/components/exercise/DialogueCategoryEngine";
import { validateDialogueContent } from "@/src/components/exercise/dialogueContent";

export const DialogueConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.Dialogue,
    formats: [CourseExerciseCategoryEnum.Dialogue],
    engine: DialogueCategoryEngine,
    goalLabel: "Compare two interpretations of the same event.",
    unavailableCopy: "This dialogue is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => getDialogueLabel(exercise, response),
    getPrimaryTransition: (exercise, response) => getNextDialogueState(exercise, response),
  },
  validation: validateDialogueContent,
};
