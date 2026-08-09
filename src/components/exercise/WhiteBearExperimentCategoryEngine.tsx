import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { CourseExerciseOptionButton } from "@/src/components/exercise/CourseExerciseOptionButton";
import {
  readCourseExerciseOptions,
  readNumber,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
} from "@/src/components/exercise/courseExerciseTheme";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function WhiteBearExperimentCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const started = saved?.started === true;
  const secondsRemaining = readNumber(saved?.secondsRemaining) ?? 10;
  const selectedOptionId = readString(saved?.selectedOptionId);
  const options = readCourseExerciseOptions(content.options);
  const counting = started && secondsRemaining > 0;
  const ended = started && secondsRemaining <= 0;
  const bearIsPeeking = counting && [7, 4, 2].includes(secondsRemaining);

  useEffect(() => {
    if (!saved) {
      onInteraction(createResponse(), true);
    }
  }, [onInteraction, saved]);

  useEffect(() => {
    if (!counting) return;
    const timer = setTimeout(() => {
      onInteraction(
        createResponse({
          ...saved,
          started: true,
          secondsRemaining: secondsRemaining - 1,
        }),
        false,
      );
    }, 1000);
    return () => clearTimeout(timer);
  }, [counting, onInteraction, saved, secondsRemaining]);

  const selectOption = (optionId: string) => {
    if (locked) return;
    Haptics.selectionAsync();
    onInteraction(
      createResponse({
        ...saved,
        selectedOptionId: optionId,
        started: true,
        secondsRemaining: 0,
      }),
      true,
    );
  };

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "A 10-second experiment"}
        instruction={
          readString(content.instruction) ?? "Do not think about a white bear."
        }
      />
      <View style={styles.countdownCard}>
        <Text style={styles.countdown}>
          {!started ? "10" : counting ? secondsRemaining : "✓"}
        </Text>
        <View
          style={[
            styles.bearPill,
            bearIsPeeking ? styles.bearVisible : styles.bearHidden,
          ]}
        >
          <Text style={styles.bearLabel}>“white bear”</Text>
        </View>
      </View>

      {ended ? (
        <View style={styles.debrief}>
          <Text style={styles.debriefLabel}>SO… WHAT HAPPENED?</Text>
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
      ) : null}

      {ended && selectedOptionId ? (
        <View style={styles.revealCard}>
          <Text style={styles.rule}>{readString(content.rule)}</Text>
          <Text style={styles.body}>{readString(content.body)}</Text>
          <Text style={styles.fix}>{readString(content.fix)}</Text>
        </View>
      ) : null}
    </View>
  );
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.WhiteBearExperiment,
    phase: "experiment",
    started: false,
    secondsRemaining: 10,
    isCorrect: true,
    ...extra,
  };
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 12,
  },
  countdownCard: {
    alignItems: "center",
    gap: 11,
    paddingHorizontal: 22,
    paddingVertical: 24,
    borderRadius: 28,
    backgroundColor: COURSE_EXERCISE_COLORS.surface,
    shadowColor: COURSE_EXERCISE_COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 7,
  },
  countdown: {
    color: COURSE_EXERCISE_COLORS.accentDark,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 44,
    lineHeight: 50,
  },
  bearPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: COURSE_EXERCISE_COLORS.accentLight,
    borderRadius: 18,
    backgroundColor: COURSE_EXERCISE_COLORS.accentTint,
  },
  bearVisible: { opacity: 1 },
  bearHidden: { opacity: 0.15 },
  bearLabel: {
    color: COURSE_EXERCISE_COLORS.accentDark,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 13.5,
    fontStyle: "italic",
  },
  debrief: { gap: 9, marginTop: 14 },
  debriefLabel: {
    marginBottom: -1,
    color: COURSE_EXERCISE_COLORS.inkSoft,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 10.5,
    letterSpacing: 0.65,
  },
  revealCard: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 19,
    borderRadius: 28,
    backgroundColor: COURSE_EXERCISE_COLORS.surface,
    shadowColor: COURSE_EXERCISE_COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 7,
  },
  rule: {
    color: COURSE_EXERCISE_COLORS.accentDark,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 20,
    lineHeight: 25,
  },
  body: {
    marginTop: 7,
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 14,
    lineHeight: 22,
  },
  fix: {
    marginTop: 9,
    color: COURSE_EXERCISE_COLORS.accentDark,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 13,
    lineHeight: 20,
  },
});
