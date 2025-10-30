import React from "react";
import { View, Text } from "react-native";
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

  return (
    <View className="mb-6">
      {showTitle && (
        <Text className="text-[22px] font-extrabold text-[#0F172A] tracking-wide mb-4">
          📊 Weekly Summary
        </Text>
      )}
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
  );
};
