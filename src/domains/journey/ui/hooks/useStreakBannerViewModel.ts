import { useEffect } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export interface StreakBannerProps {
  currentStreak: number;
  freezesAvailable: number;
  isAtRisk: boolean;
  compact?: boolean;
  onPress?: () => void;
}

const PULSE_DURATION: number = 1200;
const HIGH_STREAK_THRESHOLD: number = 7;

export function useAnimatedFlameViewModel(animate: boolean) {
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

  return { style };
}

export function useStreakBannerViewModel({
  currentStreak,
  freezesAvailable,
  isAtRisk,
  compact = false,
  onPress,
}: StreakBannerProps) {
  const isHighStreak: boolean = currentStreak >= HIGH_STREAK_THRESHOLD;
  const hasStreak: boolean = currentStreak > 0;

  return {
    isHighStreak,
    hasStreak,
    currentStreak,
    freezesAvailable,
    isAtRisk,
    compact,
    onPress,
  };
}
