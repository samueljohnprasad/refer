import React from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { CourseExerciseOptionButton } from "@/src/components/exercise/CourseExerciseOptionButton";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
} from "@/src/components/exercise/courseExerciseTheme";
import {
  readCourseExerciseOptions,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function CourseChoiceCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const options = readCourseExerciseOptions(content.options);
  const selectedOptionId = readString(
    readRecord(savedResponse)?.selectedOptionId,
  );

  const selectOption = (optionId: string) => {
    if (locked) return;
    const option = options.find((item) => item.id === optionId);
    Haptics.selectionAsync();
    onInteraction(
      {
        format: CourseExerciseCategoryEnum.CourseChoice,
        phase: "choice",
        selectedOptionId: optionId,
        isCorrect: option?.isCorrect === true,
      },
      true,
    );
  };

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "Quick check"}
        instruction={
          readString(content.instruction) ?? "Choose the best answer."
        }
      />
      {readString(content.context) ? (
        <View style={styles.contextCard}>
          <Text style={styles.context}>{readString(content.context)}</Text>
        </View>
      ) : null}
      <Text style={styles.prompt}>{readString(content.prompt)}</Text>
      <View style={styles.options}>
        {options.map((option) => (
          <CourseExerciseOptionButton
            key={option.id}
            label={option.label}
            selected={selectedOptionId === option.id}
            selectedTone="olive"
            showConfirmationIcon={false}
            disabled={locked}
            onPress={() => selectOption(option.id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 12,
  },
  contextCard: {
    marginBottom: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 24,
    backgroundColor: COURSE_EXERCISE_COLORS.surface,
    shadowColor: COURSE_EXERCISE_COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  context: {
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 14.5,
    lineHeight: 22,
  },
  prompt: {
    marginBottom: 12,
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 17,
    lineHeight: 24,
  },
  options: { gap: 10 },
});
