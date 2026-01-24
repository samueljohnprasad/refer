import React from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import { useUserLevel } from "@/hooks/data/useUserLevel";
import { LevelBadge } from "./LevelBadge";

interface LevelProgressBarProps {
  showBadge?: boolean;
  compact?: boolean;
}

/**
 * Visual progress bar showing XP toward next level
 * Displays current level, XP progress, and next level info
 */
export const LevelProgressBar: React.FC<LevelProgressBarProps> = ({
  showBadge = true,
  compact = false,
}) => {
  const {
    currentLevel,
    nextLevel,
    progress,
    currentXP,
    requiredXP,
    isMaxLevel,
    totalXP,
  } = useUserLevel();

  const progressWidth = useSharedValue(0);

  // Animate progress bar
  React.useEffect(() => {
    progressWidth.value = withSpring(progress, {
      damping: 15,
      stiffness: 100,
    });
  }, [progress]);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  if (compact) {
    return (
      <View className="flex-row items-center gap-2">
        {showBadge && <LevelBadge level={currentLevel} size="sm" />}
        <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <Animated.View
            className="h-full rounded-full"
            style={[
              { backgroundColor: currentLevel.color },
              progressAnimatedStyle,
            ]}
          />
        </View>
        <Text className="text-xs text-gray-500 font-medium">
          {isMaxLevel ? "MAX" : `${progress}%`}
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-2xl p-4 border border-gray-100">
      {/* Header with Level Badge */}
      <View className="flex-row items-center justify-between mb-3">
        {showBadge && <LevelBadge level={currentLevel} size="md" />}
        <Text className="text-sm text-gray-500">{totalXP} XP total</Text>
      </View>

      {/* Progress Bar */}
      <View className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
        <Animated.View
          className="h-full rounded-full"
          style={[
            { backgroundColor: currentLevel.color },
            progressAnimatedStyle,
          ]}
        />
      </View>

      {/* Progress Text */}
      <View className="flex-row justify-between">
        <Text className="text-xs text-gray-500">
          {isMaxLevel
            ? "Max level reached!"
            : `${currentXP} / ${requiredXP} XP`}
        </Text>
        {nextLevel && (
          <Text className="text-xs text-gray-400">
            Next: {nextLevel.icon} {nextLevel.name}
          </Text>
        )}
      </View>
    </View>
  );
};
