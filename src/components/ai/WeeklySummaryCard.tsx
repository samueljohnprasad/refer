import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ChartHistogramIcon,
  ArrowRight01Icon,
  SparklesIcon,
  Target03Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import type { WeeklySummary } from "@/src/network/genAi";

interface WeeklySummaryCardProps {
  weeklySummary: WeeklySummary | null;
  showTitle?: boolean;
}

/**
 * Reusable Weekly Summary Card Component
 * Displays mood trend, emotions, highlights, motivational message, and next week focus
 */
export const WeeklySummaryCard: React.FC<WeeklySummaryCardProps> = ({
  weeklySummary,
  showTitle = true,
}) => {
  if (!weeklySummary) return null;

  const getTrendIcon = () => {
    if (weeklySummary.moodTrend === "improving") return ArrowRight01Icon;
    if (weeklySummary.moodTrend === "declining") return ArrowRight01Icon;
    return ArrowRight01Icon;
  };

  const getTrendColor = () => {
    if (weeklySummary.moodTrend === "improving") return "#10B981";
    if (weeklySummary.moodTrend === "declining") return "#EF4444";
    return "#F59E0B";
  };

  return (
    <View className="mb-6">
      {showTitle && (
        <View className="flex-row items-center gap-2 mb-4">
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
            Weekly Summary
          </Text>
        </View>
      )}
      <View className="bg-white rounded-2xl p-5 border border-gray-100">
        {/* Mood Trend */}
        <View className="flex-row items-center mb-4">
          <Text className="text-base font-semibold text-gray-700 mr-3">
            Mood Trend:
          </Text>
          <View
            className="px-3 py-1.5 rounded-full flex-row items-center gap-1.5"
            style={{ backgroundColor: `${getTrendColor()}15` }}
          >
            <HugeiconsIcon
              icon={getTrendIcon()}
              size={14}
              color={getTrendColor()}
            />
            <Text
              className="text-xs font-bold capitalize"
              style={{ color: getTrendColor() }}
            >
              {weeklySummary.moodTrend}
            </Text>
          </View>
        </View>

        {/* Top Emotions */}
        {weeklySummary?.topEmotions &&
          Array.isArray(weeklySummary.topEmotions) &&
          weeklySummary.topEmotions.length > 0 && (
            <View className="mb-4">
              <Text className="text-base font-bold text-slate-900 mb-2.5">
                Top Emotions
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {weeklySummary.topEmotions.map((emotion, idx) => (
                  <View
                    key={idx}
                    className="bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100"
                  >
                    <Text className="text-xs text-purple-700 font-semibold">
                      {emotion}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

        {/* Key Highlights */}
        {weeklySummary?.keyHighlights &&
          Array.isArray(weeklySummary.keyHighlights) &&
          weeklySummary.keyHighlights.length > 0 && (
            <View className="mb-4">
              <View className="flex-row items-center gap-2 mb-2.5">
                <HugeiconsIcon icon={SparklesIcon} size={16} color="#7B61FF" />
                <Text className="text-base font-bold text-slate-900">
                  Key Highlights
                </Text>
              </View>
              {weeklySummary.keyHighlights.map((highlight, idx) => (
                <Text
                  key={idx}
                  className="text-sm text-gray-700 mb-1.5 leading-5 pl-1"
                >
                  • {highlight}
                </Text>
              ))}
            </View>
          )}

        {/* Motivational Message */}
        {weeklySummary.motivationalMessage && (
          <View className="bg-purple-50 rounded-xl p-4 flex-row items-start gap-3 mt-2 border border-purple-100">
            <View className="w-8 h-8 rounded-full bg-purple-100 items-center justify-center">
              <HugeiconsIcon icon={StarIcon} size={18} color="#7B61FF" />
            </View>
            <Text className="flex-1 text-sm text-slate-900 leading-5 font-medium">
              {weeklySummary.motivationalMessage}
            </Text>
          </View>
        )}

        {/* Next Week Focus */}
        {weeklySummary?.nextWeekFocus &&
          Array.isArray(weeklySummary.nextWeekFocus) &&
          weeklySummary.nextWeekFocus.length > 0 && (
            <View className="mt-4">
              <View className="flex-row items-center gap-2 mb-2.5">
                <HugeiconsIcon icon={Target03Icon} size={16} color="#7B61FF" />
                <Text className="text-base font-bold text-slate-900">
                  Next Week Focus
                </Text>
              </View>
              {weeklySummary.nextWeekFocus.map((focus, idx) => (
                <Text
                  key={idx}
                  className="text-sm text-gray-700 mb-1.5 leading-5 pl-1"
                >
                  • {focus}
                </Text>
              ))}
            </View>
          )}
      </View>
    </View>
  );
};
