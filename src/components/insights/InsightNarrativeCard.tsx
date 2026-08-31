import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { useInsightNarrative } from "@/src/hooks/insights/useInsightNarrative";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import dayjs from "dayjs";

export function InsightNarrativeCard() {
  const { data, isLoading } = useInsightNarrative();

  if (isLoading || !data) return null;

  const updatedLabel = dayjs(data.generatedAt).format("MMM D");

  return (
    <View className="px-2 mb-6">
      <View className="flex-row items-center gap-1.5 mb-2">
        <Text className="text-[14px]">✨</Text>
        <Text className="text-[12px] font-bold text-sage-700 uppercase tracking-wider">
          AI INSIGHT
        </Text>
      </View>

      <Text className="happy-font-heading text-[22px] text-ink leading-snug">
        {data.narrative}
      </Text>
    </View>
  );
}

InsightNarrativeCard.displayName = "InsightNarrativeCard";
