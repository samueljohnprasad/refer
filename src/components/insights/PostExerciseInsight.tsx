import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import type { ExerciseType } from "@/src/types/exerciseFlow";
import { usePostExerciseInsight } from "@/src/hooks/insights";

interface PostExerciseInsightProps {
  exerciseType: ExerciseType;
  response: Record<string, any>;
}

const TONE_STYLES = {
  encouraging: { bg: "#eef2e8", border: "#d4ccb5", icon: "📊" },
  celebrating: { bg: "#eaf0e2", border: "#a8b89a", icon: "🎉" },
  curious: { bg: "#ffffff", border: "#d3e0cd", icon: "💡" },
} as const;

export const PostExerciseInsight: React.FC<PostExerciseInsightProps> =
  React.memo(({ exerciseType, response }) => {
    const insight = usePostExerciseInsight(exerciseType, response);

    return null; // Disabled per user request

    const style = TONE_STYLES[insight.tone];

    return (
      <View
        className="rounded-xl p-4 mb-4"
        style={{
          backgroundColor: style.bg,
          borderWidth: 1,
          borderColor: style.border,
        }}
      >
        <Text className="happy-font-body-semibold text-sm text-ink">
          {style.icon} {insight.message}
        </Text>
        {insight.detail && (
          <Text className="happy-font-body text-xs text-ink-muted mt-1">
            {insight.detail}
          </Text>
        )}
      </View>
    );
  });

PostExerciseInsight.displayName = "PostExerciseInsight";
