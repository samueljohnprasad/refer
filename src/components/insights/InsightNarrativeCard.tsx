import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { useInsightNarrative } from "@/src/hooks/insights/useInsightNarrative";
import { SAGE } from "@/lib/tokens";
import dayjs from "dayjs";

export function InsightNarrativeCard() {
  const { data, isLoading } = useInsightNarrative();

  if (isLoading || !data) return null;

  const updatedLabel = dayjs(data.generatedAt).format("MMM D");

  return (
    <View
      className="rounded-2xl p-5 mb-4"
      style={{
        backgroundColor: SAGE[50],
        borderWidth: 1.5,
        borderColor: SAGE[200],
      }}
    >
      <View className="flex-row items-center gap-1.5 mb-3">
        <Text className="text-[13px]">✨</Text>
        <Text className="text-[12px] font-bold text-sage-700 uppercase tracking-wider">
          Your Insight
        </Text>
      </View>

      <Text className="text-[15px] text-ink leading-relaxed font-medium">
        {data.narrative}
      </Text>

      <Text className="text-[11px] text-sage-500 mt-3">
        Updated {updatedLabel}
      </Text>
    </View>
  );
}

InsightNarrativeCard.displayName = "InsightNarrativeCard";
