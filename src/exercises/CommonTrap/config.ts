import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { CommonTrapCategoryEngine } from "@/src/components/exercise/CommonTrapCategoryEngine";

export const CommonTrapConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.CommonTrap,
  formats: [CourseExerciseCategoryEnum.CommonTrap],
  engine: CommonTrapCategoryEngine,
  goalLabel: "See why a tempting coping move rebounds.",
  unavailableCopy: "This common-trap exercise is not available yet.",
  // ponytail: engine drives phase reveals; hide skip once user progresses past trap
  presentation: {
    hideSkip: (_exercise, response) => Boolean(response?.phase && response.phase !== "trap"),
  },
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: () => "Continue",
  },
};
