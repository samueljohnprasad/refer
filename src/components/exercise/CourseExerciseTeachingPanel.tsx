import React from "react";
import { Text, View } from "react-native";

interface CourseExerciseTeachingPanelProps {
  body: string;
  correct?: boolean;
  title: string;
  capability?: string | null;
  workedExample?: string | null;
}

export function CourseExerciseTeachingPanel({
  body,
  correct = true,
  title,
  capability,
  workedExample,
}: CourseExerciseTeachingPanelProps) {
  return (
    <View className="mt-6 gap-2.5">
      <View
        className={
          correct
            ? "rounded-[20px] bg-success-surface border border-success-border/30 px-5 py-5"
            : "rounded-[20px] bg-error-surface border border-error-border/30 px-5 py-5"
        }
      >
        <Text className="happy-font-body-bold text-[16px] text-text-primary">
          {title}
        </Text>
        <Text className="happy-font-body mt-1.5 text-[14px] leading-5 text-text-secondary">
          {body}
        </Text>
        {capability ? (
          <Text className="happy-font-body-bold mt-2 text-[12.5px] leading-[18px] text-brand-onSoft">
            Takeaway: {capability}
          </Text>
        ) : null}
      </View>
      {workedExample ? (
        <View className="rounded-[20px] border border-[#DCD3C4] bg-[#F9F4ED] px-4 py-[14px]">
          <Text className="happy-font-body-bold text-[10.5px] tracking-[0.5px] text-[#29452A]">
            HERE’S THE THINKING
          </Text>
          <Text className="happy-font-body mt-1 text-[13.5px] leading-5 text-[#3F3A34]">
            {workedExample}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
