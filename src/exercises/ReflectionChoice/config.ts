import type { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { ReflectionChoiceContainer } from "@/src/exercises/ReflectionChoice/ReflectionChoiceContainer";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export const ReflectionChoiceConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.ReflectionChoice,
  formats: [CourseExerciseCategoryEnum.ReflectionChoice],
  engine: ReflectionChoiceContainer,
  goalLabel: "Reflect on whether a teaching idea helped.",
  unavailableCopy: "This reflection is not available yet.",
  interaction: {
    submissionMode: "explicit",
  },
};
