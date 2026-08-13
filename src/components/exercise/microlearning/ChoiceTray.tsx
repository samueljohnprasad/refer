import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
} from "@/src/components/exercise/courseExerciseTheme";
import type {
  ChoiceVisualState,
  MicrolearningChoice,
} from "./microlearningTypes";

interface ChoiceTrayProps {
  choices: readonly MicrolearningChoice[];
  states?: Readonly<Partial<Record<string, ChoiceVisualState>>>;
  selectedId?: string | null;
  disabled?: boolean;
  onSelect: (id: string) => void;
}

export function ChoiceTray({
  choices,
  states = {},
  selectedId = null,
  disabled = false,
  onSelect,
}: ChoiceTrayProps) {
  return (
    <View accessibilityRole="radiogroup" style={styles.tray}>
      {choices.map((choice) => {
        const isSelected = choice.id === selectedId;
        const state = disabled
          ? "disabled"
          : (states[choice.id] ?? (isSelected ? "selected" : "idle"));
        const isDisabled =
          state === "disabled" ||
          state === "supported" ||
          state === "unsupported";
        return (
          <Pressable
            key={choice.id}
            accessibilityHint={choice.accessibilityHint}
            accessibilityRole="radio"
            accessibilityState={{ disabled: isDisabled, selected: isSelected }}
            disabled={isDisabled}
            onPress={() => onSelect(choice.id)}
            style={({ pressed }) => [
              styles.choice,
              choiceStyles[state],
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.label, labelStyles[state]]}>{choice.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tray: { gap: 10 },
  choice: {
    minHeight: 48,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COURSE_EXERCISE_COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COURSE_EXERCISE_COLORS.background,
  },
  label: {
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 16,
    lineHeight: 22,
  },
  pressed: { opacity: 0.7 },
});

const choiceStyles = StyleSheet.create({
  idle: {},
  selected: {
    borderColor: COURSE_EXERCISE_COLORS.accent,
    backgroundColor: COURSE_EXERCISE_COLORS.accentTint,
  },
  supported: {
    borderColor: COURSE_EXERCISE_COLORS.accent,
    backgroundColor: COURSE_EXERCISE_COLORS.accentTint,
  },
  unsupported: {
    borderColor: COURSE_EXERCISE_COLORS.error,
    backgroundColor: COURSE_EXERCISE_COLORS.errorTint,
  },
  disabled: { opacity: 0.5 },
});

const labelStyles = StyleSheet.create({
  idle: {},
  selected: { color: COURSE_EXERCISE_COLORS.accentDark },
  supported: { color: COURSE_EXERCISE_COLORS.accentDark },
  unsupported: { color: COURSE_EXERCISE_COLORS.error },
  disabled: { color: COURSE_EXERCISE_COLORS.inkSoft },
});
