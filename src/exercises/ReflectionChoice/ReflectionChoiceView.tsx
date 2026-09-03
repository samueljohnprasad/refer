import React from "react";
import { View } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { CourseExerciseOptionButton } from "@/src/components/exercise/CourseExerciseOptionButton";
import type { ReflectionChoiceData } from "@/src/exercises/ReflectionChoice/data";

interface ReflectionChoiceViewProps extends ReflectionChoiceData {
  selectedOptionId: string | null;
  disabled: boolean;
  onSelect: (optionId: string) => void;
}

export function ReflectionChoiceView({
  title,
  options,
  selectedOptionId,
  disabled,
  onSelect,
}: ReflectionChoiceViewProps) {
  return (
    <View className="px-2 pb-4 pt-1.5">
      {title ? <CourseExerciseHeading title={title} /> : null}
      <View accessibilityRole="radiogroup" className="gap-2">
        {options.map((option) => (
          <CourseExerciseOptionButton
            key={option.id}
            label={option.label}
            selected={selectedOptionId === option.id}
            disabled={disabled}
            role="radio"
            showConfirmationIcon={false}
            onPress={() => onSelect(option.id)}
          />
        ))}
      </View>
    </View>
  );
}
