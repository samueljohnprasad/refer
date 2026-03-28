import React from "react";
import { TouchableOpacity, View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { SparklesIcon } from "@hugeicons/core-free-icons";
import { Text } from "react-native";

interface AIInsightsChipProps {
  onPress: () => void;
  visible?: boolean;
}

/**
 * Presentational card component for AI insights
 * Displays weekly AI insights prompt with sparkle icon
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
        {/* Sparkle icon bubble */}
        <View className="w-11 h-11 rounded-2xl bg-purple-200 items-center justify-center mr-4 mt-0.5">
          <HugeiconsIcon
            icon={SparklesIcon}
            size={22}
            color="#7C3AED"
            strokeWidth={1.8}
          />
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text className="text-2xl font-bold text-gray-900 mb-1.5 font-cormorantBold">
            Weekly AI Insights
          </Text>
          <Text className="text-sm text-gray-600 leading-5">
            Discover emotional patterns and personalized reflections
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
