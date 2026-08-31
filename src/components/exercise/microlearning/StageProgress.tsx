import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";

interface StageProgressProps {
  stageIndex: number;
  stageCount: number;
  label?: string;
}

export function StageProgress({ stageIndex, stageCount, label }: StageProgressProps) {
  const count = Math.max(stageCount, 1);
  const current = Math.max(0, Math.min(stageIndex, count - 1)) + 1;
  const text = `${label ?? "Step"} ${current} of ${count}`;
  return (
    <View accessible accessibilityLabel={text} style={styles.container}>
      <Text style={styles.label}>{text}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${(current / count) * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 7 },
  label: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 12,
  },
  track: {
    height: 6,
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: SEMANTIC_COLORS.surface.secondary,
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: SEMANTIC_COLORS.brand.primary,
  },
});
