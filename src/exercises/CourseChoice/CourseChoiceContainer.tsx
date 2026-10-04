import React from "react";
import * as Haptics from "expo-haptics";
import { CourseChoiceView } from "@/src/exercises/CourseChoice/CourseChoiceView";
import {
  readCourseChoiceData,
  readSelectedCourseChoiceId,
} from "@/src/exercises/CourseChoice/data";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";
import { translateStepCopyProps } from "@/src/lib/i18n/exerciseCopy";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function CourseChoiceContainer({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const translateCopy = useExerciseCopy();
  const localizedExercise = {
    ...exercise,
    content: translateStepCopyProps(exercise.content ?? {}, translateCopy),
  };
  const parsedData = readCourseChoiceData(localizedExercise);
  const data = {
    ...parsedData,
    title: translateCopy(parsedData.title),
  };
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
