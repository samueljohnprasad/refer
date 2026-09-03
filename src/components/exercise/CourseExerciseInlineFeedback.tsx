import React from "react";
import { Text, View } from "react-native";

interface CourseExerciseInlineFeedbackProps {
  correct: boolean;
  message: string;
}

export function CourseExerciseInlineFeedback({
  correct,
  message,
}: CourseExerciseInlineFeedbackProps) {
  return (
    <View
      accessibilityLiveRegion="polite"
      className={`mt-[7px] rounded-2xl px-4 py-[13px] ${correct ? "bg-sage-selected" : "bg-brand-surface-soft"}`}
    >
      <Text className="happy-font-body text-base leading-[23px] text-ink">
        {message}
      </Text>
    </View>
  );
}
