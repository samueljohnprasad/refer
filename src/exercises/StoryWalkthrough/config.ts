import { getStoryWalkthroughLabel, getNextStoryWalkthroughState } from '@/src/domains/journey/learning/courseExercisePrimaryTransition';
import { CourseExerciseCategoryConfig, IMMEDIATE_OPTION_SELECTION } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { StoryWalkthroughCategoryEngine } from "@/src/components/exercise/StoryWalkthroughCategoryEngine";

export const StoryWalkthroughConfig: CourseExerciseCategoryConfig = {
category: CourseExerciseCategoryEnum.StoryWalkthrough,
    formats: [CourseExerciseCategoryEnum.StoryWalkthrough],
    engine: StoryWalkthroughCategoryEngine,
    goalLabel: "Follow a low-mood loop through one ordinary day.",
    unavailableCopy: "This story walkthrough is not available yet.",

};
