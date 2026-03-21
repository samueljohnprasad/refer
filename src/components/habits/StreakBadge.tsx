import React from "react";
import { View, Text } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { FireIcon } from "@hugeicons/core-free-icons";

interface StreakBadgeProps {
  currentStreak: number;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ currentStreak }) => {
  if (currentStreak < 1) return null;

  return (
    <View className="flex-row items-center bg-gray-100 px-2 py-0.5 rounded-full ml-2">
      <HugeiconsIcon icon={FireIcon} size={12} color="#9CA3AF" />
      <Text className="text-xs text-gray-500 font-medium ml-1">
        {currentStreak}d
      </Text>
    </View>
  );
};
