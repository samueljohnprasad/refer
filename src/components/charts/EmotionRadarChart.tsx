import React, { useMemo } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import {
  VictoryChart,
  VictoryTheme,
  VictoryPolarAxis,
  VictoryArea,
} from "victory-native";
import { LinearGradient } from "expo-linear-gradient";
import { format } from "date-fns";

interface EmotionData {
  emotion: string;
  score: number; // 0-100
  count: number;
}

interface EmotionRadarChartProps {
  startDate: Date;
  endDate: Date;
  data?: EmotionData[];
  emotionInsight?: string;
  loading?: boolean;
  premium?: boolean;
}

// 8 key emotional dimensions for comprehensive analysis
const EMOTION_DIMENSIONS = [
  "Joy",
  "Gratitude",
  "Confidence",
  "Peace",
  "Anxiety",
  "Sadness",
  "Anger",
  "Fear",
];

const CHART_COLORS = {
  positive: ["#10B981", "#34D399"],
  negative: ["#EF4444", "#F87171"],
  neutral: ["#6B7280", "#9CA3AF"],
  premium: ["#7B61FF", "#9C7CFF"],
};

export const EmotionRadarChart: React.FC<EmotionRadarChartProps> = ({
  startDate,
  endDate,
  data,
  emotionInsight,
  loading = false,
  premium = false,
}) => {
  console.log("EmotionRadarChart", data, data?.length, loading);

  // Calculate emotional balance score
  const emotionalBalance = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        positive: 0,
        negative: 0,
        balance: 0,
      };
    }

    const positiveEmotions = ["Joy", "Gratitude", "Confidence", "Peace"];
    const positiveScore =
      data
        .filter((d) => positiveEmotions.includes(d.emotion))
        .reduce((sum, d) => sum + d.score, 0) / 4;

    const negativeScore =
      data
        .filter((d) => !positiveEmotions.includes(d.emotion))
        .reduce((sum, d) => sum + d.score, 0) / 4;

    return {
      positive: positiveScore,
      negative: negativeScore,
      balance: positiveScore - negativeScore,
    };
  }, [data]);

  // Prepare data for Victory chart
  const radarData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((d) => ({
      x: d.emotion,
      y: d.score / 100, // Normalize to 0-1 for radar chart
    }));
  }, [data]);

  const maxValue = 1;

  if (loading) {
    return (
      <View>
        <Text>Analyzing emotions...</Text>
      </View>
    );
  }

  // No data state
  if (!data || data?.length === 0) {
    return (
      <View className="w-full rounded-3xl bg-white p-6 border border-gray-200">
        <View className="items-center justify-center py-20">
          <Text className="text-6xl mb-4">📊</Text>
          <Text className="text-lg font-bold text-gray-800 mb-2">
            No Emotion Data Yet
          </Text>
          <Text className="text-sm text-gray-500 text-center px-4">
            Start journaling this week to see your emotional balance insights
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="w-full rounded-3xl bg-white border border-gray-200 overflow-hidden">
      {/* Premium Badge */}
      {premium && (
        <LinearGradient
          colors={CHART_COLORS.premium}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            position: "absolute",
            top: 0,
            right: 0,
            borderBottomLeftRadius: 12,
            zIndex: 10,
          }}
        >
          <Text className="text-white text-xs font-bold">PREMIUM</Text>
        </LinearGradient>
      )}

      {/* Header */}
      <View className="p-5 pb-0">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-extrabold text-gray-800">
              Emotional Balance
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
            </Text>
          </View>
          <View className="items-end">
            <Text
              className="text-2xl font-extrabold"
              style={{
                color: emotionalBalance.balance > 0 ? "#10B981" : "#EF4444",
              }}
            >
              {emotionalBalance.balance > 0 ? "+" : ""}
              {emotionalBalance.balance.toFixed(0)}%
            </Text>
            <Text className="text-xs text-gray-500">Balance Score</Text>
          </View>
        </View>

        {/* AI-Generated Insight Card */}
        {emotionInsight && (
          <View
            className="mt-4 p-3 rounded-2xl"
            style={{ backgroundColor: "#F0F9FF" }}
          >
            <Text className="text-sm font-semibold text-blue-700 mb-1">
              🤖 AI Insight
            </Text>
            <Text className="text-xs text-blue-600 leading-5">
              {emotionInsight}
            </Text>
          </View>
        )}
      </View>

      {/* Radar Chart */}
      <View className="pb-5 pt-5">
        <VictoryChart
          polar
          theme={VictoryTheme.material}
          domain={{ y: [0, maxValue] }}
          width={380}
          height={380}
          padding={{ top: 40, bottom: 40, left: 40, right: 40 }}
        >
          <VictoryPolarAxis
            dependentAxis
            style={{
              axis: { stroke: "none" },
              grid: {
                stroke: "#E5E7EB",
                strokeDasharray: "2,4",
                opacity: 0.5,
              },
              tickLabels: { fill: "transparent" },
            }}
            tickValues={[0.2, 0.4, 0.6, 0.8, 1]}
          />

          <VictoryPolarAxis
            style={{
              axis: { stroke: "none" },
              grid: { stroke: "#E5E7EB", strokeWidth: 0.5 },
              tickLabels: {
                fontSize: 12,
                fill: "#374151",
                fontWeight: "600",
                textAnchor: "middle",
              },
            }}
          />

          <VictoryArea
            data={radarData}
            style={{
              data: {
                fill: premium
                  ? "rgba(123, 97, 255, 0.3)"
                  : "rgba(16, 185, 129, 0.3)",
                stroke: premium ? "#7B61FF" : "#10B981",
                strokeWidth: 2,
              },
            }}
            interpolation="linear"
            animate={{
              duration: 1000,
              onLoad: { duration: 500 },
            }}
          />
        </VictoryChart>
      </View>

      {/* Emotion Pills */}
      <View className="px-5 pb-5">
        <View className="flex-row flex-wrap gap-2">
          {data.map((emotion) => (
            <View
              key={emotion.emotion}
              className="px-3 py-2 rounded-full flex-row items-center"
              style={{
                backgroundColor: [
                  "Joy",
                  "Gratitude",
                  "Confidence",
                  "Peace",
                ].includes(emotion.emotion)
                  ? "#DCFCE7"
                  : "#FEE2E2",
              }}
            >
              <View
                className="w-2 h-2 rounded-full mr-2"
                style={{
                  backgroundColor: [
                    "Joy",
                    "Gratitude",
                    "Confidence",
                    "Peace",
                  ].includes(emotion.emotion)
                    ? "#10B981"
                    : "#EF4444",
                }}
              />
              <Text className="text-xs font-medium text-gray-700">
                {emotion.emotion}: {emotion.score.toFixed(0)}%
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default EmotionRadarChart;
