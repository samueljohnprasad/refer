import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import {
  useAnimatedFlameViewModel,
  useStreakBannerViewModel,
  type StreakBannerProps,
} from "../hooks/useStreakBannerViewModel";

export interface AnimatedFlameViewProps
  extends ReturnType<typeof useAnimatedFlameViewModel> {
  size: number;
}

/**
 * Presentational View component for AnimatedFlame.
 * Strictly contains JSX code without internal hooks.
 */
export const AnimatedFlameView = React.memo(function AnimatedFlameView({
  style,
  size,
}: AnimatedFlameViewProps): React.JSX.Element {
  return (
    <Animated.View style={style}>
      <Text style={{ fontSize: size }}>🔥</Text>
    </Animated.View>
  );
});

function AnimatedFlame({
  animate,
  size,
}: {
  animate: boolean;
  size: number;
}): React.JSX.Element {
  const viewModel = useAnimatedFlameViewModel(animate);
  return <AnimatedFlameView {...viewModel} size={size} />;
}

export interface StreakBannerViewProps
  extends ReturnType<typeof useStreakBannerViewModel> {}

/**
 * Presentational View component for StreakBanner.
 * Strictly contains JSX code without internal hooks.
 */
export const StreakBannerView = React.memo(function StreakBannerView({
  isHighStreak,
  hasStreak,
  currentStreak,
  freezesAvailable,
  isAtRisk,
  compact,
  onPress,
}: StreakBannerViewProps): React.JSX.Element {
  if (compact) {
    return (
      <Pressable
        onPress={onPress}
        className="flex-row items-center gap-1"
        accessibilityLabel={`${currentStreak} day streak`}
        accessibilityRole="button"
      >
        <AnimatedFlame animate={isHighStreak} size={16} />
        <Text
          className={`text-sm font-bold ${
            isAtRisk ? "text-orange-500" : "text-orange-600"
          }`}
        >
          {currentStreak}
        </Text>
        {freezesAvailable > 0 ? (
          <Text className="text-xs">❄️{freezesAvailable}</Text>
        ) : null}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center px-3 py-2 rounded-2xl border ${
        isAtRisk
          ? "bg-orange-50 border-orange-200"
          : hasStreak
            ? "bg-amber-50 border-amber-200"
            : "bg-slate-50 border-slate-200"
      }`}
      accessibilityLabel={
        hasStreak
          ? `${currentStreak} day streak. Tap for details.`
          : "Start your streak! Tap for details."
      }
      accessibilityRole="button"
    >
      <AnimatedFlame animate={isHighStreak} size={20} />

      <View className="ml-1.5 mr-2">
        {hasStreak ? (
          <View className="flex-row items-baseline gap-1">
            <Text
              className={`text-base font-bold ${
                isAtRisk ? "text-orange-600" : "text-amber-700"
              }`}
            >
              {currentStreak}
            </Text>
            <Text className="text-xs text-ink-soft">
              {currentStreak === 1 ? "day" : "day streak"}
            </Text>
          </View>
        ) : (
          <Text className="text-xs font-semibold text-ink-soft">
            Start your streak!
          </Text>
        )}
      </View>

      {isAtRisk && hasStreak ? (
        <View className="bg-sage-pill px-1.5 py-0.5 rounded-full mr-1">
          <Text className="text-xs">🌿</Text>
        </View>
      ) : null}

      {freezesAvailable > 0 ? (
        <View className="bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full flex-row items-center gap-0.5">
          <Text className="text-xs">❄️</Text>
          <Text className="text-xs font-bold text-blue-600">
            {freezesAvailable}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
});

/**
 * Container component for StreakBanner.
 */
function StreakBannerInner(props: StreakBannerProps): React.JSX.Element {
  const viewModel = useStreakBannerViewModel(props);
  return <StreakBannerView {...viewModel} />;
}

export const StreakBanner = React.memo(StreakBannerInner);
export default StreakBanner;
export type { StreakBannerProps };
