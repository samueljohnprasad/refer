import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { WhatIfCategoryEngine as WhatIfMachineCategoryEngine } from "@/src/components/exercise/whatif/WhatIfCategoryEngine";
import { validateWhatIfContent } from "@/src/components/exercise/whatif/whatIfContentValidation";
import type { Exercise } from "@/src/types/journeyV5";

function getWhatIfLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string {
  if (!response.selectedOptionId) return "Make your bet first";
  if (response.running !== true) return "Run it";

  const stepCount = Array.isArray(exercise.content?.steps)
    ? exercise.content.steps.length
    : 0;
  const visibleStepCount =
    typeof response.visibleStepCount === "number"
      ? response.visibleStepCount
      : 0;
  return visibleStepCount >= stepCount ? "Continue" : "Watch…";
}

export const WhatIfMachineConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.WhatIfMachine,
    formats: [CourseExerciseCategoryEnum.WhatIfMachine],
    engine: WhatIfMachineCategoryEngine as any,
    goalLabel: "Predict and observe how avoidance teaches fear.",
    unavailableCopy: "This what-if experiment is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => getWhatIfLabel(exercise, response),
    getPrimaryTransition: (exercise, response) => response.selectedOptionId && response.running !== true
        ? {
            kind: "response",
            ready: false,
            response: { ...response, running: true, visibleStepCount: 0 },
          }
        : null,
  },
  validation: validateWhatIfContent,
};
