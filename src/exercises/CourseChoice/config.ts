import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { CourseChoiceCategoryEngine } from "@/src/components/exercise/CourseChoiceCategoryEngine";


function readString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

const getSelectedOptionFeedback = (exercise: import("@/src/types/journeyV5").Exercise, response?: Record<string, unknown> | null) => {
  const selectedOptionId = readString(response?.selectedOptionId);
  const options = exercise?.content?.options;
  if (!selectedOptionId || !Array.isArray(options)) return null;
  const selectedOption = options.find(option => option && typeof option === "object" && !Array.isArray(option) && readString((option as Record<string, unknown>).id) === selectedOptionId);
  return selectedOption && typeof selectedOption === "object" ? readString((selectedOption as Record<string, unknown>).feedback) : null;
};

export const CourseChoiceConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.CourseChoice,
    formats: [CourseExerciseCategoryEnum.CourseChoice],
    engine: CourseChoiceCategoryEngine,
    goalLabel: "Apply the stress model to a familiar situation.",
    unavailableCopy: "This quick check is not available yet.",
    interaction: IMMEDIATE_OPTION_SELECTION,

};
