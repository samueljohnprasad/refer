import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

interface BarItem {
  label: string;
  value: number;
}

interface HorizontalBarChartProps {
  data: BarItem[];
  maxItems?: number;
  barColor?: string;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = React.memo(
  ({ data, maxItems = 6, barColor = "#5a7a56" }) => {
    const items = data.slice(0, maxItems);
    const maxValue = Math.max(...items.map((d) => d.value), 1);

    return (
      <View className="gap-3">
        {items.map((item) => (
          <View key={item.label}>
            <View className="flex-row items-center justify-between mb-1">
              <Text className="happy-font-body-semibold text-[13px] text-ink-soft">
                {item.label}
              </Text>
              <Text className="happy-font-body-bold text-[12px] text-ink-muted">
                {item.value}
              </Text>
            </View>
            <View className="h-3 bg-sage-50 rounded-full overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: barColor,
                }}
              />
            </View>
          </View>
        ))}
      </View>
    );
  },
);

HorizontalBarChart.displayName = "HorizontalBarChart";
