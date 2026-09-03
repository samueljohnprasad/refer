import React from "react";
import * as Haptics from "expo-haptics";
import { CourseChoiceView } from "@/src/exercises/CourseChoice/CourseChoiceView";
import {
  readCourseChoiceData,
  readSelectedCourseChoiceId,
} from "@/src/exercises/CourseChoice/data";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function CourseChoiceContainer({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const data = readCourseChoiceData(exercise);
  const selectedOptionId = readSelectedCourseChoiceId(savedResponse);

  const selectOption = (optionId: string) => {
    if (locked) return;
    const option = data.options.find((item) => item.id === optionId);
    Haptics.selectionAsync();
    onInteraction({
      format: CourseExerciseCategoryEnum.CourseChoice,
      phase: "choice",
      selectedOptionId: optionId,
      isCorrect: option?.isCorrect === true,
    }, true);
  };

  return (
    <CourseChoiceView
      {...data}
      selectedOptionId={selectedOptionId}
      locked={locked}
      onSelect={selectOption}
    />
  );
}
