import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
} from "@/src/components/exercise/courseExerciseTheme";
import {
  V1CheckStatusEnum,
  type V1CheckStatus,
} from "@/src/types/journeyLearning";

interface CourseExerciseFeedbackPanelProps {
  canContinueAfterExplanation: boolean;
  checkStatus: V1CheckStatus;
  explanationText: string | null;
  feedbackText: string | null;
  successTitle?: string | null;
  successTakeaway?: string | null;
}

export function CourseExerciseFeedbackPanel({
  canContinueAfterExplanation,
  checkStatus,
  explanationText,
  feedbackText,
  successTitle,
  successTakeaway,
}: CourseExerciseFeedbackPanelProps) {
  if (!feedbackText && !explanationText) {
    return null;
  }

  const isSuccess = checkStatus === V1CheckStatusEnum.Success;
  const helperText =
    !isSuccess && canContinueAfterExplanation ? explanationText : null;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.panel, isSuccess ? styles.success : styles.retry]}>
        <View style={styles.titleRow}>
          {isSuccess ? (
            <View style={styles.successIcon}>
              <Text style={styles.successIconLabel}>✓</Text>
            </View>
          ) : null}
          <View style={styles.feedbackCopy}>
            <Text style={styles.title}>
              {isSuccess ? (successTitle ?? "Nice.") : "Try another way."}
            </Text>
            {feedbackText ? (
              <Text style={styles.body}>{feedbackText}</Text>
            ) : null}
            {isSuccess && successTakeaway ? (
              <Text style={styles.takeaway}>
                <Text style={styles.takeawayLabel}>New capability: </Text>
                {successTakeaway}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
      {helperText ? (
        <View style={[styles.panel, styles.review]}>
          <Text style={styles.kicker}>REVIEW THIS</Text>
          <Text style={styles.body}>{helperText}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 10, paddingHorizontal: 8, paddingBottom: 12 },
  panel: {
    borderWidth: 1.5,
    borderRadius: 24,
    paddingHorizontal: 17,
    paddingVertical: 15,
  },
  success: {
    borderColor: COURSE_EXERCISE_COLORS.accent,
    backgroundColor: COURSE_EXERCISE_COLORS.accentTint,
  },
  retry: {
    borderColor: COURSE_EXERCISE_COLORS.error,
    backgroundColor: COURSE_EXERCISE_COLORS.errorTint,
  },
  review: {
    borderColor: COURSE_EXERCISE_COLORS.border,
    backgroundColor: COURSE_EXERCISE_COLORS.surface,
  },
  title: {
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 16,
    lineHeight: 20,
  },
  titleRow: { flexDirection: "row", alignItems: "flex-start", gap: 11 },
  feedbackCopy: { flex: 1 },
  successIcon: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: COURSE_EXERCISE_COLORS.accent,
  },
  successIconLabel: {
    color: COURSE_EXERCISE_COLORS.surface,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 14,
  },
  kicker: {
    marginBottom: 5,
    color: COURSE_EXERCISE_COLORS.accent,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 11,
    letterSpacing: 1,
  },
  body: {
    marginTop: 7,
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 13.5,
    lineHeight: 20,
  },
  takeaway: {
    marginTop: 9,
    color: COURSE_EXERCISE_COLORS.accentDark,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
  },
  takeawayLabel: { fontFamily: COURSE_EXERCISE_FONTS.bodyBold },
});
