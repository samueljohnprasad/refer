import type { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";
import { getLearnCardsLabel, getNextLearnCardsState } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";
import { LearnCardsContainer } from "@/src/exercises/LearnCards/LearnCardsContainer";
import { hasSelectedRecallFeedback } from "@/src/exercises/LearnCards/data";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export const LearnCardsConfig: CourseExerciseCategoryConfig = {
  category: CourseExerciseCategoryEnum.LearnCards,
  formats: [CourseExerciseCategoryEnum.LearnCards],
  engine: LearnCardsContainer,
  goalLabel: "Learn one idea, then recall it.",
  unavailableCopy: "These learning cards are not available yet.",
  interaction: {
    submissionMode: "immediate",
    submissionRequirement: { fields: ["selectedOptionId"], values: { phase: "recall" } },
    getPrimaryLabel: getLearnCardsLabel,
    getPrimaryTransition: getNextLearnCardsState,
    buildRetryResponse: (_exercise, response) => ({
      format: CourseExerciseCategoryEnum.LearnCards,
      phase: "recall",
      cardIndex: response.cardIndex,
      selectedOptionId: null,
    }),
  },
  presentation: {
    hideSkip: () => true,
    showsFeedbackInline: hasSelectedRecallFeedback,
  },
};
