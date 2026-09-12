// ponytail: explicit interaction config for surge diagram
import type { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { SurgeDiagramCategoryEngine } from "@/src/components/exercise/SurgeDiagramCategoryEngine";

export const SurgeDiagramConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.SurgeDiagram,
  formats: [CourseExerciseCategoryEnum.SurgeDiagram],
  engine: SurgeDiagramCategoryEngine,
  goalLabel: "See the built-in rise and fade of a stress surge.",
  unavailableCopy: "This surge diagram is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: () => "Continue",
    getPrimaryTransition: () => null,
  },
};
