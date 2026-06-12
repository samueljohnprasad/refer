/**
 * StreakBanner (P1.5.1)
 *
 * Horizontal bar showing the user's current streak.
 *
 * Features:
 * - 🔥 flame icon + streak count + "day streak" label
 * - Streak ≥ 7: flame icon gets animated (subtle pulse)
 * - Streak = 0: "Start your streak!" CTA
 * - Streak freeze indicator: ❄️ badge with count
 * - Tap → open streak detail (callback)
 * - Compact variant for inline use (icon + number only)
 *
 * Used on: catalog screen header, journey map header, home screen.
 * Pure presentational — all data via props.
 */

import React, { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

// ============================================================================
// Types
// ============================================================================

export interface StreakBannerProps {
  /** Current streak day count */
  currentStreak: number;
  /** Number of streak freezes available */
  freezesAvailable: number;
  /** Whether the streak is at risk (no activity today, getting late) */
  isAtRisk: boolean;
  /** Compact mode: icon + number only */
  compact?: boolean;
  /** Called when user taps the banner */
  onPress?: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const PULSE_DURATION: number = 1200;
const HIGH_STREAK_THRESHOLD: number = 7;

// ============================================================================
// Sub-components
// ============================================================================

/** Animated flame for high streaks */
function AnimatedFlame({
  animate,
  size,
}: {
  animate: boolean;
  size: number;
}): React.JSX.Element {
  const scale = useSharedValue<number>(1);

  useEffect(() => {
    if (animate) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: PULSE_DURATION / 2 }),
          withTiming(1, { duration: PULSE_DURATION / 2 }),
        ),
        -1,
        true,
      );
    } else {
      scale.value = 1;
    }
  }, [animate, scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={style}>
      <Text style={{ fontSize: size }}>🔥</Text>
    </Animated.View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

function StreakBannerInner({
  currentStreak,
  freezesAvailable,
  isAtRisk,
  compact = false,
  onPress,
}: StreakBannerProps): React.JSX.Element {
  const isHighStreak: boolean = currentStreak >= HIGH_STREAK_THRESHOLD;
  const hasStreak: boolean = currentStreak > 0;

  // ── Compact variant ──
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

  // ── Full variant ──
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
      {/* Flame icon */}
      <AnimatedFlame animate={isHighStreak} size={20} />

      {/* Streak text */}
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

      {/* Gentle check-in nudge */}
      {isAtRisk && hasStreak ? (
        <View className="bg-sage-pill px-1.5 py-0.5 rounded-full mr-1">
          <Text className="text-xs">🌿</Text>
        </View>
      ) : null}

      {/* Streak freeze badge */}
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
}

export const StreakBanner = React.memo(StreakBannerInner);
export default StreakBanner;
