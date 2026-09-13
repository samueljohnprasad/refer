import type { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { WaveFaqCategoryEngine } from "@/src/components/exercise/WaveFaqCategoryEngine";

// ponytail: progressive discovery for why panic alarms re-trigger
export const WaveFaqConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.WaveFaq,
  formats: [CourseExerciseCategoryEnum.WaveFaq],
  engine: WaveFaqCategoryEngine,
  goalLabel: "Recognize a fresh worry as a re-trigger, not a failed fade.",
  unavailableCopy: "This wave answer is not available yet.",
  interaction: {
    submissionMode: "explicit",
    completesDirectly: true,
    getPrimaryLabel: () => "Continue",
    getPrimaryTransition: () => null,
  },
  presentation: {
    hideFooter: (_exercise, response, ready) => !ready && !response?.ready && !response?.isComplete,
    hideSkip: (_exercise, response) => Boolean(response?.selectedOptionId || response?.hasInteracted),
  },
};
