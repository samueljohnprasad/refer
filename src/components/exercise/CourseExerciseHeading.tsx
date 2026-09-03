import React from "react";
import { Text, View } from "react-native";

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
  return (
    <View className="mb-3.5">
      <Text
        accessibilityRole="header"
        className="happy-font-heading text-2xl leading-[30px] tracking-[-0.4px] text-ink"
      >
        {title}
      </Text>
      {instruction ? (
        <Text className="happy-font-body mt-[3px] text-[15px] leading-[21px] text-ink-soft">
          {instruction}
        </Text>
      ) : null}
      {prompt ? (
        <Text className="happy-font-body-bold mt-3 text-[21px] leading-[27px] text-ink">
          {prompt}
        </Text>
      ) : null}
    </View>
  );
}
