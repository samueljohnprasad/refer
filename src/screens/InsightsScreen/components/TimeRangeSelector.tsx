import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { TIME_RANGES, type TimeRange } from "@/src/constants/insights";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <View className="flex-row rounded-lg bg-sage-50 p-0.5">
      {TIME_RANGES.map(({ key, label }) => (
        <Pressable
          key={key}
          onPress={() => onChange(key)}
          className={`px-2.5 py-1 rounded-md ${
            value === key ? "bg-warm-white" : ""
          }`}
        >
          <Text
            className={`happy-font-body-bold text-[10px] ${
              value === key ? "text-ink" : "text-ink-muted"
            }`}
          >
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
