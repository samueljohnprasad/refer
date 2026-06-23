import React, { useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
import { LinearGradient } from "expo-linear-gradient";
import { format } from "date-fns";
import { SkiaRadarChart, RadarDataPoint } from "./SkiaRadarChart";

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

  const radarData: RadarDataPoint[] = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((d) => ({
      label: d.emotion,
      value: d.score / 100,
    }));
  }, [data]);

  if (loading) {
    return (
      <View>
        <Text variant="body">Analyzing emotions...</Text>
      </View>
    );
  }

  // No data state
  if (!data || data?.length === 0) {
    return (
      <Card variant="tile">
        <View className="items-center justify-center py-20">
          <Text className="text-6xl mb-4">📊</Text>
          <Text variant="h3" className="mb-2">
            No Emotion Data Yet
          </Text>
          <Text variant="body" className="text-center px-4">
            Start journaling this week to see your emotional balance insights
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card variant="tile" className="w-full p-0 overflow-hidden">
      {/* Premium Badge */}
      {premium && (
        <LinearGradient
          colors={["#7B61FF", "#9C7CFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            position: "absolute",
            top: 0,
            right: 0,
            borderBottomLeftRadius: 12,
            zIndex: 10,
          }}
        >
          <Text className="text-white text-xs font-extrabold tracking-wider">
            PREMIUM
          </Text>
        </LinearGradient>
      )}

      {/* Header */}
      <View className="p-5 pb-0">
        <View className="flex-row items-center justify-between">
          <View>
            <Text variant="h2">Emotional Balance</Text>
            <Text variant="caption-muted" className="mt-1">
              {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
            </Text>
          </View>
          <View className="items-end">
            <View
              className="px-3 py-1.5 rounded-lg"
              style={{
                backgroundColor:
                  emotionalBalance.balance > 0 ? "#10B98120" : "#EF444420",
              }}
            >
              <Text
                variant="h2"
                style={{
                  color: emotionalBalance.balance > 0 ? "#10B981" : "#EF4444",
                }}
              >
                {emotionalBalance.balance > 0 ? "+" : ""}
                {emotionalBalance.balance.toFixed(0)}%
              </Text>
            </View>
            <Text variant="caption-muted" className="mt-1.5 font-medium">
              Balance Score
            </Text>
          </View>
        </View>

        {/* AI-Generated Insight Card */}
        {emotionInsight && (
          <View
            className="mt-4 p-3 rounded-2xl"
            style={{ backgroundColor: "#F0F9FF" }}
          >
            <Text variant="label-bold" className="text-blue-700 mb-1">
              🤖 AI Insight
            </Text>
            <Text variant="body" className="text-blue-600">
              {emotionInsight}
            </Text>
          </View>
        )}
      </View>

      {/* Radar Chart */}
      <View
        className="py-5"
        style={{
          backgroundColor: "#1A1A2E",
          borderRadius: 20,
          marginHorizontal: 16,
        }}
      >
        <SkiaRadarChart
          data={radarData}
          size={320}
          fillColor={premium ? "#9C7CFF" : "#6BA3FF"}
          strokeColor={premium ? "#7B61FF" : "#4A90E2"}
        />
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
              <Text
                variant="caption-muted"
                className="font-medium text-gray-700"
              >
                {emotion.emotion}: {emotion.score.toFixed(0)}%
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
};

export default EmotionRadarChart;
