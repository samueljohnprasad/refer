import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { TeachBackChainCategoryEngine } from "@/src/components/exercise/TeachBackChainCategoryEngine";
import { validateTeachBackChainContent } from "@/src/components/exercise/teachBackChainValidation";
import { getTeachBackChainPrimaryLabel, getNextTeachBackChainState } from "@/src/domains/journey/learning/teachBackChainTransition";

export const TeachBackChainConfig: CourseExerciseCategoryConfig = {
    category: CourseExerciseCategoryEnum.TeachBackChain,
    formats: [CourseExerciseCategoryEnum.TeachBackChain],
    engine: TeachBackChainCategoryEngine,
    goalLabel: "Teach the avoidance loop back in sequence.",
    unavailableCopy: "This teach-back is not available yet.",
    interaction: {
        submissionMode: "explicit",
        getPrimaryLabel: getTeachBackChainPrimaryLabel,
        getPrimaryTransition: getNextTeachBackChainState,
    },
    validation: validateTeachBackChainContent,
};
