import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { subWeeks } from "date-fns";
import type { WeeklySummary } from "@/src/network/genAi";
import { EmotionRadarChart } from "@/src/components/charts/EmotionRadarChart";
import { EmotionalVolatilityIndex } from "@/src/components/charts/EmotionalVolatilityIndex";
import { CognitivePatternFlow } from "@/src/components/charts/CognitivePatternFlow";
import { LifeDomainBalanceWheel } from "@/src/components/charts/LifeDomainBalanceWheel";

interface AdvancedAnalyticsChartsProps {
  weeklySummary: WeeklySummary | null;
  loading?: boolean;
  showPremiumBadge?: boolean;
  showTitle?: boolean;
  onPremiumPress?: () => void;
}

/**
 * Reusable Advanced Analytics Charts Component
 * Displays all premium AI-powered visualization charts
 */
export const AdvancedAnalyticsCharts: React.FC<
  AdvancedAnalyticsChartsProps
> = ({
  weeklySummary,
  loading = false,
  showPremiumBadge = true,
  showTitle = true,
  onPremiumPress,
}) => {
  return (
    <View className="mb-10">
      {/* Header with Premium Badge */}
      {showTitle && (
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-[22px] font-extrabold text-[#0F172A] tracking-wide">
            📊 Advanced Analytics
          </Text>
          {showPremiumBadge && (
            <TouchableOpacity
              className="rounded-xl overflow-hidden shadow-md"
              onPress={
                onPremiumPress || (() => console.log("Show premium modal"))
              }
            >
              <LinearGradient
                colors={["#7B61FF", "#9C7CFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  gap: 8,
                  flexDirection: "row",
                }}
              >
                <Feather name="star" size={14} color="#FFF" />
                <Text className="text-xs font-extrabold text-white tracking-widest">
                  PREMIUM
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Emotional Balance Radar Chart */}
      <View className="mb-6">
        <EmotionRadarChart
          startDate={subWeeks(new Date(), 4)}
          endDate={new Date()}
          data={weeklySummary?.emotionRadarData || []}
          emotionInsight={weeklySummary?.emotionInsight}
          loading={loading}
          premium={true}
        />
      </View>

      {/* Emotional Volatility Index */}
      <View className="mb-6">
        <EmotionalVolatilityIndex
          data={weeklySummary?.emotionalVolatility || []}
          insight={weeklySummary?.volatilityInsight}
          loading={loading}
          premium={true}
        />
      </View>

      {/* Cognitive Pattern Flow */}
      <View className="mb-6">
        <CognitivePatternFlow
          data={weeklySummary?.cognitivePatterns || []}
          insight={weeklySummary?.cognitiveInsight}
          loading={loading}
          premium={true}
        />
      </View>

      {/* Life Domain Balance Wheel */}
      <View className="mb-6">
        <LifeDomainBalanceWheel
          data={weeklySummary?.lifeDomainBalance || []}
          insight={weeklySummary?.lifeDomainInsight}
          loading={loading}
          premium={true}
        />
      </View>
    </View>
  );
};
