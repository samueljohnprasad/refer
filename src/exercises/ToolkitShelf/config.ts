import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { ToolkitShelfCategoryEngine } from "@/src/components/exercise/ToolkitShelfCategoryEngine";

export const ToolkitShelfConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.ToolkitShelf,
  formats: [CourseExerciseCategoryEnum.ToolkitShelf],
  engine: ToolkitShelfCategoryEngine,
  goalLabel: "Choose the right lever for the moment.",
  unavailableCopy: "This toolkit shelf is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => {
      return typeof response.selectedMomentIndex === "number"
        ? "Continue"
        : "Tap a moment above";
    },
    getPrimaryTransition: (_exercise, _response) => {
      return null;
    },
  },
};
