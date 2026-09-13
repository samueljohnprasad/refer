// ponytail: clean config with primary label binding
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
    getPrimaryLabel: () => "Continue",
    getPrimaryTransition: () => null,
  },
  presentation: {
    hideFooter: (_exercise, response) => {
      const res = response as { isFinalComplete?: boolean } | null;
      return res?.isFinalComplete !== true;
    },
    hideSkip: (_exercise, response) => {
      const res = response as {
        firstBranchIndex?: number;
        selectedBranchIndex?: number;
        isFinalComplete?: boolean;
      } | null;
      return (
        res?.firstBranchIndex != null ||
        res?.selectedBranchIndex != null ||
        res?.isFinalComplete === true
      );
    },
  },
};
