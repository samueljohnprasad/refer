import { useCallback, useEffect, useState } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SPRING_BOUNCY } from "@/src/utils/motionTokens";
import {
  triggerIfEnabledSync,
  triggerRampIfEnabled,
} from "@/lib/haptics/hapticUtils";
import { HAPTIC_INTENSITIES, HAPTIC_TIMING } from "@/lib/haptics/hapticConfig";

export interface StreakMilestoneModalProps {
  visible: boolean;
  milestoneDays: number;
  onDismiss: () => void;
}

export interface MilestoneInfo {
  title: string;
  reward: string;
  emoji: string;
  confettiCount: number;
}

export const MILESTONE_CONFIG: Record<number, MilestoneInfo> = {
  3: {
    title: "3-Day Streak!",
    reward: "You're building a habit — keep it up!",
    emoji: "🔥",
    confettiCount: 16,
  },
  7: {
    title: "7-Day Streak!",
    reward: "You earned a Streak Freeze! ❄️",
    emoji: "🔥",
    confettiCount: 24,
  },
  14: {
    title: "2-Week Streak!",
    reward: "Two weeks strong — incredible consistency!",
    emoji: "🔥",
    confettiCount: 28,
  },
  30: {
    title: "30-Day Streak!",
    reward: "A full month! You earned 2 Streak Freezes! ❄️❄️",
    emoji: "💪",
    confettiCount: 32,
  },
  60: {
    title: "60-Day Streak!",
    reward: "Two months of daily growth — remarkable!",
    emoji: "⭐",
    confettiCount: 36,
  },
  100: {
    title: "100-Day Streak!",
    reward: "Triple digits! You earned the Century Badge! 🏅",
    emoji: "🏆",
    confettiCount: 40,
  },
  365: {
    title: "365-Day Streak!",
    reward: "One full year — you're truly extraordinary! 🌟",
    emoji: "👑",
    confettiCount: 50,
  },
};

export const DEFAULT_MILESTONE: MilestoneInfo = {
  title: "Streak Milestone!",
  reward: "Keep the momentum going!",
  emoji: "🔥",
  confettiCount: 20,
};

export function useMilestoneBadgeViewModel(days: number, emoji: string) {
  const scale = useSharedValue<number>(0);
  const glowOpacity = useSharedValue<number>(0);

  useEffect(() => {
    scale.value = withDelay(
      300,
      withSequence(
        withSpring(1.3, SPRING_BOUNCY),
        withSpring(1, SPRING_BOUNCY),
      ),
    );
    glowOpacity.value = withDelay(
      300,
      withSequence(
        withTiming(0.8, { duration: 300 }),
        withTiming(0.3, { duration: 600 }),
      ),
    );
    const timer = setTimeout(() => {
      void triggerRampIfEnabled(
        0.2,
        HAPTIC_INTENSITIES.SWELL,
        HAPTIC_TIMING.BADGE_PEAK,
      );
    }, 300);
    return () => clearTimeout(timer);
  }, [scale, glowOpacity]);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));

  return {
    badgeStyle,
    glowStyle,
    days,
    emoji,
  };
}

export function useMilestoneTitleViewModel(title: string) {
  const scale = useSharedValue<number>(0.5);
  const opacity = useSharedValue<number>(0);

  useEffect(() => {
    scale.value = withDelay(500, withSpring(1, SPRING_BOUNCY));
    opacity.value = withDelay(500, withTiming(1, { duration: 400 }));
    const timer = setTimeout(() => {
      void triggerIfEnabledSync("bloom", HAPTIC_INTENSITIES.BLOOM);
    }, HAPTIC_TIMING.TITLE_REVEAL);
    return () => clearTimeout(timer);
  }, [scale, opacity]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return { style, title };
}

export function useRewardDescriptionViewModel(reward: string) {
  const opacity = useSharedValue<number>(0);

  useEffect(() => {
    opacity.value = withDelay(800, withTiming(1, { duration: 500 }));
    const timer = setTimeout(() => {
      void triggerIfEnabledSync(
        "heartbeat",
        HAPTIC_INTENSITIES.HEARTBEAT_STRONG,
      );
    }, HAPTIC_TIMING.REWARD_REVEAL);
    return () => clearTimeout(timer);
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return { style, reward };
}

export function useStreakMilestoneModalViewModel({
  visible,
  milestoneDays,
  onDismiss,
}: StreakMilestoneModalProps) {
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const config: MilestoneInfo = MILESTONE_CONFIG[milestoneDays] ?? {
    ...DEFAULT_MILESTONE,
    title: `${milestoneDays}-Day Streak!`,
  };

  const getButtonHaptic = useCallback(async (): Promise<void> => {
    if (milestoneDays >= 100) {
      void triggerIfEnabledSync("swell", HAPTIC_INTENSITIES.SWELL);
    } else if (milestoneDays >= 30) {
      void triggerIfEnabledSync("swell", HAPTIC_INTENSITIES.SWELL);
    } else if (milestoneDays >= 7) {
      void triggerIfEnabledSync("bloom", HAPTIC_INTENSITIES.BLOOM_STRONG);
    } else {
      void triggerIfEnabledSync("bloom", HAPTIC_INTENSITIES.BLOOM);
    }
  }, [milestoneDays]);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setShowConfetti(true), 200);
      return () => clearTimeout(timer);
    }
    setShowConfetti(false);
    return undefined;
  }, [visible]);

  const handleConfettiComplete = useCallback((): void => {
    setShowConfetti(false);
  }, []);

  const handlePressKeepGoing = useCallback(async () => {
    await getButtonHaptic();
    onDismiss();
  }, [getButtonHaptic, onDismiss]);

  return {
    showConfetti,
    config,
    handleConfettiComplete,
    handlePressKeepGoing,
    visible,
    milestoneDays,
    onDismiss,
  };
}
