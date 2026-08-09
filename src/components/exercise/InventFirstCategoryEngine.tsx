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

interface InventCase {
  id: string;
  name: string;
  reading: string;
  outcome: string;
  isCalm: boolean;
}

export function InventFirstCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const cases = readCases(content.cases);
  const options = readCourseExerciseOptions(content.options);
  const selectedOptionId = readString(
    readRecord(savedResponse)?.selectedOptionId,
  );
  const selectedOption = options.find((option) => option.id === selectedOptionId);

  const selectOption = (optionId: string) => {
    if (locked) return;
    const option = options.find((item) => item.id === optionId);
    const isCorrect = option?.isCorrect === true;
    Haptics.selectionAsync();
    onInteraction(
      {
        format: CourseExerciseCategoryEnum.InventFirst,
        selectedOptionId: optionId,
        isCorrect,
      },
      isCorrect,
      isCorrect ? { revealImmediately: true } : undefined,
    );
  };

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "Invent the rule"}
        instruction={readString(content.instruction) ?? "Choose the rule that fits."}
      />

      <View style={styles.caseList}>
        {cases.map((item, index) => (
          <View key={item.id} style={styles.caseCard}>
            <View style={[styles.avatar, index === 1 && styles.avatarOlive, index === 2 && styles.avatarNeutral]}>
              <Text style={styles.avatarLabel}>{item.name.charAt(0)}</Text>
            </View>
            <Text style={styles.caseReading}>
              <Text style={styles.caseName}>{item.name} </Text>
              {item.reading}
            </Text>
            <Text style={[styles.outcome, item.isCalm && styles.outcomeCalm]}>
              {item.outcome}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.options}>
        {options.map((option) => (
          <CourseExerciseOptionButton
            key={option.id}
            label={option.label}
            selected={selectedOptionId === option.id}
            showConfirmationIcon={false}
            disabled={locked}
            onPress={() => selectOption(option.id)}
          />
        ))}
      </View>

      {selectedOption?.feedback ? (
        <Text style={styles.coach}>{selectedOption.feedback}</Text>
      ) : null}

      {locked ? (
        <View style={styles.reveal}>
          <Text style={styles.revealTitle}>{readString(content.rule)}</Text>
          <Text style={styles.revealBody}>{readString(content.body)}</Text>
          <Text style={styles.revealNext}>{readString(content.next)}</Text>
        </View>
      ) : null}

    </View>
  );
}

function readCases(value: unknown): InventCase[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((caseValue, index) => {
    const item = readRecord(caseValue);
    const name = readString(item?.name);
    const reading = readString(item?.reading);
    const outcome = readString(item?.outcome);
    return name && reading && outcome
      ? [{ id: readString(item?.id) ?? `case-${index}`, name, reading, outcome, isCalm: item?.isCalm === true }]
      : [];
  });
}

const styles = StyleSheet.create({
  screenContent: { flex: 1, paddingHorizontal: 8, paddingTop: 6, paddingBottom: 12 },
  caseList: { gap: 8, marginBottom: 12 },
  caseCard: { flexDirection: "row", alignItems: "center", gap: 11, paddingHorizontal: 14, paddingVertical: 11, borderRadius: 20, backgroundColor: COURSE_EXERCISE_COLORS.surface, shadowColor: COURSE_EXERCISE_COLORS.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.09, shadowRadius: 4 },
  avatar: { width: 38, height: 38, alignItems: "center", justifyContent: "center", borderRadius: 19, backgroundColor: COURSE_EXERCISE_COLORS.accentTint },
  avatarOlive: { backgroundColor: COURSE_EXERCISE_COLORS.accentLight },
  avatarNeutral: { backgroundColor: COURSE_EXERCISE_COLORS.surfaceMuted },
  avatarLabel: { color: COURSE_EXERCISE_COLORS.ink, fontFamily: COURSE_EXERCISE_FONTS.heading, fontSize: 17 },
  caseReading: { flex: 1, color: COURSE_EXERCISE_COLORS.inkSoft, fontFamily: COURSE_EXERCISE_FONTS.body, fontSize: 13, lineHeight: 19 },
  caseName: { color: COURSE_EXERCISE_COLORS.ink, fontFamily: COURSE_EXERCISE_FONTS.bodyBold },
  outcome: { width: 88, color: COURSE_EXERCISE_COLORS.accent, fontFamily: COURSE_EXERCISE_FONTS.bodyBold, fontSize: 11.5, lineHeight: 16, textAlign: "right" },
  outcomeCalm: { color: COURSE_EXERCISE_COLORS.accentDark },
  options: { gap: 10 },
  coach: { marginHorizontal: 2, marginTop: 12, color: COURSE_EXERCISE_COLORS.inkSoft, fontFamily: COURSE_EXERCISE_FONTS.body, fontSize: 13, fontStyle: "italic", lineHeight: 20 },
  reveal: { marginTop: 12, gap: 8, paddingHorizontal: 22, paddingVertical: 20, borderRadius: 28, backgroundColor: COURSE_EXERCISE_COLORS.surface, shadowColor: COURSE_EXERCISE_COLORS.shadow, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.14, shadowRadius: 8 },
  revealTitle: { color: COURSE_EXERCISE_COLORS.accentDark, fontFamily: COURSE_EXERCISE_FONTS.heading, fontSize: 20, lineHeight: 26 },
  revealBody: { color: COURSE_EXERCISE_COLORS.ink, fontFamily: COURSE_EXERCISE_FONTS.body, fontSize: 14, lineHeight: 22 },
  revealNext: { color: COURSE_EXERCISE_COLORS.accentDark, fontFamily: COURSE_EXERCISE_FONTS.bodyBold, fontSize: 13, lineHeight: 19 },
});
