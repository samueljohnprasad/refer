import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { LinearGradient } from "expo-linear-gradient";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ChartHistogramIcon, StarIcon } from "@hugeicons/core-free-icons";
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
          <View className="flex-row items-center gap-2">
            <View className="w-8 h-8 rounded-full bg-purple-50 items-center justify-center">
              <HugeiconsIcon
                icon={ChartHistogramIcon}
                size={18}
                color="#7B61FF"
              />
            </View>
            <Text
              style={{
                fontSize: 22,
                fontFamily: "CormorantSemiBold",
                color: "#1f2937",
                letterSpacing: -0.5,
              }}
            >
              Advanced Analytics
            </Text>
          </View>
          {showPremiumBadge && (
            <Pressable
              className="rounded-xl overflow-hidden active:opacity-80"
              onPress={onPremiumPress}
            >
              <LinearGradient
                colors={["#7B61FF", "#9C7CFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  gap: 6,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <HugeiconsIcon
                  icon={StarIcon}
                  size={14}
                  color="#FFF"
                  fill="#FFF"
                />
                <Text className="text-xs font-extrabold text-white tracking-widest">
                  PREMIUM
                </Text>
              </LinearGradient>
            </Pressable>
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
