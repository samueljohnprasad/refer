import React from "react";
import { View, Text, StyleProp, ViewStyle } from "react-native";
import { CARD_SHADOW } from "@/constants/shadows";

export interface LevelProgressCardProps {
  xp: number;
  levelLabel: string; // e.g., "Gold"
  percent: number; // 0-100
  style?: StyleProp<ViewStyle>;
}

const LevelProgressCard: React.FC<LevelProgressCardProps> = ({
  xp,
  levelLabel,
  percent,
  style,
}) => {
  const clamped: number = Math.max(0, Math.min(100, percent));
  return (
    <View
      className="bg-violet-500 rounded-2xl p-4 mb-5"
      style={[CARD_SHADOW, style]}
    >
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-base font-bold text-white">
          My Level Progress
        </Text>
        <Text className="text-base font-bold text-yellow-300">
          {xp} XP
        </Text>
      </View>
      <View className="h-2 bg-white/20 rounded-full mb-2 overflow-hidden">
        <View
          className="h-full bg-yellow-300 rounded-full"
          style={{ width: `${clamped}%` }}
        />
      </View>
      <Text className="text-sm font-semibold text-white/80">
        {levelLabel} • {clamped}%
      </Text>
    </View>
  );
};

export default LevelProgressCard;
