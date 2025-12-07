import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

interface AIInsightsChipProps {
  onPress: () => void;
  visible?: boolean;
}

/**
 * Presentational card component for AI insights
 * Displays weekly AI insights prompt with sparkle icon
 * Matches design: light purple background, icon on left, descriptive text
 */
export const AIInsightsChip: React.FC<AIInsightsChipProps> = ({
  onPress,
  visible = true,
}) => {
  if (!visible) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="mx-3 my-2 bg-purple-100 rounded-3xl p-5"
      accessibilityRole="button"
      accessibilityLabel="View weekly AI insights"
      accessibilityHint="Opens detailed analysis of your week"
    >
      <View className="flex-row items-start">
        {/* Sparkle icon */}
        <View className="mr-4 mt-1">
          <Text className="text-3xl">✨</Text>
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text className="text-2xl font-bold text-gray-900 mb-1.5 font-cormorantBold">
            Weekly AI Insights
          </Text>
          <Text className="text-sm text-gray-600 leading-5">
            Discover your emotional patterns, growth insights, and personalized weekly reflections
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
