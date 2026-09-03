import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS,
} from "@/src/components/exercise/courseExerciseTheme";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function OneLineRevealCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const revealed = saved?.revealed === true;

  useEffect(() => {
    if (!saved) {
      onInteraction(
        {
          format: CourseExerciseCategoryEnum.OneLineReveal,
          phase: "reveal",
          revealed: false,
          isCorrect: true,
        },
        true,
      );
    }
  }, [onInteraction, saved]);

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "One idea"}
        instruction={readString(content.instruction) ?? "Tap to reveal."}
      />
      <View style={styles.ideaCard}>
        <Text style={styles.firstLine}>{readString(content.firstLine)}</Text>
        {revealed ? (
          <Text style={styles.secondLine}>
            {readString(content.secondLine)}
          </Text>
        ) : null}
      </View>
      
      {revealed && readString(content.why) ? (
        <View style={styles.whyCard}>
          <View style={styles.checkCircle}>
            <Text style={styles.check}>✓</Text>
          </View>
          <View style={styles.whyCopy}>
            <Text style={styles.whyTitle}>
              {readString(content.whyTitle) ?? "Why it matters"}
            </Text>
            <Text style={styles.whyBody}>{readString(content.why)}</Text>
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
  ideaCard: {
    minHeight: 240,
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 26,
    paddingVertical: 30,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: SEMANTIC_COLORS.border.strong,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
  },
  firstLine: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 24,
    lineHeight: 31,
  },
  secondLine: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 24,
    lineHeight: 31,
  },
  whyCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    marginTop: 16,
    paddingHorizontal: 17,
    paddingVertical: 15,
    borderWidth: 1.5,
    borderColor: SEMANTIC_COLORS.brand.primary,
    borderRadius: 24,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },
  checkCircle: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: SEMANTIC_COLORS.brand.primary,
  },
  check: {
    color: SEMANTIC_COLORS.surface.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 14,
  },
  whyCopy: { flex: 1 },
  whyTitle: {
    color: SEMANTIC_COLORS.brand.pressed,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 16,
    lineHeight: 20,
  },
  whyBody: {
    marginTop: 7,
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 13.5,
    lineHeight: 20,
  },
});
