import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { TwoDialSandboxCategoryEngine } from "@/src/components/exercise/TwoDialSandboxCategoryEngine";

export const TwoDialSandboxConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.TwoDialSandbox,
    formats: [CourseExerciseCategoryEnum.TwoDialSandbox],
    engine: TwoDialSandboxCategoryEngine,
    goalLabel: "Explore how load and recovery work together.",
    unavailableCopy: "This two-dial model is not available yet.",

};
