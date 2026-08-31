import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { SymptomDecoderCategoryEngine } from "@/src/components/exercise/SymptomDecoderCategoryEngine";

export const SymptomDecoderConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.SymptomDecoder,
    formats: [CourseExerciseCategoryEnum.SymptomDecoder],
    engine: SymptomDecoderCategoryEngine,
    goalLabel: "Connect a familiar signal to the stress response.",
    unavailableCopy: "This symptom decoder is not available yet.",

};
