import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { WaveSequenceCategoryEngine } from "@/src/components/exercise/WaveSequenceCategoryEngine";

export const WaveSequenceConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.WaveSequence,
    formats: [CourseExerciseCategoryEnum.WaveSequence],
    engine: WaveSequenceCategoryEngine,
    goalLabel: "See the full anxiety wave, including its fade.",
    unavailableCopy: "This wave sequence is not available yet.",

};
