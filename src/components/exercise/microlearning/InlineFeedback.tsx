import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
} from "@/src/components/exercise/courseExerciseTheme";

interface InlineFeedbackProps {
  message: string | null;
  title?: string;
  tone?: "neutral" | "supported" | "unsupported";
}

export function InlineFeedback({
  message,
  title,
  tone = "neutral",
}: InlineFeedbackProps) {
  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="summary"
      style={[styles.region, message ? toneStyles[tone] : null]}
    >
      {message ? (
        <>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          <Text style={styles.message}>{message}</Text>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  region: {
    minHeight: 72,
    justifyContent: "center",
    gap: 4,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 13,
  },
  message: {
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 15,
    lineHeight: 21,
  },
});

const toneStyles = StyleSheet.create({
  neutral: { backgroundColor: COURSE_EXERCISE_COLORS.surfaceMuted },
  supported: { backgroundColor: COURSE_EXERCISE_COLORS.accentTint },
  unsupported: { backgroundColor: COURSE_EXERCISE_COLORS.errorTint },
});
