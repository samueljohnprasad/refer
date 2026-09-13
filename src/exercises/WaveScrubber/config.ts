import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { WaveScrubberCategoryEngine } from "@/src/components/exercise/WaveScrubberCategoryEngine";

export const WaveScrubberConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.WaveScrubber,
  formats: [CourseExerciseCategoryEnum.WaveScrubber],
  engine: WaveScrubberCategoryEngine,
  goalLabel: "Explore how an anxiety wave changes over time.",
  unavailableCopy: "This wave scrubber is not available yet.",
  interaction: {
    submissionMode: "explicit",
    // ponytail: continue CTA appears only once the pattern has been revealed
    getPrimaryLabel: () => "Continue",
    getPrimaryTransition: () => null,
  },
  presentation: {
    showsFeedbackInline: () => true,
    // ponytail: hide skip once learner begins scrubbing
    hideSkip: (_exercise, response) =>
      Boolean(response?.hasInteracted || response?.isComplete),
    // ponytail: hide footer button until the wave pattern has been revealed
    hideFooter: (_exercise, response) => response?.isComplete !== true,
  },
};

