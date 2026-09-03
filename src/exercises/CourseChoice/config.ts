import {
  IMMEDIATE_OPTION_SELECTION,
  type CourseExerciseCategoryConfig,
} from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { CourseChoiceContainer } from "@/src/exercises/CourseChoice/CourseChoiceContainer";
import { hasSelectedCourseChoiceFeedback } from "@/src/exercises/CourseChoice/data";

export const CourseChoiceConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.CourseChoice,
  formats: [CourseExerciseCategoryEnum.CourseChoice],
  engine: CourseChoiceContainer,
  goalLabel: "Apply the stress model to a familiar situation.",
  unavailableCopy: "This quick check is not available yet.",
  interaction: IMMEDIATE_OPTION_SELECTION,
  presentation: {
    showsFeedbackInline: hasSelectedCourseChoiceFeedback,
  },
};
