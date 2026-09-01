import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS,
} from "@/src/components/exercise/courseExerciseTheme";

interface CourseExerciseHeadingProps {
  title: string;
  instruction?: string | null;
  prompt?: string | null;
}

export function CourseExerciseHeading({
  title,
  instruction,
  prompt,
}: CourseExerciseHeadingProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {instruction ? (
        <Text style={styles.instruction}>{instruction}</Text>
      ) : null}
      {prompt ? <Text style={styles.prompt}>{prompt}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 14 },
  title: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.display,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.4,
  },
  instruction: {
    marginTop: 3,
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 15,
    lineHeight: 21,
  },
  prompt: {
    marginTop: 12,
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 21,
    lineHeight: 27,
  },
});
