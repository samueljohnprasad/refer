import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS,
} from "@/src/components/exercise/courseExerciseTheme";

interface CourseExerciseOptionButtonProps {
  label: string;
  selected: boolean;
  disabled?: boolean;
  align?: "left" | "center";
  showConfirmationIcon?: boolean;
  result?: "correct" | "incorrect";
  onPress: () => void;
}

export function CourseExerciseOptionButton({
  label,
  selected,
  disabled = false,
  align = "left",
  showConfirmationIcon = true,
  result,
  onPress,
}: CourseExerciseOptionButtonProps) {
  const isConfirmed = selected && disabled && showConfirmationIcon;
  const isCorrect = selected && result === "correct";
  const isIncorrect = selected && result === "incorrect";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        selected && styles.selected,
        (isConfirmed || isCorrect) && styles.confirmed,
        isIncorrect && styles.incorrect,
        disabled && !selected && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {isConfirmed || isCorrect || isIncorrect ? (
        <View style={[styles.checkCircle, isIncorrect && styles.errorCircle]}>
          <Text style={styles.checkLabel}>{isIncorrect ? "✕" : "✓"}</Text>
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
    borderColor: SEMANTIC_COLORS.border.default,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
  },
  selected: {
    borderColor: SEMANTIC_COLORS.border.selected,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },
  confirmed: {
    borderColor: SEMANTIC_COLORS.success.primary,
    backgroundColor: SEMANTIC_COLORS.success.soft,
  },
  incorrect: {
    borderColor: SEMANTIC_COLORS.error.primary,
    backgroundColor: SEMANTIC_COLORS.error.soft,
  },
  disabled: { opacity: 0.9 },
  pressed: { opacity: 0.8 },
  label: {
    flex: 1,
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 18,
    lineHeight: 24,
  },
  checkCircle: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: SEMANTIC_COLORS.success.primary,
  },
  errorCircle: { backgroundColor: SEMANTIC_COLORS.error.primary },
  checkLabel: {
    color: SEMANTIC_COLORS.text.inverse,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 14,
  },
});
