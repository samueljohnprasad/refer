import React from "react";
import { View, Text } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { FireIcon } from "@hugeicons/core-free-icons";
import { NEUTRAL } from "@/src/theme/palette";

interface StreakBadgeProps {
  currentStreak: number;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ currentStreak }) => {
  if (currentStreak < 1) return null;

  return (
    <View className="flex-row items-center">
      <HugeiconsIcon icon={FireIcon} size={12} color={NEUTRAL.inkSoft} />
      <Text className="ml-1 text-xs text-ink-soft happy-font-body">
        {currentStreak}
      </Text>
    </View>
  );
};
