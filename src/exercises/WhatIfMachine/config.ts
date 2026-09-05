import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { WhatIfCategoryEngine as WhatIfMachineCategoryEngine } from "@/src/components/exercise/whatif/WhatIfCategoryEngine";
import { validateWhatIfContent } from "@/src/components/exercise/whatif/whatIfContentValidation";
import type { Exercise } from "@/src/types/journeyV5";

function getWhatIfLabel(
  exercise: Exercise,
  response: Record<string, unknown>,
): string {
  if (response.phase === "complete") return "Continue";
  if (response.phase === "running") return "Next";
  if (!response.selectedPredictionId) return "Make your bet first";
  return "Run it";
}

export const WhatIfMachineConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.WhatIfMachine,
  formats: [CourseExerciseCategoryEnum.WhatIfMachine],
  engine: WhatIfMachineCategoryEngine,
  goalLabel: "Predict and observe how avoidance teaches fear.",
  unavailableCopy: "This what-if experiment is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => getWhatIfLabel(exercise, response),
    getPrimaryTransition: (exercise, response) => {
      // Allow NodeEngineRouter's default completion flow to take over
      if (response.phase === "complete") {
        return null;
      }
      if (response.phase === "prediction" && response.selectedPredictionId) {
        return {
          kind: "response",
          ready: true,
          response: { 
            ...response, 
            format: CourseExerciseCategoryEnum.WhatIfMachine,
            phase: "running", 
            consequenceIndex: 1 
          },
        };
      }
      if (response.phase === "running") {
        const stepCount = (exercise.content?.steps as any[])?.length || 0;
        const currentIndex = (response.consequenceIndex as number) || 1;
        if (currentIndex < stepCount) {
          return {
            kind: "response",
            ready: true,
            response: { 
              ...response, 
              format: CourseExerciseCategoryEnum.WhatIfMachine,
              consequenceIndex: currentIndex + 1 
            },
          };
        } else {
          return {
            kind: "response",
            ready: true,
            response: { 
              ...response, 
              format: CourseExerciseCategoryEnum.WhatIfMachine,
              phase: "complete" 
            },
          };
        }
      }
      return null;
    },
  },
  validation: validateWhatIfContent,
};
