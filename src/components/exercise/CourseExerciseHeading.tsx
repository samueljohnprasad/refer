import React from "react";
import { Text, View } from "react-native";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";

interface CourseExerciseHeadingProps {
  title: string;
  instruction?: string | null;
  prompt?: string | null;
}

export function CourseExerciseHeading({
  title,
  instruction,
  prompt,
}: CourseExerciseHeadingProps) {
  const translateCopy = useExerciseCopy();
  return (
    <View className="mb-3.5">
      <Text
        accessibilityRole="header"
        className="happy-font-heading text-2xl leading-[30px] tracking-[-0.4px] text-ink"
      >
        {translateCopy(title)}
      </Text>
      {instruction ? (
        <Text className="happy-font-body mt-[3px] text-[15px] leading-[21px] text-ink-soft">
          {translateCopy(instruction)}
        </Text>
      ) : null}
      {prompt ? (
        <Text className="happy-font-body-bold mt-3 text-[21px] leading-[27px] text-ink">
          {translateCopy(prompt)}
        </Text>
      ) : null}
    </View>
  );
}
