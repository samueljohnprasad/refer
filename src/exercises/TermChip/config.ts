// ponytail: clean TermChip config with progressive footer/skip visibility
import type { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { TermChipCategoryEngine } from "@/src/components/exercise/TermChipCategoryEngine";

export const TermChipConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.TermChip,
  formats: [CourseExerciseCategoryEnum.TermChip],
  engine: TermChipCategoryEngine,
  goalLabel: "Tap each term to reveal its meaning.",
  unavailableCopy: "This term exercise is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: () => "Continue",
    getPrimaryTransition: () => null,
  },
  presentation: {
    hideFooter: (exercise, response) => {
      const chips = Array.isArray(exercise?.content?.chips) ? exercise.content.chips : [];
      const exploredIds = Array.isArray(response?.exploredIds)
        ? response.exploredIds
        : Array.isArray(response?.openedIds)
          ? response.openedIds
          : [];
      return chips.length === 0 || exploredIds.length < chips.length;
    },
    hideSkip: (exercise, response) => {
      const exploredIds = Array.isArray(response?.exploredIds)
        ? response.exploredIds
        : Array.isArray(response?.openedIds)
          ? response.openedIds
          : [];
      return exploredIds.length > 0;
    },
  },
};
