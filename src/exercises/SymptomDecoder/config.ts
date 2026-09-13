import type { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { SymptomDecoderCategoryEngine } from "@/src/components/exercise/SymptomDecoderCategoryEngine";

// ponytail: personal symptom selection completes directly without quiz scoring
export const SymptomDecoderConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.SymptomDecoder,
  formats: [CourseExerciseCategoryEnum.SymptomDecoder],
  engine: SymptomDecoderCategoryEngine,
  goalLabel: "Connect a familiar signal to the stress response.",
  unavailableCopy: "This symptom decoder is not available yet.",
  interaction: {
    submissionMode: "explicit",
    completesDirectly: true,
    getPrimaryLabel: () => "Continue",
    getPrimaryTransition: () => null,
  },
  presentation: {
    hideFooter: (_exercise, response) => !response?.selectedOptionId,
    hideSkip: (_exercise, response) => Boolean(response?.selectedOptionId),
  },
};
