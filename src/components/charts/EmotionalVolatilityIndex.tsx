import React, { useMemo } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { Tooltip, TooltipContent, TooltipText } from "@/src/components/ui/tooltip";
import { Text } from "@/src/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
import { CartesianChart, Line, Area } from "victory-native-v4";
import { Circle, useFont } from "@shopify/react-native-skia";
import { format, parseISO } from "date-fns";
import { EmotionalVolatilityData } from "@/src/network/genAi";
import { Platform } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

interface EmotionalVolatilityIndexProps {
  data: EmotionalVolatilityData[];
  insight?: string;
  loading?: boolean;
  premium?: boolean;
}

const stabilityColors = {
  stable: "#10B981",
  moderate: "#F59E0B",
  volatile: "#EF4444",
  highly_volatile: "#991B1B",
};

const stabilityGradients = {
  stable: ["#10B981", "#059669"],
  moderate: ["#F59E0B", "#D97706"],
  volatile: ["#EF4444", "#DC2626"],
  highly_volatile: ["#991B1B", "#7F1D1D"],
};

export const EmotionalVolatilityIndex: React.FC<
  EmotionalVolatilityIndexProps
> = ({ data, insight, loading = false, premium = false }) => {
  // Load font for axis labels
  const font = useFont(require("@/assets/fonts/SpaceMono-Regular.ttf"), 10);
  // Process data for visualization
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((d, index) => ({
      x: index,
      y: d.volatilityScore,
      date: parseISO(d.date),
      label: `${d.volatilityScore}`,
      stability: d.stability,
      triggers: d.triggers,
      swings: d.moodSwings,
      range: d.emotionalRange,
    }));
  }, [data]);

  // Calculate average volatility and trend
  const stats = useMemo(() => {
    if (!data || data.length === 0)
      return { avg: 0, trend: "stable", maxVolatility: 0 };

    const avgVolatility =
      data.reduce((sum, d) => sum + d.volatilityScore, 0) / data.length;
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));

    const firstAvg =
      firstHalf.reduce((sum, d) => sum + d.volatilityScore, 0) /
      firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, d) => sum + d.volatilityScore, 0) /
      secondHalf.length;

    const trend =
      secondAvg > firstAvg + 10
        ? "increasing"
        : secondAvg < firstAvg - 10
        ? "decreasing"
        : "stable";

    const maxVolatility = Math.max(...data.map((d) => d.volatilityScore));

    return { avg: avgVolatility, trend, maxVolatility };
  }, [data]);

  // Get stability zones for background
  const stabilityZones = [
    { y0: 0, y1: 25, color: "rgba(16, 185, 129, 0.1)", label: "Stable" },
    { y0: 25, y1: 50, color: "rgba(245, 158, 11, 0.1)", label: "Moderate" },
    { y0: 50, y1: 75, color: "rgba(239, 68, 68, 0.1)", label: "Volatile" },
    {
      y0: 75,
      y1: 100,
      color: "rgba(153, 27, 27, 0.1)",
      label: "Highly Volatile",
    },
  ];

  if (!premium) {
    return (
      <TouchableOpacity activeOpacity={0.95}>
        <LinearGradient
          colors={["#7B61FF", "#9C7CFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl p-8 shadow-lg"
        >
          <View className="items-center">
            <View className="w-20 h-20 bg-white/30 rounded-full items-center justify-center mb-5">
              <Feather name="activity" size={36} color="#FFF" />
            </View>
            <Text variant="h2" className="text-white mb-3">
              Emotional Volatility Index
            </Text>
            <Text variant="body" className="text-white/90 text-center mb-5 font-medium">
              Track your emotional stability patterns and identify triggers
            </Text>
            <View className="bg-white/30 px-5 py-2.5 rounded-full">
              <Text variant="label-bold" className="text-white">🔒 Premium Feature</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (loading) {
    return (
      <Card variant="tile">
        <View className="items-center py-8">
          <ActivityIndicator size="large" color="#7B61FF" />
          <Text variant="body" className="text-gray-500 mt-4">
            Analyzing emotional patterns...
          </Text>
        </View>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View className="py-8 items-center justify-center">
        <Text variant="caption-muted" className="text-center font-medium">
          No volatility data yet.{"\n"}Start journaling consistently to see patterns.
        </Text>
      </View>
    );
  }

  return (
    <Card variant="tile" className="p-0 overflow-hidden">
      {/* Header */}
      <View className="p-5 pb-3 bg-white">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text variant="h2">
                Emotional Volatility Index
              </Text>
              <Tooltip
                placement="top"
                trigger={(triggerProps) => (
                  <Pressable {...triggerProps} className="ml-2">
                    <Feather name="info" size={16} color="#7B61FF" />
                  </Pressable>
                )}
              >
                <TooltipContent className="max-w-xs z-50">
                  <TooltipText className="text-white">
                    <Text className="font-bold">
                      How it's calculated:{"\n\n"}
                    </Text>
                    <Text>
                      • Volatility Score (0-100): Measures emotional fluctuation
                      intensity{"\n"}
                    </Text>
                    <Text>
                      • Mood Swings: Counts significant emotional shifts per day
                      {"\n"}
                    </Text>
                    <Text>
                      • Emotional Range: Difference between highest and lowest
                      moods{"\n"}
                    </Text>
                    <Text>
                      • Stability Zones: Green (0-25), Yellow (25-50), Orange
                      (50-75), Red (75-100){"\n\n"}
                    </Text>
                    <Text className="font-bold">
                      Lower scores = More emotional stability
                    </Text>
                  </TooltipText>
                </TooltipContent>
              </Tooltip>
            </View>
            <Text variant="caption-muted" className="mt-1">
              Your emotional stability over time
            </Text>
          </View>
          <View className="items-end">
            <Text variant="h2">
              {stats.avg.toFixed(0)}
            </Text>
            <Text variant="caption-muted">Avg Score</Text>
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <View className="flex-row justify-around px-5 py-3 bg-gray-50 border-y border-gray-100">
        <View className="items-center flex-1">
          <View className="flex-row items-center">
            {stats.trend === "increasing" ? (
              <Feather name="trending-up" size={16} color="#EF4444" />
            ) : stats.trend === "decreasing" ? (
              <Feather name="trending-down" size={16} color="#10B981" />
            ) : (
              <Feather name="minus" size={16} color="#F59E0B" />
            )}
            <Text variant="label-bold" className="ml-1">
              {stats.trend === "increasing"
                ? "Rising"
                : stats.trend === "decreasing"
                ? "Improving"
                : "Stable"}
            </Text>
          </View>
          <Text variant="caption-muted" className="mt-1">Trend</Text>
        </View>

        <View className="w-px bg-gray-300" />

        <View className="items-center flex-1">
          <Text variant="label-bold" className="capitalize">
            {data[data.length - 1]?.stability.replace("_", " ") || "Unknown"}
          </Text>
          <Text variant="caption-muted" className="mt-1">Current State</Text>
        </View>

        <View className="w-px bg-gray-300" />

        <View className="items-center flex-1">
          <Text variant="label-bold">
            {stats.maxVolatility}
          </Text>
          <Text variant="caption-muted" className="mt-1">Peak Score</Text>
        </View>
      </View>

      {/* Chart */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="bg-white">
        <View className="py-3" style={{ width: Math.max(screenWidth, chartData.length * 90), paddingHorizontal: 20, height: 280 }}>
          {!font ? (
            <View className="items-center justify-center flex-1">
              <ActivityIndicator size="small" color="#7B61FF" />
              <Text variant="caption-muted" className="mt-2">Loading chart...</Text>
            </View>
          ) : chartData.length > 0 ? (
            <CartesianChart
              data={chartData}
              xKey="x"
              yKeys={["y"]}
              domainPadding={{ left: 50, right: 50, top: 30, bottom: 50 }}
              axisOptions={{
                font,
                tickCount: { x: chartData.length, y: 5 },
                formatXLabel: (value: number) => {
                  const dataPoint = chartData[Math.round(value)];
                  return dataPoint ? format(dataPoint.date, "MMM d") : "";
                },
                formatYLabel: (value: number) => `${Math.round(value)}`,
                labelColor: "#6B7280",
                labelPosition: { x: "outset", y: "outset" },
                axisSide: { x: "bottom", y: "left" },
              }}
            >
            {({ points, chartBounds }: any) => (
              <>
                {/* Stability zones background */}
                {stabilityZones.map((zone, i) => (
                  <Area
                    key={`zone-${i}`}
                    points={[
                      { x: chartBounds.left, y: chartBounds.bottom - (chartBounds.bottom - chartBounds.top) * zone.y0 / 100 },
                      { x: chartBounds.right, y: chartBounds.bottom - (chartBounds.bottom - chartBounds.top) * zone.y0 / 100 },
                      { x: chartBounds.right, y: chartBounds.bottom - (chartBounds.bottom - chartBounds.top) * zone.y1 / 100 },
                      { x: chartBounds.left, y: chartBounds.bottom - (chartBounds.bottom - chartBounds.top) * zone.y1 / 100 },
                    ]}
                    color={zone.color}
                    opacity={1}
                  />
                ))}
                
                {/* Main area chart */}
                <Area
                  points={points.y}
                  y0={chartBounds.bottom}
                  color="#7B61FF"
                  opacity={0.3}
                  curveType="catmullRom"
                />
                
                {/* Line chart */}
                <Line
                  points={points.y}
                  color="#7B61FF"
                  strokeWidth={2}
                  curveType="catmullRom"
                />
                
                {/* Data points */}
                {points.y.map((point: any, index: number) => {
                  const datum = chartData[index];
                  const pointColor = stabilityColors[datum.stability as keyof typeof stabilityColors] || "#6B7280";
                  const pointSize = datum.y > 75 ? 6 : datum.y > 50 ? 5 : 4;
                  
                  return (
                    <React.Fragment key={`point-${index}`}>
                      {/* White stroke */}
                      <Circle
                        cx={point.x}
                        cy={point.y}
                        r={pointSize + 1}
                        color="white"
                      />
                      {/* Colored fill */}
                      <Circle
                        cx={point.x}
                        cy={point.y}
                        r={pointSize}
                        color={pointColor}
                      />
                    </React.Fragment>
                  );
                })}
              </>
            )}
            </CartesianChart>
          ) : null}
        </View>
      </ScrollView>

      {/* Legend */}
      <View className="px-5 py-3 bg-white border-t border-gray-100">
        <View className="flex-row flex-wrap justify-center gap-3">
          {Object.entries(stabilityColors).map(([key, color]) => (
            <View key={key} className="flex-row items-center">
              <View
                style={{ backgroundColor: color }}
                className="w-2.5 h-2.5 rounded-full mr-1.5"
              />
              <Text variant="caption-muted" className="capitalize">
                {key.replace("_", " ")}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* AI Insight */}
      {insight && (
        <View className="px-5 py-3 bg-purple-50 border-t border-gray-100">
          <View className="flex-row items-start">
            <Text className="text-lg mr-2">💡</Text>
            <View className="flex-1">
              <Text variant="label-bold" className="text-purple-900 mb-1">
                AI Insight
              </Text>
              <Text variant="body" className="text-purple-700">
                {insight}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Top Triggers */}
      {data &&
        data.length > 0 &&
        Array.from(new Set(data.flatMap((d) => d.triggers))).length > 0 && (
          <View className="px-5 py-3 bg-white border-t border-gray-100">
            <Text variant="label-bold" className="mb-2">
              Common Volatility Triggers
            </Text>
            <View>
              {Array.from(new Set(data.flatMap((d) => d.triggers)))
                .slice(0, 3)
                .map((trigger, i) => (
                  <View key={i} className="flex-row items-center mb-1.5">
                    <View className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2" />
                    <Text variant="body" className="flex-1">
                      {trigger}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        )}
    </Card>
  );
};
