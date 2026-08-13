import React from "react";
import { Pressable, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import type { ExplorableControl } from "@/src/components/exercise/explorableModelContent";
import { COURSE_EXERCISE_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import { explorableModelStyles as styles } from "@/src/components/exercise/explorableModelStyles";

interface ExplorableModelControlProps {
  control: ExplorableControl;
  disabled: boolean;
  value: number | boolean;
  onSliderDraft: (value: number) => void;
  onSliderSettle: (value: number) => void;
  onToggle: () => void;
}

export function ExplorableModelControl({
  control,
  disabled,
  value,
  onSliderDraft,
  onSliderSettle,
  onToggle,
}: ExplorableModelControlProps) {
  if (control.type === "slider") {
    const sliderValue = typeof value === "number" ? value : control.min;
    return (
      <View style={styles.control}>
        <View style={styles.controlHeading}>
          <Text style={styles.controlLabel}>{control.label}</Text>
          <Text style={styles.controlValue}>{Math.round(sliderValue)}%</Text>
        </View>
        <Slider
          accessibilityLabel={control.accessibilityLabel}
          accessibilityRole="adjustable"
          accessibilityState={{ disabled }}
          accessibilityValue={{ min: control.min, max: control.max, now: sliderValue,
            text: `${Math.round(sliderValue)} percent` }}
          disabled={disabled}
          minimumValue={control.min}
          maximumValue={control.max}
          step={control.step}
          value={sliderValue}
          minimumTrackTintColor={COURSE_EXERCISE_COLORS.accent}
          maximumTrackTintColor={COURSE_EXERCISE_COLORS.border}
          thumbTintColor={COURSE_EXERCISE_COLORS.accent}
          onValueChange={onSliderDraft}
          onSlidingComplete={onSliderSettle}
          style={styles.slider}
        />
      </View>
    );
  }

  const checked = value === true;
  return (
    <Pressable
      accessibilityLabel={control.accessibilityLabel}
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={onToggle}
      style={({ pressed }) => [styles.toggle, checked && styles.toggleActive,
        pressed && styles.pressed]}
    >
      <Text style={[styles.toggleLabel, checked && styles.toggleLabelActive]}>
        {control.label}
      </Text>
      <Text style={[styles.toggleValue, checked && styles.toggleLabelActive]}>
        {checked ? control.onLabel : control.offLabel}
      </Text>
    </Pressable>
  );
}
