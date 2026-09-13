import React from "react";
import { LayoutAnimation, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
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

// ponytail: personal discovery exercise reveals explanation directly under selected symptom
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

  const chooseOption = (optionId: string) => {
    if (locked) {
      return;
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
        title={readString(content.title) ?? "Decoding body alarms"}
        instruction={
          readString(content.instruction) ??
          "Tap the symptom that feels most familiar."
        }
      />

      <View style={styles.options}>
        {options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const bodyParagraphs = (option.body ?? "")
            .split("\n\n")
            .map((p) => p.trim())
            .filter(Boolean);

          return (
            <View key={option.id} style={styles.optionGroup}>
              <CourseExerciseOptionButton
                label={option.label}
                selected={isSelected}
                disabled={locked}
                indicatorPosition="trailing"
                showSelectionCheckmark
                onPress={() => chooseOption(option.id)}
              />

              {isSelected ? (
                <View style={styles.reveal}>
                  <Text style={styles.revealTitle}>
                    {option.detail ?? "YOUR BODY’S ALARM RESPONSE"}
                  </Text>
                  {bodyParagraphs.map((paragraph, index) => (
                    <Text
                      key={index}
                      style={[
                        styles.revealBody,
                        index > 0 ? styles.revealParagraphGap : undefined,
                      ]}
                    >
                      {paragraph}
                    </Text>
                  ))}
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      <View style={styles.privateNote}>
        <Feather name="lock" size={13} color={SEMANTIC_COLORS.text.secondary} />
        <Text style={styles.privateNoteText}>
          Your choice helps tailor what comes next.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 0,
    paddingBottom: 8,
  },
  options: {
    gap: 8,
    marginTop: 0,
  },
  optionGroup: {
    gap: 6,
  },
  reveal: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: "#D9E5D5",
    borderRadius: 18,
    backgroundColor: "#F2F8EF",
  },
  revealTitle: {
    color: "#2D4F35",
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  revealBody: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 14,
    lineHeight: 20,
  },
  revealParagraphGap: {
    marginTop: 7,
  },
  privateNote: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 4,
  },
  privateNoteText: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 13,
    lineHeight: 18,
  },
});
