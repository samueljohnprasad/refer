import React, { useEffect } from "react";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { readPrivateCheckData, readPrivateCheckResponse } from "@/src/exercises/PrivateCheck/data";
import { PrivateCheckView } from "@/src/exercises/PrivateCheck/PrivateCheckView";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

const NONE_INDEX = -1;

export function PrivateCheckContainer({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const data = readPrivateCheckData(exercise);
  const response = readPrivateCheckResponse(savedResponse);

  useEffect(() => {
    if (!savedResponse) onInteraction(createResponse(), false);
  }, [onInteraction, savedResponse]);

  const toggleItem = (index: number) => {
    if (response.showingFeedback) return;
    const selectedIndexes = getNextSelectedIndexes(response.selectedIndexes, index);
    onInteraction(createResponse(selectedIndexes), selectedIndexes.length > 0);
  };

  return (
    <PrivateCheckView
      {...data}
      selectedIndexes={response.selectedIndexes}
      noneIndex={NONE_INDEX}
      showingFeedback={response.showingFeedback}
      onToggle={toggleItem}
    />
  );
}

function getNextSelectedIndexes(
  selectedIndexes: number[],
  toggledIndex: number,
): number[] {
  if (toggledIndex === NONE_INDEX) {
    return selectedIndexes.includes(NONE_INDEX) ? [] : [NONE_INDEX];
  }

  const selectedClues = selectedIndexes.filter((index) => index !== NONE_INDEX);
  return selectedClues.includes(toggledIndex)
    ? selectedClues.filter((index) => index !== toggledIndex)
    : [...selectedClues, toggledIndex];
}

function createResponse(selectedItemIndexes: number[] = []) {
  return {
    format: CourseExerciseCategoryEnum.PrivateCheck,
    phase: "selection",
    selectedItemIndexes,
    isCorrect: true,
  };
}
