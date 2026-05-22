import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

interface BigStatProps {
  value: string;
  subtitle: string;
  color?: string;
}

export function BigStat({
  value,
  subtitle,
  color = "text-sage-600",
}: BigStatProps) {
  return (
    <View className="items-center py-4">
      <Text className={`happy-font-heading-bold text-[40px] ${color}`}>
        {value}
      </Text>
      <Text className="happy-font-body-medium text-sm text-ink-muted mt-1">
        {subtitle}
      </Text>
    </View>
  );
}
