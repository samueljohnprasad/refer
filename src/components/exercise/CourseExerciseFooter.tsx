import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CourseExercisePrimaryButton } from "@/src/components/exercise/CourseExerciseShell";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
} from "@/src/components/exercise/courseExerciseTheme";

interface CourseExerciseFooterProps {
  hidePrimary: boolean;
  primaryDisabled: boolean;
  primaryLabel: string;
  onPrimaryPress: () => void;
  onSkip: () => void;
}

export function CourseExerciseFooter({
  hidePrimary,
  primaryDisabled,
  primaryLabel,
  onPrimaryPress,
  onSkip,
}: CourseExerciseFooterProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}
    >
      {!hidePrimary ? (
        <CourseExercisePrimaryButton
          label={primaryLabel}
          disabled={primaryDisabled}
          onPress={onPrimaryPress}
        />
      ) : null}
      <Pressable
        accessibilityRole="button"
        onPress={onSkip}
        style={({ pressed }) => [styles.skipButton, pressed && styles.pressed]}
      >
        <Text style={styles.skipLabel}>Skip for now</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    gap: 2,
    paddingHorizontal: 24,
    paddingTop: 14,
    backgroundColor: COURSE_EXERCISE_COLORS.background,
  },
  skipButton: { minHeight: 44, alignItems: "center", justifyContent: "center" },
  skipLabel: {
    color: COURSE_EXERCISE_COLORS.orange,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 14,
  },
  pressed: { opacity: 0.55 },
});
