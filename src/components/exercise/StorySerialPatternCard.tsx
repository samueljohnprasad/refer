// ponytail: Flat informational insight card for StorySerial
import React from "react";
import { Text, View } from "react-native";

export function StorySerialPatternCard({ pattern }: { pattern?: string | null }) {
  if (!pattern) return null;
  const paragraphs = pattern.split("\n\n");

  return (
    <View className="mt-4 rounded-[18px] border border-[#ABC0A2] bg-[#F2F8EF] p-3.5">
      <Text className="happy-font-heading-bold mb-1.5 text-[10.5px] uppercase tracking-wider text-[#4A6B53]">
        THE PATTERN
      </Text>
      {paragraphs.map((para, i) => (
        <Text
          key={i}
          className={`happy-font-body text-[13.5px] leading-[19px] text-[#201E1D] ${i > 0 ? "mt-2" : ""}`}
        >
          {para}
        </Text>
      ))}
    </View>
  );
}
