import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
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
      />

      {variant === "myth" ? (
        <MythCard
          myth={readString(content.myth)}
          reality={readString(content.reality)}
          note={readString(content.note)}
        />
      ) : (
        <RuleCard
          rule={readString(content.rule)}
          explanation={readString(content.explanation)}
          note={readString(content.note)}
        />
      )}
    </View>
  );
}

function MythCard({
  myth,
  reality,
  note,
}: {
  myth: string | null;
  reality: string | null;
  note?: string | null;
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
        {note ? <Text style={styles.note}>{note}</Text> : null}
      </View>
    </View>
  );
}

function RuleCard({
  rule,
  explanation,
  note,
}: {
  rule: string | null;
  explanation: string | null;
  note?: string | null;
}) {
  return (
    <View style={styles.rulePanel}>
      <Text style={styles.ruleText}>{rule}</Text>
      <Text style={styles.explanation}>{explanation}</Text>
      {note ? <Text style={styles.note}>{note}</Text> : null}
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
    borderColor: SEMANTIC_COLORS.border.default,
    borderRadius: 16,
    borderCurve: "continuous",
    backgroundColor: SEMANTIC_COLORS.surface.primary,
  },
  realityPanel: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    borderCurve: "continuous",
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },
  neutralKicker: {
    marginBottom: 6,
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 11,
    letterSpacing: 0.45,
  },
  oliveKicker: {
    marginBottom: 6,
    color: SEMANTIC_COLORS.brand.pressed,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 11,
    letterSpacing: 0.45,
  },
  mythText: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 17,
    lineHeight: 24,
    textDecorationColor: SEMANTIC_COLORS.brand.primary,
    textDecorationLine: "line-through",
  },
  realityText: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 17,
    lineHeight: 24,
  },
  rulePanel: {
    gap: 12,
    paddingHorizontal: 22,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: SEMANTIC_COLORS.border.default,
    borderRadius: 16,
    borderCurve: "continuous",
    backgroundColor: SEMANTIC_COLORS.surface.primary,
  },
  ruleText: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 23,
    lineHeight: 28,
  },
  explanation: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 17,
    lineHeight: 24,
  },
  note: {
    marginTop: 12,
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 15,
    lineHeight: 21,
  },
});
