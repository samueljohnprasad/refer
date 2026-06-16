/**
 * StreakMilestoneModal (P1.5.3)
 *
 * Full-screen celebration modal for streak milestones.
 * Triggered when useStreak.updateStreak() returns a milestone.
 *
 * Milestones: 3, 7, 14, 30, 60, 100, 365
 * Awards streak freeze at 7-day milestone.
 */

import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { PressableScale } from "@/src/components/ui/PressableScale";
import { ConfettiExplosion } from "@/src/components/animations/ConfettiExplosion";
import { SPRING_BOUNCY } from "@/src/utils/motionTokens";
import {
  triggerIfEnabledSync,
  triggerRampIfEnabled,
} from "@/lib/haptics/hapticUtils";
import { HAPTIC_INTENSITIES, HAPTIC_TIMING } from "@/lib/haptics/hapticConfig";

// ============================================================================
// Types
// ============================================================================

export interface StreakMilestoneModalProps {
  visible: boolean;
  milestoneDays: number;
  onDismiss: () => void;
}

interface MilestoneInfo {
  title: string;
  reward: string;
  emoji: string;
  confettiCount: number;
}

// ============================================================================
// Constants
// ============================================================================

const MILESTONE_CONFIG: Record<number, MilestoneInfo> = {
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

const DEFAULT_MILESTONE: MilestoneInfo = {
  title: "Streak Milestone!",
  reward: "Keep the momentum going!",
  emoji: "🔥",
  confettiCount: 20,
};

// ============================================================================
// Sub-components
// ============================================================================

function MilestoneBadge({
  days,
  emoji,
}: {
  days: number;
  emoji: string;
}): React.JSX.Element {
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

  return (
    <View className="items-center mb-6">
      <Animated.View
        style={[
          glowStyle,
          { position: "absolute", width: 140, height: 140, borderRadius: 70 },
        ]}
        className="bg-orange-200"
      />
      <Animated.View
        style={badgeStyle}
        className="w-28 h-28 rounded-full bg-orange-100 border-4 border-orange-300 items-center justify-center"
      >
        <Text style={{ fontSize: 36 }}>{emoji}</Text>
        <Text className="text-lg font-bold text-orange-700">{days}</Text>
      </Animated.View>
    </View>
  );
}

function MilestoneTitle({ title }: { title: string }): React.JSX.Element {
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

  return (
    <Animated.View style={style} className="items-center mb-3">
      <Text className="text-3xl font-bold text-ink text-center">{title}</Text>
    </Animated.View>
  );
}

function RewardDescription({ reward }: { reward: string }): React.JSX.Element {
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

  return (
    <Animated.View style={style} className="items-center mb-8 px-8">
      <Text className="text-base text-ink-soft text-center leading-6">
        {reward}
      </Text>
    </Animated.View>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function StreakMilestoneModal({
  visible,
  milestoneDays,
  onDismiss,
}: StreakMilestoneModalProps): React.JSX.Element {
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

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onDismiss}
    >
      <SafeAreaView
        className="flex-1 bg-brand-surface"
        edges={["top", "bottom"]}
      >
        <ConfettiExplosion
          isVisible={showConfetti}
          count={config.confettiCount}
          duration={1400}
          onAnimationComplete={handleConfettiComplete}
        />

        <View className="flex-1 items-center justify-center px-6">
          <MilestoneBadge days={milestoneDays} emoji={config.emoji} />
          <MilestoneTitle title={config.title} />
          <RewardDescription reward={config.reward} />
        </View>

        <View className="px-5 pb-4 pt-2">
          <PressableScale
            onPress={async () => {
              await getButtonHaptic();
              onDismiss();
            }}
            scale={0.96}
            hapticStyle="medium"
            style={{
              backgroundColor: "#EA580C",
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              borderBottomWidth: 4,
              borderBottomColor: "#C2410C",
            }}
            accessibilityLabel="Keep it going"
            accessibilityRole="button"
          >
            <Text className="text-base font-bold text-white">
              Keep it going! 🔥
            </Text>
          </PressableScale>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
