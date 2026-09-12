import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { LensReplayCategoryEngine } from "@/src/components/exercise/LensReplayCategoryEngine";
import type { Exercise } from "@/src/types/journeyV5";

export const LensReplayConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.LensReplay,
  formats: [CourseExerciseCategoryEnum.LensReplay],
  engine: LensReplayCategoryEngine,
  goalLabel: "Separate one moment into event, alarm, and story.",
  unavailableCopy: "This lens replay is not available yet.",
  interaction: {
    submissionMode: "immediate",
    getPrimaryLabel: (exercise, response) => "Continue",
    getPrimaryTransition: (_exercise, _response) => null,
  },
};
