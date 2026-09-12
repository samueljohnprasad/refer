// ponytail: clean config with primary label binding
import { getStorySerialLabel } from "@/src/domains/journey/learning/courseExerciseSimpleTransitions";
import type { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { StorySerialCategoryEngine } from "@/src/components/exercise/StorySerialCategoryEngine";

export const StorySerialConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.StorySerial,
  formats: [CourseExerciseCategoryEnum.StorySerial],
  engine: StorySerialCategoryEngine,
  goalLabel: "Compare two honest paths, then notice what moved first.",
  unavailableCopy: "This story episode is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (_exercise, response) => getStorySerialLabel(response),
    getPrimaryTransition: () => null,
  },
};
