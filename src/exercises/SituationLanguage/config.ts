import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { SituationLanguageCategoryEngine } from "@/src/components/exercise/SituationLanguageCategoryEngine";
import type { Exercise } from "@/src/types/journeyV5";

function readArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export const SituationLanguageConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.SituationLanguage,
  formats: [CourseExerciseCategoryEnum.SituationLanguage],
  engine: SituationLanguageCategoryEngine,
  goalLabel: "Shift fixed identity language toward a changeable situation.",
  unavailableCopy: "This language exercise is not available yet.",
  interaction: {
    submissionMode: "immediate",
    getPrimaryLabel: (
      exercise: Exercise,
      response: Record<string, unknown>,
    ): string => {
      return readArray(response.modes)[1] === "situation"
        ? "Continue"
        : "Flip the second one yourself";
    },
  },
};
