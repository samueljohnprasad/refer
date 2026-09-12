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
    completesDirectly: true,
    getPrimaryLabel: () => "Continue",
  },
  presentation: {
    showsFeedbackInline: () => true,
    hideFooter: (exercise: Exercise, response: Record<string, unknown> | null) => {
      if (response?.isComplete) return false;
      const explored = readArray(response?.explored);
      const cards = Array.isArray(exercise?.content?.cards) ? exercise.content.cards : [];
      const totalCards = cards.length > 0 ? cards.length : 2;
      return explored.length < totalCards || explored.some((v) => !v);
    },
    hideSkip: (exercise: Exercise, response: Record<string, unknown> | null) => {
      if (response?.isComplete) return true;
      const explored = readArray(response?.explored);
      const hasInteracted = Boolean(response?.hasInteracted || explored.some(Boolean));
      return hasInteracted;
    },
  },
};
