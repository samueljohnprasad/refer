import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
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

export function SymptomDecoderCategoryEngine({
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
  const selectedOption = options.find(
    (option) => option.id === selectedOptionId,
  );

  const chooseOption = (optionId: string) => {
    if (locked) {
      return;
    }

    onInteraction(
      {
        format: CourseExerciseCategoryEnum.SymptomDecoder,
        selectedOptionId: optionId,
        isCorrect: true,
      },
      true,
    );
  };

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "Which of these do you know?"}
        instruction={
          readString(content.instruction) ??
          "Tap the one that sounds most like you."
        }
      />

      <View style={styles.options}>
        {options.map((option) => (
          <CourseExerciseOptionButton
            key={option.id}
            label={option.label}
            selected={selectedOptionId === option.id}
            disabled={locked}
            onPress={() => chooseOption(option.id)}
          />
        ))}
      </View>

      {selectedOption ? (
        <View style={styles.reveal}>
          <Text style={styles.revealTitle}>{selectedOption.detail}</Text>
          <Text style={styles.revealBody}>{selectedOption.body}</Text>
          {selectedOption.next ? (
            <Text style={styles.next}>{selectedOption.next}</Text>
          ) : null}
        </View>
      ) : null}

      <View style={styles.privateNote}>
        <Feather name="lock" size={14} color={COURSE_EXERCISE_COLORS.inkSoft} />
        <Text style={styles.privateNoteText}>
          Private. Your choice quietly shapes which lessons come first.
        </Text>
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
  options: { gap: 9 },
  reveal: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 17,
    borderWidth: 1,
    borderColor: COURSE_EXERCISE_COLORS.border,
    borderRadius: 24,
    backgroundColor: COURSE_EXERCISE_COLORS.surface,
  },
  revealTitle: {
    color: COURSE_EXERCISE_COLORS.accentDark,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 18,
    lineHeight: 23,
  },
  revealBody: {
    marginTop: 7,
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 15,
    lineHeight: 22,
  },
  next: {
    marginTop: 10,
    color: COURSE_EXERCISE_COLORS.accent,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 13,
    lineHeight: 18,
  },
  privateNote: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
  },
  privateNoteText: {
    flex: 1,
    color: COURSE_EXERCISE_COLORS.inkSoft,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 13,
    lineHeight: 18,
  },
});
