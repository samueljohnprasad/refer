import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useWeeklyCBTSummary } from "@/src/hooks/insights/useWeeklyCBTSummary";

export function WeeklySummaryCard() {
  const { data, isLoading } = useWeeklyCBTSummary();

  if (isLoading || !data || data.thisWeekCount === 0) return null;

  const changeText = formatChange(data.weekOverWeekChange);

  return (
    <View className="happy-brand-card rounded-[24px] p-5">
      <Text className="happy-font-heading-bold text-[18px] tracking-tight text-ink mb-3">
        This Week
      </Text>
      <View className="flex-row items-baseline gap-2 mb-2">
        <Text className="happy-font-heading-bold text-[32px] text-sage-600">
          {data.thisWeekCount}
        </Text>
        <Text className="happy-font-body-medium text-sm text-ink-muted">
          session{data.thisWeekCount !== 1 ? "s" : ""}
        </Text>
        {changeText && (
          <View className="flex-row items-center gap-1 px-2 py-1 rounded-[10px] border" style={[{ backgroundColor: "#E8FBF0", borderColor: "#A7F3D0" }]}>
            <Text className="text-[11px] font-semibold" style={[{ color: "#166534" }]}>
              {changeText}
            </Text>
          </View>
        )}
      </View>
      {data.topCategory && (
        <Text className="happy-font-body text-[12px] text-ink-muted mb-1">
          Most practiced: {data.topCategory.label} ({data.topCategory.count})
        </Text>
      )}
      {data.avgShiftThisWeek !== null && (
        <Text className="happy-font-body text-[12px] text-ink-muted mb-1">
          Avg improvement: −{data.avgShiftThisWeek.toFixed(1)} pts
        </Text>
      )}
      {data.highlights.length > 0 && (
        <View className="mt-2 pt-2 border-t border-sage-100">
          {data.highlights.map((h) => (
            <Text
              key={h}
              className="happy-font-body-semibold text-[11px] text-sage-600"
            >
              {h}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

function formatChange(change: number | null): string | null {
  if (change === null) return null;
  const pct = Math.round(change * 100);
  if (pct === 0) return null;
  return pct > 0 ? `+${pct}% vs last week` : `${pct}% vs last week`;
}
