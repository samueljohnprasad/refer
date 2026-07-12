import React, { useMemo } from "react";
import { Tooltip, TooltipContent, TooltipText } from "@/src/components/ui/tooltip";
import { Text } from "@/src/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
import { LifeDomainScore } from "@/src/network/genAi";
import { View } from "@/components/Themed";
import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { SkiaRadarChart, RadarDataPoint } from "./SkiaRadarChart";

interface LifeDomainBalanceWheelProps {
  data: LifeDomainScore[];
  insight?: string;
  loading?: boolean;
  premium?: boolean;
}

const domainIcons: { [key: string]: string } = {
  "Work/Career": "💼",
  Relationships: "❤️",
  Health: "🏃",
  "Personal Growth": "🌱",
  Recreation: "🎮",
  Spirituality: "🧘",
};

const domainColors: { [key: string]: string } = {
  "Work/Career": "#7B61FF",
  Relationships: "#EC4899",
  Health: "#10B981",
  "Personal Growth": "#F59E0B",
  Recreation: "#3B82F6",
  Spirituality: "#8B5CF6",
};

const trendIcons = {
  improving: "↗️",
  stable: "→",
  declining: "↘️",
};

export const LifeDomainBalanceWheel: React.FC<LifeDomainBalanceWheelProps> = ({
  data,
  insight,
  loading = false,
  premium = false,
}) => {
  const chartData: RadarDataPoint[] = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((d) => ({
      label: d.domain,
      value: d.score / 100,
    }));
  }, [data]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!data || data.length === 0)
      return {
        balanceScore: 0,
        lowestDomain: null,
        highestDomain: null,
        needsAttention: [],
      };

    const scores = data.map((d) => d.score);
    const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const variance =
      scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);

    // Balance score: higher when all domains are similar (low std deviation)
    const balanceScore = Math.max(0, 100 - stdDev * 2);

    const lowestDomain = data.reduce(
      (min, d) => (d.score < min.score ? d : min),
      data[0],
    );
    const highestDomain = data.reduce(
      (max, d) => (d.score > max.score ? d : max),
      data[0],
    );
    const needsAttention = data.filter((d) => d.attention_needed);

    return { balanceScore, lowestDomain, highestDomain, needsAttention };
  }, [data]);

  // Generate predictions for next month
  const predictions = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((d) => ({
      domain: d.domain,
      current: d.score,
      predicted:
        d.trend === "improving"
          ? Math.min(100, d.score + 10)
          : d.trend === "declining"
            ? Math.max(0, d.score - 10)
            : d.score,
      trend: d.trend,
    }));
  }, [data]);

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
              <MaterialIcons name="donut-large" size={36} color="#FFF" />
            </View>
            <Text variant="h2" className="text-white mb-3">
              Life Domain Balance Wheel
            </Text>
            <Text
              variant="body"
              className="text-white/90 text-center mb-5 font-medium"
            >
              Visualize balance across all areas of your life
            </Text>
            <View className="bg-white/30 px-5 py-2.5 rounded-full">
              <Text variant="label-bold" className="text-white">
                🔒 Premium Feature
              </Text>
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
            Analyzing life balance...
          </Text>
        </View>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card variant="tile">
        <View className="items-center py-8">
          <View className="w-16 h-16 bg-purple-100 rounded-full items-center justify-center mb-4">
            <MaterialIcons name="donut-large" size={32} color="#7B61FF" />
          </View>
          <Text variant="h3" className="mb-2">
            No Balance Data Yet
          </Text>
          <Text variant="body" className="text-center text-gray-500">
            Journal about different life areas to see your balance wheel
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card variant="tile" className="p-0 overflow-hidden">
      <View className="p-5 pb-3 bg-white">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text variant="h2">Life Domain Balance</Text>
              <Tooltip
                placement="bottom"
                trigger={(triggerProps) => (
                  <Pressable {...triggerProps} className="ml-2">
                    <Feather name="info" size={16} color="#7B61FF" />
                  </Pressable>
                )}
              >
                <TooltipContent className="max-w-xs">
                  <TooltipText className="text-white">
                    <Text className="font-bold">
                      How it's calculated:{"\n\n"}
                    </Text>
                    <Text>
                      • Balance Score: Measures how evenly distributed your
                      focus is across life domains (higher = more balanced)
                      {"\n"}
                    </Text>
                    <Text>
                      • Domain Scores (0-100): AI analyzes journal entries to
                      score each life area{"\n"}
                    </Text>
                    <Text>
                      • Trends: Tracks if each domain is improving, stable, or
                      declining{"\n"}
                    </Text>
                    <Text>
                      • Predictions: Forecasts next month's scores based on
                      current patterns{"\n\n"}
                    </Text>
                    <Text className="font-bold">
                      Helps identify neglected life areas needing attention
                    </Text>
                  </TooltipText>
                </TooltipContent>
              </Tooltip>
            </View>
            <Text variant="caption-muted" className="mt-1">
              Your life areas at a glance
            </Text>
          </View>
          <View className="items-end">
            <Text variant="h2">{stats.balanceScore.toFixed(0)}%</Text>
            <Text variant="caption-muted">Balance Score</Text>
          </View>
        </View>
      </View>

      {/* Balance Wheel Chart */}
      <View
        className="items-center py-4"
        style={{
          backgroundColor: "#1A1A2E",
          borderRadius: 20,
          marginHorizontal: 16,
        }}
      >
        <SkiaRadarChart
          data={chartData}
          size={280}
          fillColor="#9C7CFF"
          strokeColor="#7B61FF"
        />
      </View>

      {/* Domain Details */}
      <ScrollView className="px-6 pb-4 max-h-48">
        <Text variant="label-bold" className="mb-3">
          Domain Breakdown
        </Text>
        {data.map((domain, i) => (
          <View key={i} className="mb-3">
            <View className="flex-row items-center justify-between mb-1">
              <View className="flex-row items-center flex-1">
                <Text variant="body" className="text-lg mr-2">
                  {domainIcons[domain.domain]}
                </Text>
                <Text variant="body" className="font-medium">
                  {domain.domain}
                </Text>
                <Text variant="body" className="ml-2">
                  {trendIcons[domain.trend]}
                </Text>
                {domain.attention_needed && (
                  <View className="ml-2 bg-red-100 px-2 py-0.5 rounded-full">
                    <Text
                      variant="caption-muted"
                      className="text-red-700 font-medium"
                    >
                      Needs Attention
                    </Text>
                  </View>
                )}
              </View>
              <Text variant="label-bold">{domain.score}%</Text>
            </View>
            <View className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${domain.score}%`,
                  backgroundColor: domainColors[domain.domain],
                }}
              />
            </View>
            {domain.insights && (
              <Text variant="caption-muted" className="mt-1">
                {domain.insights}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Key Insights */}
      <View className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <Text variant="label-bold" className="mb-2">
          Key Insights
        </Text>
        <View className="space-y-2">
          {stats.lowestDomain && (
            <View className="flex-row items-start">
              <View className="w-2 h-2 bg-red-400 rounded-full mt-1.5 mr-2" />
              <Text variant="body" className="flex-1">
                <Text variant="label-bold">{stats.lowestDomain.domain}</Text>{" "}
                needs the most attention ({stats.lowestDomain.score}%)
              </Text>
            </View>
          )}
          {stats.highestDomain && (
            <View className="flex-row items-start">
              <View className="w-2 h-2 bg-green-400 rounded-full mt-1.5 mr-2" />
              <Text variant="body" className="flex-1">
                <Text variant="label-bold">{stats.highestDomain.domain}</Text>{" "}
                is your strongest area ({stats.highestDomain.score}%)
              </Text>
            </View>
          )}
          {stats.needsAttention.length > 1 && (
            <View className="flex-row items-start">
              <View className="w-2 h-2 bg-orange-400 rounded-full mt-1.5 mr-2" />
              <Text variant="body" className="flex-1">
                {stats.needsAttention.length} domains need immediate attention
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* AI Insight */}
      {insight && (
        <View className="px-6 py-4 bg-purple-50 border-t border-purple-100">
          <View className="flex-row items-start">
            <Text variant="body" className="text-lg mr-2">
              🎯
            </Text>
            <View className="flex-1">
              <Text variant="label-bold" className="text-purple-900 mb-1">
                Balance Recommendation
              </Text>
              <Text variant="body" className="text-purple-700">
                {insight}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Predicted Changes */}
      <View className="px-6 py-4 border-t border-gray-100">
        <Text variant="label-bold" className="mb-2">
          Next Month Prediction
        </Text>
        <View className="bg-sage-50 rounded-lg p-3">
          <View className="flex-row flex-wrap">
            {predictions.map((pred, i) => (
              <View key={i} className="flex-row items-center mr-4 mb-2">
                <Text
                  variant="caption-muted"
                  className="font-medium text-gray-700"
                >
                  {pred.domain.split("/")[0]}:
                </Text>
                <View className="flex-row items-center ml-1">
                  {pred.trend === "improving" ? (
                    <Feather name="trending-up" size={12} color="#10B981" />
                  ) : pred.trend === "declining" ? (
                    <Feather name="trending-down" size={12} color="#EF4444" />
                  ) : (
                    <Feather name="minus" size={12} color="#6B7280" />
                  )}
                  <Text variant="caption-muted" className="ml-1 font-semibold">
                    {pred.predicted}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Card>
  );
};
