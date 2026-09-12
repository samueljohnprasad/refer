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
    getPrimaryLabel: () => "Continue",
  },
  presentation: {
    hideFooter: (exercise, response) => {
      const explored = readArray(response.explored);
      return explored.length < 2 || explored.some((v) => !v);
    },
    hideSkip: (exercise, response) => {
      const explored = readArray(response.explored);
      return explored.some((v) => !!v);
    }
  }
};
