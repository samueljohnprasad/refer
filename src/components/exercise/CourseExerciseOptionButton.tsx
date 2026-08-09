import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
} from "@/src/components/exercise/courseExerciseTheme";

interface CourseExerciseOptionButtonProps {
  label: string;
  selected: boolean;
  disabled?: boolean;
  align?: "left" | "center";
  showConfirmationIcon?: boolean;
  onPress: () => void;
}

export function CourseExerciseOptionButton({
  label,
  selected,
  disabled = false,
  align = "left",
  showConfirmationIcon = true,
  onPress,
}: CourseExerciseOptionButtonProps) {
  const isConfirmed = selected && disabled && showConfirmationIcon;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        selected && styles.selected,
        isConfirmed && styles.confirmed,
        disabled && !selected && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {isConfirmed ? (
        <View style={styles.checkCircle}>
          <Text style={styles.checkLabel}>✓</Text>
        </View>
      ) : null}
      <Text style={[styles.label, { textAlign: align }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    justifyContent: "center",
    paddingHorizontal: 17,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COURSE_EXERCISE_COLORS.border,
    borderBottomWidth: 4,
    backgroundColor: COURSE_EXERCISE_COLORS.surface,
  },
  selected: {
    borderColor: COURSE_EXERCISE_COLORS.accent,
    backgroundColor: COURSE_EXERCISE_COLORS.accentTint,
  },
  confirmed: {
    borderColor: COURSE_EXERCISE_COLORS.accent,
    backgroundColor: COURSE_EXERCISE_COLORS.accentTint,
  },
  disabled: { borderBottomWidth: 1, opacity: 0.55 },
  pressed: { transform: [{ translateY: 2 }], borderBottomWidth: 2 },
  label: {
    flex: 1,
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 15,
    lineHeight: 21,
  },
  checkCircle: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: COURSE_EXERCISE_COLORS.accent,
  },
  checkLabel: {
    color: COURSE_EXERCISE_COLORS.surface,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 14,
  },
});
