import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Target03Icon,
  Leaf01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import type {
  AIRecommendation,
  WeeklySummary,
  GrowthInsight,
} from "@/src/network/genAi";

interface AIInsightsContentProps {
  loading?: boolean;
  weeklySummary: WeeklySummary | null;
  recommendations: AIRecommendation[];
  growthInsights: GrowthInsight[];
}

const priorityColors: Record<string, string> = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#10B981",
};

/**
 * Presentational component for AI insights content
 * Displays weekly summary, recommendations, and growth insights
 */
export const AIInsightsContent: React.FC<AIInsightsContentProps> = ({
  loading = false,
  weeklySummary,
  recommendations,
  growthInsights,
}) => {
  if (loading) {
    return (
      <View className="py-12 items-center">
        <ActivityIndicator size="large" color="#7B61FF" />
        <Text className="mt-4 text-base text-gray-500">
          Loading insights...
        </Text>
      </View>
    );
  }

  return (
    <>
      {/* Weekly Summary */}
      {weeklySummary && (
        <View className="mb-6">
          <Text className="text-xl font-bold text-slate-900 mb-4">
            📊 Weekly Summary
          </Text>
          <View className="bg-gray-50 rounded-2xl p-5">
            {/* Mood Trend */}
            <View className="flex-row items-center mb-4">
              <Text className="text-base font-semibold text-gray-700 mr-3">
                Mood Trend:
              </Text>
              <View
                className={`px-3 py-1.5 rounded-full ${
                  weeklySummary.moodTrend === "improving"
                    ? "bg-emerald-500"
                    : weeklySummary.moodTrend === "declining"
                    ? "bg-red-500"
                    : "bg-amber-500"
                }`}
              >
                <Text className="text-xs font-bold text-white capitalize">
                  {weeklySummary.moodTrend === "improving"
                    ? "📈"
                    : weeklySummary.moodTrend === "declining"
                    ? "📉"
                    : "➡️"}{" "}
                  {weeklySummary.moodTrend}
                </Text>
              </View>
            </View>

            {/* Top Emotions */}
            {weeklySummary.topEmotions &&
              weeklySummary.topEmotions.length > 0 && (
                <View className="mb-4">
                  <Text className="text-base font-bold text-slate-900 mb-2.5">
                    Top Emotions
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {weeklySummary.topEmotions.map((emotion, idx) => (
                      <View
                        key={idx}
                        className="bg-gray-300 px-3 py-1.5 rounded-full"
                      >
                        <Text className="text-xs text-gray-700 font-medium">
                          {emotion}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

            {/* Key Highlights */}
            {weeklySummary.keyHighlights &&
              weeklySummary.keyHighlights.length > 0 && (
                <View className="mb-4">
                  <Text className="text-base font-bold text-slate-900 mb-2.5">
                    ✨ Key Highlights
                  </Text>
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
              <View className="bg-yellow-50 rounded-lg p-4 flex-row items-start mt-2">
                <Text className="text-2xl mr-3 mt-0.5">💪</Text>
                <Text className="flex-1 text-sm text-slate-900 leading-5 font-medium">
                  {weeklySummary.motivationalMessage}
                </Text>
              </View>
            )}

            {/* Next Week Focus */}
            {weeklySummary.nextWeekFocus &&
              weeklySummary.nextWeekFocus.length > 0 && (
                <View className="mb-4">
                  <Text className="text-base font-bold text-slate-900 mb-2.5">
                    🎯 Next Week Focus
                  </Text>
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
      )}

      {/* Recommendations */}
      {!!recommendations.length && (
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-4">
            <View className="w-8 h-8 rounded-full bg-purple-50 items-center justify-center">
              <HugeiconsIcon icon={Target03Icon} size={18} color="#7B61FF" />
            </View>
            <Text
              style={{
                fontSize: 22,
                fontFamily: "CormorantSemiBold",
                color: "#1f2937",
                letterSpacing: -0.5,
              }}
            >
              Personalized Recommendations
            </Text>
          </View>
          {recommendations.map((rec, index) => (
            <View
              key={index}
              className="bg-white rounded-2xl p-4 mb-3 border border-gray-200"
            >
              <View className="flex-row justify-between items-start mb-3 gap-2">
                <Text className="text-base font-bold text-slate-900 flex-1">
                  {rec.title}
                </Text>
                <View
                  className={`px-2.5 py-1 rounded-lg ${
                    priorityColors[rec.priority] === "#EF4444"
                      ? "bg-red-500"
                      : priorityColors[rec.priority] === "#F59E0B"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                >
                  <Text className="text-xs font-bold text-white tracking-wide">
                    {rec.priority.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text className="text-sm text-gray-600 mb-4 leading-6">
                {rec.description}
              </Text>

              <Text className="text-sm font-bold text-slate-900 mb-2">
                Action Steps:
              </Text>
              {rec.actionSteps.map((step, idx) => (
                <View key={idx} className="flex-row mb-2 items-start">
                  <Text className="text-base text-purple-500 mr-2 leading-6">
                    •
                  </Text>
                  <Text className="text-sm text-gray-700 flex-1 leading-6">
                    {step}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Growth Insights */}
      {growthInsights && growthInsights.length > 0 && (
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-4">
            <View className="w-8 h-8 rounded-full bg-green-50 items-center justify-center">
              <HugeiconsIcon icon={Leaf01Icon} size={18} color="#10B981" />
            </View>
            <Text
              style={{
                fontSize: 22,
                fontFamily: "CormorantSemiBold",
                color: "#1f2937",
                letterSpacing: -0.5,
              }}
            >
              Deep Growth Insights
            </Text>
          </View>
          {growthInsights.map((insight, index) => (
            <View
              key={index}
              className="bg-white rounded-2xl p-4 mb-3 border border-gray-200"
            >
              <View className="flex-row justify-between items-start mb-3 gap-2">
                <Text className="text-xs font-bold text-purple-500 uppercase tracking-wide">
                  {insight.category}
                </Text>
                <View
                  className={`px-2.5 py-1 rounded-lg ${
                    insight.impactLevel === "high"
                      ? "bg-red-500"
                      : insight.impactLevel === "medium"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                >
                  <Text className="text-xs font-bold text-white uppercase tracking-wide">
                    {insight.impactLevel} impact
                  </Text>
                </View>
              </View>

              <Text className="text-base font-semibold text-slate-900 mb-3 leading-6">
                {insight.insight}
              </Text>

              <View className="bg-gray-50 rounded-lg p-3 mb-3">
                <Text className="text-xs font-bold text-gray-700 mb-2">
                  Supporting Evidence:
                </Text>
                {insight.supportingEvidence.map((evidence, idx) => (
                  <Text
                    key={idx}
                    className="text-xs text-gray-600 mb-1 leading-5 pl-1"
                  >
                    • {evidence}
                  </Text>
                ))}
              </View>

              <View className="flex-row items-start bg-purple-50 rounded-lg p-3 gap-2 border border-purple-100">
                <View className="w-5 h-5 rounded-full bg-purple-100 items-center justify-center mt-0.5">
                  <HugeiconsIcon
                    icon={InformationCircleIcon}
                    size={14}
                    color="#7B61FF"
                  />
                </View>
                <Text className="flex-1 text-xs text-slate-900 leading-5 font-medium">
                  {insight.suggestion}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Empty state */}
      {!weeklySummary &&
        recommendations.length === 0 &&
        growthInsights.length === 0 && (
          <View className="py-12 items-center">
            <Text className="text-5xl mb-3">📝</Text>
            <Text className="text-base text-gray-500 text-center">
              No insights available for this week
            </Text>
          </View>
        )}

      {/* Bottom padding */}
      <View className="h-10" />
    </>
  );
};
