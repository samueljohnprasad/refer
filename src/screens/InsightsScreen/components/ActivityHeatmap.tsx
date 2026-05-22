import React, { useMemo } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import type { HeatmapDay } from "@/src/hooks/insights/useInsightsOverview";

const WEEKS = 12;
const DAYS_PER_WEEK = 7;
const CELL_SIZE = 14;
const GAP = 3;

const COLORS = ["#f4f1ea", "#d4ccb5", "#a8b89a", "#7a9272", "#5a7a56"] as const;

function getLevel(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

interface ActivityHeatmapProps {
  data: HeatmapDay[];
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = React.memo(
  ({ data }) => {
    const grid = useMemo(() => {
      const lookup: Record<string, number> = {};
      for (const d of data) {
        lookup[d.date] = d.count;
      }

      const today = new Date();
      const cells: { key: string; level: number }[][] = [];

      for (let w = WEEKS - 1; w >= 0; w--) {
        const week: { key: string; level: number }[] = [];
        for (let d = 0; d < DAYS_PER_WEEK; d++) {
          const offset = w * 7 + (6 - d);
          const date = new Date(today.getTime() - offset * 86_400_000);
          const key = date.toISOString().slice(0, 10);
          week.push({ key, level: getLevel(lookup[key] || 0) });
        }
        cells.push(week);
      }

      return cells;
    }, [data]);

    return (
      <View>
        <View className="flex-row justify-between">
          {grid.map((week, wi) => (
            <View key={wi} style={{ gap: GAP }}>
              {week.map((cell) => (
                <View
                  key={cell.key}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    borderRadius: 3,
                    backgroundColor: COLORS[cell.level],
                  }}
                />
              ))}
            </View>
          ))}
        </View>
        <View className="flex-row items-center mt-3 gap-1">
          <Text className="happy-font-body text-[10px] text-ink-muted mr-1">
            Less
          </Text>
          {COLORS.map((color, i) => (
            <View
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: color,
              }}
            />
          ))}
          <Text className="happy-font-body text-[10px] text-ink-muted ml-1">
            More
          </Text>
        </View>
      </View>
    );
  },
);

ActivityHeatmap.displayName = "ActivityHeatmap";
