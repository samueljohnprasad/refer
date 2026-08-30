import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
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
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.display,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.35,
  },
  instruction: {
    marginTop: 3,
    color: COURSE_EXERCISE_COLORS.inkSoft,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 15,
    lineHeight: 21,
  },
  prompt: {
    marginTop: 15,
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 17,
    lineHeight: 24,
  },
});
