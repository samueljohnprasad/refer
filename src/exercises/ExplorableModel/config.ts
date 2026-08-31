import { getExplorableModelPrimaryLabel, getNextExplorableModelState } from '@/src/domains/journey/learning/courseExercisePrimaryTransition';
import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { ExplorableModelCategoryEngine } from "@/src/components/exercise/ExplorableModelCategoryEngine";
import { validateExplorableModelContent } from "@/src/components/exercise/explorableModelContent";

export const ExplorableModelConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.ExplorableModel,
    formats: [CourseExerciseCategoryEnum.ExplorableModel],
    engine: ExplorableModelCategoryEngine,
    goalLabel: "Open one lever at a time in a working stress model.",
    unavailableCopy: "This explorable model is not available yet.",
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => getExplorableModelPrimaryLabel(exercise, response),
    getPrimaryTransition: (exercise, response) => getNextExplorableModelState(exercise, response) ?? null,
  },
  validation: validateExplorableModelContent,
};
