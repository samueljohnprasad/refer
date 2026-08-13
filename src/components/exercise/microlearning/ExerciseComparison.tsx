import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
} from "@/src/components/exercise/courseExerciseTheme";

interface ComparisonSide {
  label: string;
  value: string;
}

interface ExerciseComparisonProps {
  before: ComparisonSide;
  after: ComparisonSide;
  caption?: string;
}

export function ExerciseComparison({
  before,
  after,
  caption,
}: ExerciseComparisonProps) {
  return (
    <View style={styles.container}>
      <ComparisonRow side={before} muted />
      <View style={styles.divider} />
      <ComparisonRow side={after} />
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

function ComparisonRow({ side, muted = false }: { side: ComparisonSide; muted?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{side.label}</Text>
      <Text style={[styles.value, muted && styles.muted]}>{side.value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    borderRadius: 18,
    padding: 18,
    backgroundColor: COURSE_EXERCISE_COLORS.surfaceMuted,
  },
  row: { gap: 5 },
  label: {
    color: COURSE_EXERCISE_COLORS.inkSoft,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 12,
  },
  value: {
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 20,
    lineHeight: 26,
  },
  muted: { color: COURSE_EXERCISE_COLORS.inkSoft },
  divider: { height: 1, backgroundColor: COURSE_EXERCISE_COLORS.border },
  caption: {
    color: COURSE_EXERCISE_COLORS.inkSoft,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 14,
    lineHeight: 20,
  },
});
