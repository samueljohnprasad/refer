import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StarsIcon } from "@hugeicons/core-free-icons";
import { XPGainAnimation } from "./XPGainAnimation";
import { LevelBadge } from "../Level";
import { getLevelFromXP } from "@/src/types/levels";

interface XPGain {
  id: string;
  amount: number;
  label: string;
  timestamp: number;
}

interface XPDisplayProps {
  totalXP: number;
  todayXP?: number;
  recentGains?: XPGain[];
  onClearGain?: (id: string) => void;
  showToday?: boolean;
  compact?: boolean;
  onPress?: () => void;
}

export const XPDisplay: React.FC<XPDisplayProps> = ({
  totalXP,
  todayXP = 0,
  recentGains = [],
  onClearGain,
  showToday = false,
  compact = false,
  onPress,
}) => {
  if (compact) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="relative"
      >
        <View className="flex-row items-center bg-amber-50 rounded-full px-3 py-1.5">
          <HugeiconsIcon icon={StarsIcon} size={16} color="#D97706" />
          <Text className="text-amber-600 font-bold text-sm ml-1">
            {totalXP.toLocaleString()}
          </Text>
          <View className="ml-2">
            <LevelBadge
              level={getLevelFromXP(totalXP)}
              size="sm"
              showName={false}
            />
          </View>
        </View>

        {/* Animated XP gains */}
        {recentGains.map((gain) => (
          <XPGainAnimation
            key={gain.id}
            amount={gain.amount}
            onComplete={() => onClearGain?.(gain.id)}
          />
        ))}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      className="relative"
    >
      <View className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-4 border border-yellow-200">
        <View className="flex-row items-center justify-between">
          {/* Total XP */}
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-yellow-400 items-center justify-center">
              <HugeiconsIcon icon={StarsIcon} size={24} color="#FFFFFF" />
            </View>
            <View className="ml-3">
              <Text className="text-gray-500 text-xs font-medium">
                Total XP
              </Text>
              <Text className="text-2xl font-bold text-gray-900">
                {totalXP.toLocaleString()}
              </Text>
            </View>
            <LevelBadge level={getLevelFromXP(totalXP)} size="md" />
          </View>

          {/* Today's XP */}
          {showToday && (
            <View className="items-end">
              <Text className="text-gray-500 text-xs font-medium">Today</Text>
              <Text className="text-lg font-bold text-yellow-600">
                +{todayXP}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Animated XP gains */}
      {recentGains.map((gain) => (
        <XPGainAnimation
          key={gain.id}
          amount={gain.amount}
          label={gain.label}
          onComplete={() => onClearGain?.(gain.id)}
        />
      ))}
    </TouchableOpacity>
  );
};
