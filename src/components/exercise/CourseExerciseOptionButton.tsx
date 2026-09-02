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

type OptionVisualState =
  "default" | "selected" | "confirmed" | "correct" | "incorrect" | "disabled";

export function CourseExerciseOptionButton({
  label,
  selected,
  disabled,
  align,
  showConfirmationIcon,
  result,
  onPress,
}: CourseExerciseOptionButtonProps) {
  const isDisabled = Boolean(disabled);
  const visualState = getVisualState(
    selected,
    isDisabled,
    showConfirmationIcon !== false,
    result,
  );

  return (
    <View style={styles.container}>
      <View style={[styles.rim, RIM_STYLES[visualState]]} />
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, selected }}
        disabled={isDisabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.face,
          FACE_STYLES[visualState],
          pressed && styles.facePressed,
        ]}
      >
        <OptionStateIcon state={visualState} />
        <Text
          style={[
            styles.label,
            LABEL_STYLES[visualState],
            { textAlign: resolveAlignment(align) },
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

function getVisualState(
  selected: boolean,
  disabled: boolean,
  showConfirmationIcon: boolean,
  result: CourseExerciseOptionButtonProps["result"],
): OptionVisualState {
  const resultState = getResultState(selected, result);
  if (resultState) return resultState;
  return getSelectionState(selected, disabled, showConfirmationIcon);
}

function getResultState(
  selected: boolean,
  result: CourseExerciseOptionButtonProps["result"],
): OptionVisualState | undefined {
  if (!selected) return undefined;
  return result;
}

function getSelectionState(
  selected: boolean,
  disabled: boolean,
  showConfirmationIcon: boolean,
): OptionVisualState {
  if (selected) return getSelectedState(disabled, showConfirmationIcon);
  return getUnselectedState(disabled);
}

function getSelectedState(
  disabled: boolean,
  showConfirmationIcon: boolean,
): OptionVisualState {
  if (disabled) return getDisabledSelectedState(showConfirmationIcon);
  return "selected";
}

function getDisabledSelectedState(
  showConfirmationIcon: boolean,
): OptionVisualState {
  if (showConfirmationIcon) return "confirmed";
  return "selected";
}

function getUnselectedState(disabled: boolean): OptionVisualState {
  if (disabled) return "disabled";
  return "default";
}

function resolveAlignment(
  align: CourseExerciseOptionButtonProps["align"],
): "left" | "center" {
  if (align) return align;
  return "left";
}

function OptionStateIcon({ state }: { state: OptionVisualState }) {
  const icon = STATE_ICONS[state];
  if (!icon) return null;

  return (
    <View style={[styles.checkCircle, icon.containerStyle]}>
      <Text style={styles.checkLabel}>{icon.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 3,
    alignSelf: "stretch",
  },
  rim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 3,
    borderRadius: 20,
    backgroundColor: SEMANTIC_COLORS.border.strong,
  },
  face: {
    minHeight: 61,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    justifyContent: "center",
    paddingHorizontal: 17,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: SEMANTIC_COLORS.border.strong,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
  },
  faceSelected: {
    borderColor: SEMANTIC_COLORS.selection.border,
    backgroundColor: SEMANTIC_COLORS.selection.surface,
  },
  faceConfirmed: {
    borderColor: SEMANTIC_COLORS.success.border,
    backgroundColor: SEMANTIC_COLORS.success.surface,
  },
  faceIncorrect: {
    borderColor: SEMANTIC_COLORS.error.border,
    backgroundColor: SEMANTIC_COLORS.error.surface,
  },
  faceDisabled: {
    borderColor: SEMANTIC_COLORS.disabled.border,
    backgroundColor: SEMANTIC_COLORS.disabled.surface,
  },
  facePressed: {
    transform: [{ translateY: 3 }],
  },
  label: {
    flex: 1,
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 18,
    lineHeight: 24,
  },
  selectedLabel: { color: SEMANTIC_COLORS.selection.foreground },
  correctLabel: { color: SEMANTIC_COLORS.success.foreground },
  incorrectLabel: { color: SEMANTIC_COLORS.error.foreground },
  disabledLabel: { color: SEMANTIC_COLORS.disabled.foreground },
  checkCircle: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: SEMANTIC_COLORS.success.indicator,
  },
  errorCircle: { backgroundColor: SEMANTIC_COLORS.error.indicator },
  checkLabel: {
    color: SEMANTIC_COLORS.brand.onPrimary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 14,
  },
});

const FACE_STYLES = {
  default: undefined,
  selected: styles.faceSelected,
  confirmed: styles.faceConfirmed,
  correct: styles.faceConfirmed,
  incorrect: styles.faceIncorrect,
  disabled: styles.faceDisabled,
} as const;

const RIM_STYLES = {
  default: undefined,
  selected: { backgroundColor: SEMANTIC_COLORS.selection.border },
  confirmed: { backgroundColor: SEMANTIC_COLORS.success.border },
  correct: { backgroundColor: SEMANTIC_COLORS.success.border },
  incorrect: { backgroundColor: SEMANTIC_COLORS.error.border },
  disabled: { backgroundColor: SEMANTIC_COLORS.disabled.border },
} as const;

const LABEL_STYLES = {
  default: undefined,
  selected: styles.selectedLabel,
  confirmed: styles.correctLabel,
  correct: styles.correctLabel,
  incorrect: styles.incorrectLabel,
  disabled: styles.disabledLabel,
} as const;

const STATE_ICONS = {
  default: undefined,
  selected: undefined,
  confirmed: { label: "✓", containerStyle: undefined },
  correct: { label: "✓", containerStyle: undefined },
  incorrect: { label: "✕", containerStyle: styles.errorCircle },
  disabled: undefined,
} as const;
