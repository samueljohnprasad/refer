import React, { useMemo, useState } from "react";
import {
  View,
  ActivityIndicator,
  LayoutChangeEvent,
  Image,
} from "react-native";
import { Text } from "@/components/ui/text";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
} from "victory-native";
import { Defs, LinearGradient, Stop } from "react-native-svg";
import { addDays, differenceInCalendarDays, format } from "date-fns";
import {
  useFetchMoodsRange,
  MoodsMap,
} from "@/components/mentalHealth/hooks/useFetchMoodsRange";
import { emotions } from "@/assets/emojis";

export interface WeeklyMoodChartProps {
  startDate: Date; // inclusive
  endDate: Date; // inclusive
  title?: string;
}

interface ChartPoint {
  x: string;
  y: number | null; // null indicates no data for that day
  dateKey: string; // yyyy-MM-dd
}

interface NumericPoint {
  x: number;
  y: number;
  label: string;
}

type MoodLevel = "Terrible" | "Bad" | "Fine" | "Good" | "Great";

const HEX = {
  red: "#EF4444",
  amber: "#F59E0B",
  green: "#10B981",
  grid: "#EAF0F6",
};

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

function mixHex(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const r = Math.round(ca.r + (cb.r - ca.r) * t);
  const g = Math.round(ca.g + (cb.g - ca.g) * t);
  const b2 = Math.round(ca.b + (cb.b - ca.b) * t);
  return `rgb(${r}, ${g}, ${b2})`;
}

// Helpers for 5-point scale rendering
function toFiveScale(v10: number): number {
  return v10 + 0.5; // clamp to 1..5 for display
}

function colorForScore5(score5: number): string {
  // Normalize 1..5 to 0..1 for gradient blending
  const v = Math.max(0, Math.min(1, (score5 - 1) / 4));
  if (v <= 0.5) return mixHex(HEX.red, HEX.amber, v / 0.5);
  return mixHex(HEX.amber, HEX.green, (v - 0.5) / 0.5);
}

function levelForScore5(score5: number): MoodLevel {
  if (score5 >= 4.5) return "Great";
  if (score5 >= 3.5) return "Good";
  if (score5 >= 2.5) return "Fine";
  if (score5 >= 1.5) return "Bad";
  return "Terrible";
}

function twoLetterDow(date: Date): string {
  // Ensure consistent two-letter labels in English
  const d = date.getDay();
  const labels: Record<number, string> = {
    0: "SU",
    1: "MO",
    2: "TU",
    3: "WE",
    4: "TH",
    5: "FR",
    6: "SA",
  };
  return labels[d];
}

const buildChartData = (
  start: Date,
  end: Date,
  moodMap: MoodsMap
): ChartPoint[] => {
  const totalDays: number = differenceInCalendarDays(end, start) + 1;
  const points: ChartPoint[] = [];
  for (let i = 0; i < totalDays; i++) {
    const d = addDays(start, i);
    const key: string = format(d, "yyyy-MM-dd");
    const label: string = twoLetterDow(d);
    const val: number | undefined = moodMap.get(key);
    points.push({ x: label, y: val ?? null, dateKey: key });
  }
  return points;
};

