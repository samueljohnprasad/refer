import React, { useMemo } from "react";
import { Tooltip, TooltipContent, TooltipText } from "@/src/components/ui/tooltip";
import { Text } from "@/src/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
import { LifeDomainScore } from "@/src/network/genAi";
import { View } from "@/components/Themed";
import { Pressable, TouchableOpacity, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SkiaRadarChart, RadarDataPoint } from "./SkiaRadarChart";
import { useTranslation } from "react-i18next";
import { LifeDomainBalanceLocked } from "./LifeDomainBalanceLocked";
import { LifeDomainBalanceDetails, translateLifeDomain } from "./LifeDomainBalanceDetails";

interface LifeDomainBalanceWheelProps {
  data: LifeDomainScore[];
  insight?: string;
  loading?: boolean;
  premium?: boolean;
}

export const LifeDomainBalanceWheel: React.FC<LifeDomainBalanceWheelProps> = ({
  data,
  insight,
  loading = false,
  premium = false,
}) => {
  const { t } = useTranslation("insights");
  const chartData: RadarDataPoint[] = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((d) => ({
      label: translateLifeDomain(t, d.domain),
      value: d.score / 100,
    }));
  }, [data, t]);

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
        <LifeDomainBalanceLocked />
      </TouchableOpacity>
    );
  }

  if (loading) {
    return (
      <Card variant="tile">
        <View className="items-center py-8">
          <ActivityIndicator size="large" color="#7B61FF" />
          <Text variant="body" className="text-gray-500 mt-4">
            {t("lifeBalance.analyzing")}
          </Text>
        </View>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View className="py-8 items-center justify-center">
        <Text variant="caption-muted" className="text-center font-medium">
          {t("lifeBalance.empty")}
        </Text>
      </View>
    );
  }

  return (
    <Card variant="tile" className="p-0 overflow-hidden">
      <View className="p-5 pb-3 bg-white">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text variant="h2">{t("lifeBalance.title")}</Text>
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
                      {t("lifeBalance.howCalculated")}:{"\n\n"}
                    </Text>
                    <Text>
                      • {t("lifeBalance.balanceScore")}: {t("lifeBalance.balanceScoreHelp")}
                      {"\n"}
                    </Text>
                    <Text>
                      • {t("lifeBalance.domainScores")}: {t("lifeBalance.domainScoresHelp")}{"\n"}
                    </Text>
                    <Text>
                      • {t("lifeBalance.trends")}: {t("lifeBalance.trendsHelp")}{"\n"}
                    </Text>
                    <Text>
                      • {t("lifeBalance.predictions")}: {t("lifeBalance.predictionsHelp")}{"\n\n"}
                    </Text>
                    <Text className="font-bold">
                      {t("lifeBalance.helpsIdentify")}
                    </Text>
                  </TooltipText>
                </TooltipContent>
              </Tooltip>
            </View>
            <Text variant="caption-muted" className="mt-1">
              {t("lifeBalance.atAGlance")}
            </Text>
          </View>
          <View className="items-end">
            <Text variant="h2">{stats.balanceScore.toFixed(0)}%</Text>
            <Text variant="caption-muted">{t("lifeBalance.balanceScore")}</Text>
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

      <LifeDomainBalanceDetails
        data={data}
        predictions={predictions}
        lowestDomain={stats.lowestDomain}
        highestDomain={stats.highestDomain}
        needsAttentionCount={stats.needsAttention.length}
        insight={insight}
      />
    </Card>
  );
};
