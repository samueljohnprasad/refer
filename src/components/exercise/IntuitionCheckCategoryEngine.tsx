import React from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { CourseExerciseOptionButton } from "@/src/components/exercise/CourseExerciseOptionButton";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS,
} from "@/src/components/exercise/courseExerciseTheme";
import {
  readCourseExerciseOptions,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function IntuitionCheckCategoryEngine({
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
  const bestOptionId = readString(content.bestOptionId);
  const revealText =
    selectedOptionId === bestOptionId
      ? readString(content.reveal)
      : readString(content.alternateReveal);

  const chooseOption = (optionId: string) => {
    if (locked) {
      return;
    }

    Haptics.selectionAsync();
    onInteraction(
      {
        format: CourseExerciseCategoryEnum.IntuitionCheck,
        selectedOptionId: optionId,
        isCorrect: true,
      },
      true,
    );
  };

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "What does your gut say?"}
        instruction={readString(content.instruction)}
        prompt={readString(content.prompt)}
      />

      <View style={styles.options}>
        {options.map((option) => (
          <CourseExerciseOptionButton
            key={option.id}
            label={option.label}
            selected={selectedOptionId === option.id}
            align="center"
            showConfirmationIcon={false}
            disabled={locked}
            onPress={() => chooseOption(option.id)}
          />
        ))}
      </View>

      {selectedOptionId ? (
        <View style={styles.reveal}>
          <View style={styles.revealIcon}>
            <Text style={styles.revealIconLabel}>✓</Text>
          </View>
          <View style={styles.revealCopy}>
            {readString(content.revealTitle) && (
              <Text style={styles.revealTitle}>
                {readString(content.revealTitle)}
              </Text>
            )}
            <Text style={styles.revealBody}>{revealText}</Text>
          </View>
        </View>
      ) : null}
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
    marginTop: 6,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    paddingHorizontal: 17,
    paddingVertical: 15,
    borderWidth: 0,
    borderRadius: 24,
    backgroundColor: SEMANTIC_COLORS.success.soft,
  },
  revealIcon: {
    width: 19,
    height: 19,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9.5,
    backgroundColor: SEMANTIC_COLORS.success.primary,
  },
  revealIconLabel: {
    color: SEMANTIC_COLORS.text.inverse,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 9.5,
  },
  revealCopy: { flex: 1 },
  revealTitle: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 17,
    lineHeight: 22,
  },
  revealBody: {
    marginTop: 5,
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 17,
    lineHeight: 24,
  },
  note: {
    marginTop: 14,
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 12.5,
    textAlign: "center",
  },
});
