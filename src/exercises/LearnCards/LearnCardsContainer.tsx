import React, { useEffect } from "react";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { LearnCardsView } from "@/src/exercises/LearnCards/LearnCardsView";
import { readLearnCardsData, readLearnCardsResponse } from "@/src/exercises/LearnCards/data";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function LearnCardsContainer({ exercise, savedResponse, locked = false, onInteraction }: V1CategoryEngineProps) {
  const data = readLearnCardsData(exercise);
  const response = readLearnCardsResponse(savedResponse);

  useEffect(() => {
    if (!savedResponse) onInteraction(createCardResponse(0), true);
  }, [onInteraction, savedResponse]);

  const selectRecallOption = (optionId: string) => {
    if (locked || !data.recall) return;
    onInteraction({
      format: CourseExerciseCategoryEnum.LearnCards,
      phase: "recall",
      cardIndex: response.cardIndex,
      selectedOptionId: optionId,
      isCorrect: optionId === data.recall.correctOptionId,
    }, true);
  };

  return <LearnCardsView {...data} {...response} locked={locked} onSelectRecallOption={selectRecallOption} />;
}

function createCardResponse(cardIndex: number) {
  return { format: CourseExerciseCategoryEnum.LearnCards, phase: "cards", cardIndex };
}
