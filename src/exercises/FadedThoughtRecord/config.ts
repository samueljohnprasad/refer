import { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { FadedThoughtRecordCategoryEngine } from "@/src/components/exercise/FadedThoughtRecordCategoryEngine";
import {
  getFadedThoughtRecordPrimaryLabel,
  getNextFadedThoughtRecordState,
} from "@/src/domains/journey/learning/fadedThoughtRecordTransition";

export const FadedThoughtRecordConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.FadedThoughtRecord,
  formats: [CourseExerciseCategoryEnum.FadedThoughtRecord],
  engine: FadedThoughtRecordCategoryEngine,
  goalLabel: "Complete more of a thought record as support fades.",
  unavailableCopy: "This thought-record practice is not available yet.",
  interaction: {
    submissionMode: "immediate",
    getPrimaryLabel: getFadedThoughtRecordPrimaryLabel,
    getPrimaryTransition: getNextFadedThoughtRecordState,
  },
};
