import React from "react";
import { Text, View } from "react-native";
import Slider from "@react-native-community/slider";

interface TwoDialControlProps {
  title: string;
  low: string;
  high: string;
  value: number;
  disabled: boolean;
  accessibilityLabel: string;
  valueLabel: string;
  onChange: (value: number) => void;
}

export function TwoDialControl({
  title,
  low,
  high,
  value,
  disabled,
  accessibilityLabel,
  valueLabel,
  onChange,
}: TwoDialControlProps) {
  return (
    <View>
      <Text className="text-[12px] font-bold tracking-wider text-ink uppercase mb-0.5">
        {title}
      </Text>
      <Slider
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ text: valueLabel }}
        disabled={disabled}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={value}
        tapToSeek
        minimumTrackTintColor="#5F7F58"
        maximumTrackTintColor="#E2DDD5"
        thumbTintColor="#5F7F58"
        onValueChange={onChange}
        hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
        style={{ width: "100%", height: 48 }}
      />
      <View className="flex-row justify-between px-0.5">
        <Text className="happy-font-body text-[11px] text-[#8A8A85]">
          {low}
        </Text>
        <Text className="happy-font-body text-[11px] text-[#8A8A85]">
          {high}
        </Text>
      </View>
    </View>
  );
}
