import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
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
    borderColor: SEMANTIC_COLORS.border.default,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
  },
  label: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 16,
    lineHeight: 22,
  },
  pressed: { opacity: 0.7 },
});

const choiceStyles = StyleSheet.create({
  idle: {},
  selected: {
    borderColor: SEMANTIC_COLORS.brand.primary,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },
  supported: {
    borderColor: SEMANTIC_COLORS.brand.primary,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },
  unsupported: {
    borderColor: SEMANTIC_COLORS.error.primary,
    backgroundColor: SEMANTIC_COLORS.error.soft,
  },
  disabled: { opacity: 0.5 },
});

const labelStyles = StyleSheet.create({
  idle: {},
  selected: { color: SEMANTIC_COLORS.brand.pressed },
  supported: { color: SEMANTIC_COLORS.brand.pressed },
  unsupported: { color: SEMANTIC_COLORS.error.primary },
  disabled: { color: SEMANTIC_COLORS.text.secondary },
});
