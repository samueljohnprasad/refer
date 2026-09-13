import React from "react";
import { Text, View } from "react-native";
import type { ComparisonData } from "@/src/components/exercise/storySerialContent";

export function StorySerialComparisonCard({
  comparison,
}: {
  comparison: ComparisonData;
}) {
  return (
    <View
      accessible
      accessibilityRole="summary"
      accessibilityLabel="Comparison between paths"
      className="mb-5 overflow-hidden rounded-[18px] border border-[#E8DCCB] bg-[#FAF7F2]"
    >
      <View
        accessible
        accessibilityLabel="Same start: Unexpected meeting and tight chest"
        className="bg-[#F2ECE4] px-4 py-2.5"
      >
        <Text className="happy-font-heading-bold mb-0.5 text-[10.5px] uppercase tracking-wider text-[#82796A]">
          SAME START
        </Text>
        <Text className="happy-font-body-bold text-[13.5px] text-[#201E1D]">
          {comparison.start.join(" + ")}
        </Text>
      </View>
      <View
        accessible
        accessibilityLabel="Alarm as proof path: Prediction, avoidance, quick relief, no new evidence"
        className="border-t border-[#E8DCCB] bg-[#FDF8F3] px-4 py-3"
      >
        <Text className="happy-font-heading-bold mb-0.5 text-[10.5px] uppercase tracking-wider text-[#4A6B53]">
          ALARM = PROOF
        </Text>
        <Text className="happy-font-body text-[13.5px] leading-[20px] text-[#201E1D]">
          {comparison.path1.join(" → ")}
        </Text>
      </View>
      <View
        accessible
        accessibilityLabel="Alarm as signal path: Prediction stays uncertain, show up, check reality, new evidence"
        className="border-t border-[#E8DCCB] bg-[#F2F8EF] px-4 py-3"
      >
        <Text className="happy-font-heading-bold mb-0.5 text-[10.5px] uppercase tracking-wider text-[#4A6B53]">
          ALARM = SIGNAL
        </Text>
        <Text className="happy-font-body text-[13.5px] leading-[20px] text-[#201E1D]">
          {comparison.path2.join(" → ")}
        </Text>
      </View>
    </View>
  );
}
