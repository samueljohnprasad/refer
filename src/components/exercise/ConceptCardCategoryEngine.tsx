import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
} from "@/src/components/exercise/courseExerciseTheme";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function ConceptCardCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const variant = readString(content.variant) ?? "myth";

  useEffect(() => {
    if (!saved) {
      onInteraction(
        {
          format: CourseExerciseCategoryEnum.ConceptCard,
          phase: "read",
          variant,
          isCorrect: true,
        },
        true,
      );
    }
  }, [onInteraction, saved, variant]);

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "One idea to keep"}
        instruction={readString(content.instruction)}
      />

      {variant === "myth" ? (
        <MythCard
          myth={readString(content.myth)}
          reality={readString(content.reality)}
        />
      ) : (
        <RuleCard
          rule={readString(content.rule)}
          explanation={readString(content.explanation)}
        />
      )}

      {readString(content.note) ? (
        <Text style={styles.note}>{readString(content.note)}</Text>
      ) : null}
    </View>
  );
}

function MythCard({
  myth,
  reality,
}: {
  myth: string | null;
  reality: string | null;
}) {
  return (
    <View style={styles.mythStack}>
      <View style={styles.mythPanel}>
        <Text style={styles.neutralKicker}>THE MYTH</Text>
        <Text style={styles.mythText}>{myth}</Text>
      </View>
      <View style={styles.realityPanel}>
        <Text style={styles.oliveKicker}>THE REALITY</Text>
        <Text style={styles.realityText}>{reality}</Text>
      </View>
    </View>
  );
}

function RuleCard({
  rule,
  explanation,
}: {
  rule: string | null;
  explanation: string | null;
}) {
  return (
    <View style={styles.rulePanel}>
      <Text style={styles.ruleText}>{rule}</Text>
      <Text style={styles.explanation}>{explanation}</Text>
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
  mythStack: { gap: 12 },
  mythPanel: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: COURSE_EXERCISE_COLORS.border,
    borderRadius: 16,
    borderCurve: "continuous",
    backgroundColor: COURSE_EXERCISE_COLORS.surface,
  },
  realityPanel: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: COURSE_EXERCISE_COLORS.accent,
    borderRadius: 16,
    borderCurve: "continuous",
    backgroundColor: COURSE_EXERCISE_COLORS.accentTint,
  },
  neutralKicker: {
    marginBottom: 6,
    color: COURSE_EXERCISE_COLORS.inkSoft,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 11,
    letterSpacing: 0.45,
  },
  oliveKicker: {
    marginBottom: 6,
    color: COURSE_EXERCISE_COLORS.accentDark,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 11,
    letterSpacing: 0.45,
  },
  mythText: {
    color: COURSE_EXERCISE_COLORS.inkSoft,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 17,
    lineHeight: 24,
    textDecorationColor: COURSE_EXERCISE_COLORS.accent,
    textDecorationLine: "line-through",
  },
  realityText: {
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 17,
    lineHeight: 24,
  },
  rulePanel: {
    gap: 12,
    paddingHorizontal: 22,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: COURSE_EXERCISE_COLORS.border,
    borderRadius: 16,
    borderCurve: "continuous",
    backgroundColor: COURSE_EXERCISE_COLORS.surface,
  },
  ruleText: {
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 23,
    lineHeight: 28,
  },
  explanation: {
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 17,
    lineHeight: 24,
  },
  note: {
    marginTop: 14,
    color: COURSE_EXERCISE_COLORS.inkSoft,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});
