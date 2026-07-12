import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/Text";

interface StatPillProps {
  label: string;
  value: string;
}

export function StatPill({ label, value }: StatPillProps) {
  return (
    <View className="happy-brand-soft-chip px-3 py-1.5 flex-row items-center gap-1">
      <Text className="happy-font-body-bold text-[11px] text-ink-muted">
        {label}
      </Text>
      <Text className="happy-font-body-bold text-[11px] text-ink">{value}</Text>
    </View>
  );
}