export const WeeklyMoodChart: React.FC<WeeklyMoodChartProps> = ({
  startDate,
  endDate,
  title = "Mood Flow",
}) => {
  const { data, isLoading, isError } = useFetchMoodsRange({
    startDate,
    endDate,
  });
  const points: ChartPoint[] = useMemo(
    () =>
      buildChartData(
        startDate,
        endDate,
        (data as MoodsMap) ?? new Map<string, number>()
      ),
    [startDate, endDate, data]
  );
  const totalDays: number = points.length;

  // Derived values and layout
  const numericPoints5: NumericPoint[] = points
    .map((p, idx) =>
      p.y !== null ? { x: idx + 1, y: toFiveScale(p.y), label: p.x } : null
    )
    .filter((p): p is NumericPoint => p !== null);
  const xTickValues: number[] = Array.from(
    { length: totalDays },
    (_, i) => i + 1
  );
  const xTickLabels: string[] = points.map((p) => p.x);
  const avg5: number =
    numericPoints5.length > 0
      ? numericPoints5.reduce((s, p) => s + p.y, 0) / numericPoints5.length
      : 0;
  const avgLabel: MoodLevel = levelForScore5(avg5);
  const headerTitle: string = title;
  const headerSubtitle: string = `${format(startDate, "LLLL d")} - ${format(
    endDate,
    "d, yyyy"
  )}`;
  const chartHeight: number = 270;
  const padding = { top: 10, bottom: 26, left: 10, right: 100 } as const;
  const [layoutWidth, setLayoutWidth] = useState<number>(0);
  const onLayout = (e: LayoutChangeEvent): void => {
    setLayoutWidth(e.nativeEvent.layout.width);
  };

  // Group points by mood level for dot colors
  const byLevel: Record<MoodLevel, NumericPoint[]> = useMemo(() => {
    return numericPoints5.reduce<Record<MoodLevel, NumericPoint[]>>(
      (acc, p) => {
        const lvl = levelForScore5(p.y);
        acc[lvl].push(p);
        return acc;
      },
      { Great: [], Good: [], Fine: [], Bad: [], Terrible: [] }
    );
  }, [numericPoints5]);
  console.log("sdfsdfsd", byLevel);
  if (isLoading) {
    return (
      <View className="w-full rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
        <Text className="text-base font-semibold mb-2">{title}</Text>
        <View className="py-10 items-center justify-center">
          <ActivityIndicator />
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="w-full rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
        <Text className="text-base font-semibold mb-2">{title}</Text>
        <Text className="text-red-500">Failed to load mood data.</Text>
      </View>
    );
  }

  if (numericPoints5.length === 0) {
    return (
      <View className="w-full rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
        <Text className="text-xl font-extrabold text-gray-800 text-center">
          {headerTitle}
        </Text>
        <Text className="text-xs text-gray-500 text-center mt-1">
          {headerSubtitle}
        </Text>
        <View className="py-8 items-center justify-center">
          <Text className="text-gray-500">No entries yet for this range.</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      className="w-full rounded-3xl bg-white p-4 shadow-md border border-gray-100"
      style={{
        shadowOpacity: 0.1,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 6 },
      }}
      onLayout={onLayout}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-1">
        <View>
          <Text className="text-xl font-extrabold text-gray-800">
            {headerTitle}
          </Text>
          <Text className="text-xs text-gray-500 mt-1">{headerSubtitle}</Text>
        </View>
        <View className="flex-row items-center">
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colorForScore5(avg5),
              marginRight: 6,
            }}
          />
          <Text className="text-xs text-gray-500">
            Average:{" "}
            <Text className="font-semibold text-gray-700">{avgLabel}</Text>
          </Text>
        </View>
      </View>

      {/* Chart area */}
      <View className="mt-3">
        <VictoryChart
          width={layoutWidth || undefined}
          height={chartHeight}
          padding={padding}
          domain={{ x: [0.5, totalDays + 0.5], y: [1, 6] }}
          theme={VictoryTheme.material}
        >
          {/* Gradient for line color transitions between moods */}
          {layoutWidth > 0 && (
            <Defs>
              <LinearGradient
                id="weeklyMoodLineGradient"
                x1={padding.left}
                y1={0}
                x2={layoutWidth - padding.right}
                y2={0}
                gradientUnits="userSpaceOnUse"
              >
                {numericPoints5
                  .slice()
                  .sort((a, b) => a.x - b.x)
                  .map((p) => {
                    const xMin: number = 0.5;
                    const xMax: number = totalDays + 0.5;
                    const t: number = (p.x - xMin) / (xMax - xMin); // 0..1
                    const offset: string = `${Math.max(0, Math.min(1, t)) * 100}%`;
                    const color: string = colorForScore5(p.y);
                    return <Stop key={`stop-${p.x}`} offset={offset} stopColor={color} />;
                  })}
              </LinearGradient>
            </Defs>
          )}
          <VictoryAxis
            tickValues={xTickValues}
            tickFormat={xTickLabels}
            style={{
              axis: { stroke: "#EEF2F7" },
              tickLabels: { fontSize: 11, padding: 10, fill: "#9AA4B2" },
              grid: { stroke: "transparent" },
            }}
          />
          <VictoryAxis
            dependentAxis
            tickValues={[1, 2, 3, 4, 5]}
            style={{
              axis: { stroke: "#EEF2F7" },
              tickLabels: { fill: "transparent" },
              grid: { stroke: HEX.grid, strokeDasharray: "4,8" },
            }}
          />

          {/* Continuous line overlay */}
          <VictoryLine
            labelComponent={<View />}
            data={numericPoints5}
            interpolation="cardinal"
            style={{
              data: {
                stroke:
                  layoutWidth > 0 ? "url(#weeklyMoodLineGradient)" : "#64748B",
                strokeWidth: 2,
                strokeLinecap: "round",
              },
            }}
          />

          {/* Dots per level to avoid style functions */}
          {byLevel.Great.length > 0 && (
            <VictoryScatter
              labelComponent={<View />}
              data={byLevel.Great}
              size={5}
              style={{
                data: {
                  fill: colorForScore5(4.5),
                  stroke: "#FFFFFF",
                  strokeWidth: 2,
                },
              }}
            />
          )}
          {byLevel.Good.length > 0 && (
            <VictoryScatter
              labelComponent={<View />}
              data={byLevel.Good.map((point) => ({
                x: point.x,
                y: point.y,
              }))}
              size={5}
              style={{
                data: {
                  fill: colorForScore5(3.5),
                  stroke: "#FFFFFF",
                  strokeWidth: 2,
                },
              }}
            />
          )}
          {byLevel.Fine.length > 0 && (
            <VictoryScatter
              labelComponent={<View />}
              data={byLevel.Fine}
              size={5}
              style={{
                data: {
                  fill: colorForScore5(2.5),
                  stroke: "#FFFFFF",
                  strokeWidth: 2,
                },
              }}
            />
          )}
          {byLevel.Bad.length > 0 && (
            <VictoryScatter
              labelComponent={<View />}
              data={byLevel.Bad}
              size={5}
              style={{
                data: {
                  fill: colorForScore5(1.5),
                  stroke: "#FFFFFF",
                  strokeWidth: 2,
                },
              }}
            />
          )}
          {byLevel.Terrible.length > 0 && (
            <VictoryScatter
              labelComponent={<View />}
              data={byLevel.Terrible}
              size={5}
              style={{
                data: {
                  fill: colorForScore5(1),
                  stroke: "#FFFFFF",
                  strokeWidth: 2,
                },
              }}
            />
          )}
        </VictoryChart>
      </View>

      {/* Emoji rail on the right */}
      {layoutWidth > 0 && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            right: 10,
            top: 85,
            bottom: 50,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {(
            [
              { key: "great", bg: "#DCFCE7" },
              { key: "good", bg: "#E0F2FE" },
              { key: "fine", bg: "#FEF3C7" },
              { key: "bad", bg: "#FFEDD5" },
              { key: "terrible", bg: "#FEE2E2" },
            ] as Array<{ key: keyof typeof emotions; bg: string }>
          ).map((it) => (
            <View
              key={it.key}
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: it.bg,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 4,
              }}
            >
              <Image
                source={emotions[it.key]}
                style={{ width: 18, height: 18 }}
                resizeMode="contain"
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default WeeklyMoodChart;
