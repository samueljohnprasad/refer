import React, { type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
} from "@/src/components/exercise/courseExerciseTheme";

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
    color: COURSE_EXERCISE_COLORS.inkSoft,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 15,
    lineHeight: 22,
  },
  prompt: {
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 24,
    lineHeight: 30,
  },
});
