import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/Text";

interface DataPoint {
  label: string;
  value: number;
}

interface TrendLineProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  unit?: string;
}

export const TrendLine: React.FC<TrendLineProps> = React.memo(
  ({ data, height = 120, color = "#5a7a56", unit = "" }) => {
    if (data.length === 0) return null;

    const maxVal = Math.max(...data.map((d) => d.value), 1);
    const minVal = Math.min(...data.map((d) => d.value), 0);
    const range = maxVal - minVal || 1;

    return (
      <View>
        <View className="flex-row items-end justify-between" style={{ height }}>
          {data.map((point, i) => {
            const barHeight = ((point.value - minVal) / range) * (height - 20);
            return (
              <View key={i} className="items-center flex-1">
                <Text className="happy-font-body-bold text-[9px] text-ink-muted mb-1">
                  {point.value.toFixed(1)}
                  {unit}
                </Text>
                <View
                  className="w-3 rounded-full"
                  style={{
                    height: Math.max(barHeight, 4),
                    backgroundColor: color,
                    opacity: 0.6 + (i / data.length) * 0.4,
                  }}
                />
              </View>
            );
          })}
        </View>
        <View className="flex-row justify-between mt-2">
          {data.map((point, i) => (
            <View key={i} className="flex-1 items-center">
              <Text className="happy-font-body text-[9px] text-ink-muted">
                {point.label.replace(/^\d{4}-W/, "W")}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  },
);

TrendLine.displayName = "TrendLine";
