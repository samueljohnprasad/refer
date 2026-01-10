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
    <View className="flex-row items-center bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100 ml-2">
      <HugeiconsIcon icon={FireIcon} size={14} color="#EA580C" />
      <Text className="text-xs text-orange-600 font-semibold ml-1">
        {currentStreak} {currentStreak === 1 ? "day" : "days"}
      </Text>
    </View>
  );
};
