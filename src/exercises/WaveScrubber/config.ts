import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { WaveScrubberCategoryEngine } from "@/src/components/exercise/WaveScrubberCategoryEngine";

export const WaveScrubberConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.WaveScrubber,
    formats: [CourseExerciseCategoryEnum.WaveScrubber],
    engine: WaveScrubberCategoryEngine,
    goalLabel: "Explore how a real anxiety wave changes minute by minute.",
    unavailableCopy: "This wave scrubber is not available yet.",

};
