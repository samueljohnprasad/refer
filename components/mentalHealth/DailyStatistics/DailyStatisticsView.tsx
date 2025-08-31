import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { DailyStatistics } from "@/types/mentalHealth";
// Simplified inline components for charts and cards
import { Feather } from "@expo/vector-icons";

interface DailyStatisticsViewProps {
  dailyStats: DailyStatistics | null;
  isLoading: boolean;
  onRefresh?: () => void;
}

export const DailyStatisticsView: React.FC<DailyStatisticsViewProps> = ({
  dailyStats,
  isLoading,
  onRefresh,
}) => {
  if (isLoading || !dailyStats) {
    return (
      <View className="p-4 bg-white rounded-2xl mb-6 ">
        <View className="animate-pulse">
          <View className="h-6 bg-gray-200 rounded mb-4 w-48" />
          <View className="h-4 bg-gray-200 rounded mb-2 w-32" />
          <View className="h-20 bg-gray-200 rounded mb-4" />
        </View>
      </View>
    );
  }

  const getMoodEmoji = (mood: string): string => {
    const moodEmojis: Record<string, string> = {
      anxious: "😟",
      calm: "😌",
      hopeful: "🌟",
      stressed: "😓",
      peaceful: "🕊️",
      grateful: "🙏",
      sad: "😢",
      excited: "🎉",
      neutral: "😐",
      confident: "💪",
      overwhelmed: "🤯",
      confused: "🤔",
    };
    return moodEmojis[mood] || "😐";
  };

  const getMoodScoreColor = (score: number): string => {
    if (score >= 7) return "text-green-600";
    if (score >= 5) return "text-yellow-600";
    return "text-red-500";
  };

  const getStressLevelColor = (level: number): string => {
    if (level <= 3) return "text-green-600";
    if (level <= 6) return "text-yellow-600";
    return "text-red-500";
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      {/* Overall Mood Card */}
      <View className="bg-white rounded-2xl mb-4 p-6 shadow-sm">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-gray-800">
            Today's Overview
          </Text>
          {onRefresh && (
            <Feather
              name="refresh-cw"
              size={20}
              color="#6b7280"
              onPress={onRefresh}
            />
          )}
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <Text className="text-3xl mr-3">
                {getMoodEmoji(dailyStats.overallMood)}
              </Text>
              <View>
                <Text className="text-xl font-semibold text-gray-800 capitalize">
                  {dailyStats.overallMood}
                </Text>
                <Text className="text-sm text-gray-500">Overall mood</Text>
              </View>
            </View>
          </View>

          <View className="items-end">
            <Text
              className={`text-2xl font-bold ${getMoodScoreColor(
                dailyStats.moodScore
              )}`}
            >
              {dailyStats.moodScore.toFixed(1)}
            </Text>
            <Text className="text-xs text-gray-500">/10 score</Text>
          </View>
        </View>

        {/* Quick Stats Row */}
        <View className="flex-row justify-between mt-6 pt-4 border-t border-gray-100">
          <View className="items-center">
            <Text className="text-lg font-semibold text-blue-600">
              {dailyStats.totalEntries}
            </Text>
            <Text className="text-xs text-gray-500">Entries</Text>
          </View>

          <View className="items-center">
            <Text
              className={`text-lg font-semibold ${getStressLevelColor(
                dailyStats.stressLevel
              )}`}
            >
              {dailyStats.stressLevel}
            </Text>
            <Text className="text-xs text-gray-500">Stress Level</Text>
          </View>

          <View className="items-center">
            <Text className="text-lg font-semibold text-purple-600 capitalize">
              {dailyStats.reflectionLevel}
            </Text>
            <Text className="text-xs text-gray-500">Reflection</Text>
          </View>
        </View>
      </View>

      {/* Dominant Emotions */}
      <View className="bg-white rounded-2xl  mb-4 p-6 shadow-sm">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Today's Emotions
        </Text>

        <View className="flex-row flex-wrap">
          {dailyStats.dominantEmotions.map((emotion, index) => (
            <View
              key={emotion}
              className="bg-blue-50 rounded-full px-3 py-1 mr-2 mb-2"
            >
              <Text className="text-blue-700 text-sm font-medium capitalize">
                {emotion}
              </Text>
            </View>
          ))}
        </View>

        {/* Simple Emotion Distribution */}
        {dailyStats.emotionDistribution.length > 0 && (
          <View className="mt-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Emotion Distribution
            </Text>
            <View className="space-y-2">
              {dailyStats.emotionDistribution.slice(0, 3).map((item, index) => (
                <View
                  key={`${item.emotion}-${index}`}
                  className="flex-row items-center"
                >
                  <View className="w-12">
                    <Text className="text-xs text-gray-600 capitalize">
                      {item.emotion}
                    </Text>
                  </View>
                  <View className="flex-1 mx-2">
                    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(item.percentage, 5)}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </View>
                  </View>
                  <View className="w-8">
                    <Text className="text-xs text-gray-600 text-right">
                      {Math.round(item.percentage)}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* AI Summary
      <View className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-4 shadow-sm">
        <View className="flex-row items-center mb-3">
          <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
            <Feather name="activity" size={16} color="#3B82F6" />
          </View>
          <Text className="text-lg font-semibold text-gray-800 flex-1">
            AI Daily Summary
          </Text>
        </View>
        <Text className="text-gray-700 leading-6 text-base">
          {dailyStats.aiSummary}
        </Text>
        <View className="mt-3 pt-3 border-t border-blue-100">
          <Text className="text-xs text-gray-500 text-center">
            Generated with care • Confidential & private
          </Text>
        </View>
      </View> */}

      {/* <View className="bg-white rounded-2xl mb-6 p-6 shadow-sm">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Recent Mood Pattern
        </Text>
        <View className="space-y-3">
          <View>
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-sm text-gray-600">Mood</Text>
              <Text className="text-sm font-semibold text-green-600">
                {dailyStats.moodScore.toFixed(1)}/10
              </Text>
            </View>
            <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full rounded-full bg-green-500"
                style={{ width: `${(dailyStats.moodScore / 10) * 100}%` }}
              />
            </View>
          </View>
          <View>
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-sm text-gray-600">Stress</Text>
              <Text className="text-sm font-semibold text-orange-600">
                {dailyStats.stressLevel}/10
              </Text>
            </View>
            <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full rounded-full bg-orange-500"
                style={{ width: `${(dailyStats.stressLevel / 10) * 100}%` }}
              />
            </View>
          </View>
        </View>
      </View> */}
    </ScrollView>
  );
};
