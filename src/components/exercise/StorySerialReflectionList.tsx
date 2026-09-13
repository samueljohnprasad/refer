import React from "react";
import { Text, View } from "react-native";
import { CourseExerciseOptionButton } from "@/src/components/exercise/CourseExerciseOptionButton";
import type { ReflectionOption } from "@/src/components/exercise/storySerialContent";

export function StorySerialReflectionList({
  options,
  activeId,
  isFinalComplete,
  locked,
  onSelect,
}: {
  options: ReflectionOption[];
  activeId: string | null;
  isFinalComplete: boolean;
  locked: boolean;
  onSelect: (option: ReflectionOption) => void;
}) {
  return (
    <View className="mb-2 gap-3">
      {options.map((option) => {
        const isSelected = activeId === option.id;
        const isCorrect = option.id === "reading";
        const isWrongSelected = isSelected && !isCorrect && !isFinalComplete;
        const isCorrectSelected = isSelected && isCorrect && isFinalComplete;

        return (
          <View key={option.id}>
            <CourseExerciseOptionButton
              label={option.label}
              selected={isSelected}
              result={isCorrectSelected ? "correct" : undefined}
              showConfirmationIcon={isCorrectSelected}
              disabled={locked || isFinalComplete}
              onPress={() => onSelect(option)}
            />

            {isWrongSelected && (
              <View className="mb-2 ml-2 mt-2 border-l-[2px] border-[#D8C7B5] py-1 pl-3">
                <Text className="happy-font-heading-bold mb-1 text-[11px] uppercase tracking-wider text-[#82796A]">
                  NOT QUITE
                </Text>
                <Text className="happy-font-body text-[13.5px] leading-[19px] text-[#5C5549]">
                  {option.feedback}
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
