import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";

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
    backgroundColor: SEMANTIC_COLORS.surface.secondary,
  },
  row: { gap: 5 },
  label: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 12,
  },
  value: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 20,
    lineHeight: 26,
  },
  muted: { color: SEMANTIC_COLORS.text.secondary },
  divider: { height: 1, backgroundColor: SEMANTIC_COLORS.border.default },
  caption: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 14,
    lineHeight: 20,
  },
});
