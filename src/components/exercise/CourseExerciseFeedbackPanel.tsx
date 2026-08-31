import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS,
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
    borderWidth: 0,
    borderRadius: 24,
    paddingHorizontal: 17,
    paddingVertical: 15,
  },
  success: {
    borderColor: SEMANTIC_COLORS.success.primary,
    backgroundColor: SEMANTIC_COLORS.success.soft,
  },
  retry: {
    borderColor: SEMANTIC_COLORS.error.primary,
    backgroundColor: SEMANTIC_COLORS.error.soft,
  },
  review: {
    borderColor: SEMANTIC_COLORS.border.default,
    backgroundColor: SEMANTIC_COLORS.surface.secondary,
  },
  title: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 17,
    lineHeight: 22,
  },
  titleRow: { flexDirection: "row", alignItems: "flex-start", gap: 11 },
  feedbackCopy: { flex: 1 },
  successIcon: {
    width: 19,
    height: 19,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9.5,
    backgroundColor: SEMANTIC_COLORS.success.primary,
  },
  successIconLabel: {
    color: SEMANTIC_COLORS.text.inverse,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 9.5,
  },
  kicker: {
    marginBottom: 5,
    color: SEMANTIC_COLORS.brand.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 11,
    letterSpacing: 1,
  },
  body: {
    marginTop: 5,
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 17,
    lineHeight: 24,
  },
  takeaway: {
    marginTop: 9,
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 15,
    lineHeight: 20,
  },
  takeawayLabel: { fontFamily: COURSE_EXERCISE_FONTS.bodyBold },
});
