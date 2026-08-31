import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CourseExercisePrimaryButton } from "@/src/components/exercise/CourseExerciseShell";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";

interface CourseExerciseFooterProps {
  hidePrimary: boolean;
  primaryDisabled: boolean;
  primaryLoading: boolean;
  primaryLabel: string;
  onPrimaryPress: () => void;
  onSkip?: () => void;
}

export function CourseExerciseFooter({
  hidePrimary,
  primaryDisabled,
  primaryLoading,
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
          loading={primaryLoading}
          onPress={onPrimaryPress}
        />
      ) : null}
      {onSkip ? (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: primaryLoading }}
          disabled={primaryLoading}
          onPress={onSkip}
          style={({ pressed }) => [
            styles.skipButton,
            primaryLoading && styles.disabledSkip,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.skipLabel}>Skip for now</Text>
        </Pressable>
      ) : null}
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
    backgroundColor: SEMANTIC_COLORS.surface.primary,
  },
  skipButton: { minHeight: 48, alignItems: "center", justifyContent: "center" },
  skipLabel: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 13,
  },
  disabledSkip: { opacity: 0.45 },
  pressed: { opacity: 0.55 },
});
