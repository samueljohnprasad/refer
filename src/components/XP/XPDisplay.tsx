import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StarsIcon } from "@hugeicons/core-free-icons";
import { XPGainAnimation } from "./XPGainAnimation";
import { LevelBadge } from "../Level";
import { getLevelFromXP } from "@/src/types/levels";
import { useTranslation } from "react-i18next";

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

const LEVEL_NAME_KEYS = {
  1: "xp.levelNames.level1",
  2: "xp.levelNames.level2",
  3: "xp.levelNames.level3",
  4: "xp.levelNames.level4",
  5: "xp.levelNames.level5",
  6: "xp.levelNames.level6",
  7: "xp.levelNames.level7",
  8: "xp.levelNames.level8",
  9: "xp.levelNames.level9",
  10: "xp.levelNames.level10",
} as const;

export const XPDisplay: React.FC<XPDisplayProps> = ({
  totalXP,
  todayXP = 0,
  recentGains = [],
  onClearGain,
  showToday = false,
  compact = false,
  onPress,
}) => {
  const { t } = useTranslation("common");
  const level = getLevelFromXP(totalXP);
  const localizedLevel = {
    ...level,
    name: String(t(LEVEL_NAME_KEYS[level.level as keyof typeof LEVEL_NAME_KEYS])),
  };

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
              level={localizedLevel}
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
                {t("xp.display.total")}
              </Text>
              <Text className="text-2xl font-bold text-gray-900">
                {totalXP.toLocaleString()}
              </Text>
            </View>
            <LevelBadge level={localizedLevel} size="md" />
          </View>

          {/* Today's XP */}
          {showToday && (
            <View className="items-end">
              <Text className="text-gray-500 text-xs font-medium">
                {t("xp.display.today")}
              </Text>
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
