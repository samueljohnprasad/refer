import React, { type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";

interface ActivePromptProps {
  prompt: string;
  context?: string;
  children?: ReactNode;
}

export function ActivePrompt({ prompt, context, children }: ActivePromptProps) {
  return (
    <View style={styles.container}>
      {context ? <Text style={styles.context}>{context}</Text> : null}
      <Text accessibilityRole="header" style={styles.prompt}>
        {prompt}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  context: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 15,
    lineHeight: 22,
  },
  prompt: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 24,
    lineHeight: 30,
  },
});
