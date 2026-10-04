import React, { useMemo } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { Text } from "@/src/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
import { View } from "@/components/Themed";
import { EmotionalVolatilityData } from "@/src/network/genAi";
import { useTranslation } from "react-i18next";
import { EmotionalVolatilityContent } from "./EmotionalVolatilityContent";

interface EmotionalVolatilityIndexProps {
  data: EmotionalVolatilityData[];
  insight?: string;
  loading?: boolean;
  premium?: boolean;
}

interface VolatilityStats {
  avg: number;
  trend: "increasing" | "decreasing" | "stable";
  maxVolatility: number;
}

export const EmotionalVolatilityIndex: React.FC<EmotionalVolatilityIndexProps> = ({
  data,
  insight,
  loading = false,
  premium = false,
}) => {
  const { t } = useTranslation("insights");
  const stats = useMemo(() => {
    if (data.length === 0) return { avg: 0, trend: "stable" as const, maxVolatility: 0 };
    const midpoint = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, midpoint);
    const secondHalf = data.slice(midpoint);
    const firstAverage = firstHalf.reduce((sum, item) => sum + item.volatilityScore, 0) / firstHalf.length;
    const secondAverage = secondHalf.reduce((sum, item) => sum + item.volatilityScore, 0) / secondHalf.length;
    const trend: VolatilityStats["trend"] = secondAverage > firstAverage + 10 ? "increasing" : secondAverage < firstAverage - 10 ? "decreasing" : "stable";
    const avg = data.reduce((sum, item) => sum + item.volatilityScore, 0) / data.length;
    const maxVolatility = Math.max(...data.map((item) => item.volatilityScore));
    return { avg, trend, maxVolatility };
  }, [data]);

  if (!premium) {
    return (
      <TouchableOpacity activeOpacity={0.95}>
        <LinearGradient colors={["#7B61FF", "#9C7CFF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="rounded-2xl p-8 shadow-lg">
          <View className="items-center">
            <View className="w-20 h-20 bg-white/30 rounded-full items-center justify-center mb-5"><Feather name="activity" size={36} color="#FFF" /></View>
            <Text variant="h2" className="text-white mb-3">{t("volatility.title")}</Text>
            <Text variant="body" className="text-white/90 text-center mb-5 font-medium">{t("volatility.lockedDescription")}</Text>
            <View className="bg-white/30 px-5 py-2.5 rounded-full"><Text variant="label-bold" className="text-white">🔒 {t("chart.premiumFeature")}</Text></View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (loading) {
    return <Card variant="tile"><View className="items-center py-8"><ActivityIndicator size="large" color="#7B61FF" /><Text variant="body" className="text-gray-500 mt-4">{t("volatility.analyzing")}</Text></View></Card>;
  }

  if (data.length === 0) {
    return <View className="py-8 items-center justify-center"><Text variant="caption-muted" className="text-center font-medium">{t("volatility.empty")}</Text></View>;
  }

  return <EmotionalVolatilityContent data={data} insight={insight} stats={stats} />;
};
