import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { CuriosityBetCategoryEngine } from "@/src/components/exercise/CuriosityBetCategoryEngine";

export const CuriosityBetConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.CuriosityBet,
  formats: [CourseExerciseCategoryEnum.CuriosityBet],
  engine: CuriosityBetCategoryEngine,
  goalLabel: "Commit to a prediction before seeing the panic timer.",
  unavailableCopy: "This curiosity bet is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) =>
      response.selectedOptionIndex == null ? "Pick your bet first" : "Lock it in",
  },
};
