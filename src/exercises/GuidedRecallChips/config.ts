import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { GuidedRecallChipsCategoryEngine } from "@/src/components/exercise/GuidedRecallChipsCategoryEngine";


const buildRetryResponse = (exercise: import("@/src/types/journeyV5").Exercise, response: Record<string, unknown>) => {
  const retryPhase = exercise.content?.retryPhase;
  if (typeof retryPhase !== "string") return null;
  return {
    ...response,
    phase: retryPhase,
    selectedOptionId: null,
    isCorrect: false,
    feedbackText: null,
    selectedChips: []
  };
};

export const GuidedRecallChipsConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.GuidedRecallChips,
    formats: [CourseExerciseCategoryEnum.GuidedRecallChips],
    engine: GuidedRecallChipsCategoryEngine,
    goalLabel: "Rebuild the avoidance loop in order.",
    unavailableCopy: "This guided recall is not available yet.",

};
