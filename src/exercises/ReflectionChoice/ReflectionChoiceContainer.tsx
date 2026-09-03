import React, { useEffect } from "react";
import * as Haptics from "expo-haptics";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { readReflectionChoiceData, readSelectedReflectionId } from "@/src/exercises/ReflectionChoice/data";
import { ReflectionChoiceView } from "@/src/exercises/ReflectionChoice/ReflectionChoiceView";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function ReflectionChoiceContainer({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const data = readReflectionChoiceData(exercise);
  const selectedOptionId = readSelectedReflectionId(savedResponse);

  useEffect(() => {
    if (!savedResponse) onInteraction(createResponse(), false);
  }, [onInteraction, savedResponse]);

  const selectOption = (optionId: string) => {
    if (locked) return;
    Haptics.selectionAsync();
    onInteraction(createResponse(optionId), true);
  };

  return (
    <ReflectionChoiceView
      {...data}
      selectedOptionId={selectedOptionId}
      disabled={locked}
      onSelect={selectOption}
    />
  );
}

function createResponse(selectedOptionId: string | null = null) {
  return {
    format: CourseExerciseCategoryEnum.ReflectionChoice,
    feedbackValue: selectedOptionId,
  };
}
