import React from "react";
import { View, Text, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { ConfettiExplosion } from "@/src/components/animations/ConfettiExplosion";
import {
  useMilestoneBadgeViewModel,
  useMilestoneTitleViewModel,
  useRewardDescriptionViewModel,
  useStreakMilestoneModalViewModel,
  type StreakMilestoneModalProps,
} from "../hooks/useStreakMilestoneModalViewModel";

export interface MilestoneBadgeViewProps
  extends ReturnType<typeof useMilestoneBadgeViewModel> {}

/**
 * Presentational View component for MilestoneBadge.
 * Strictly contains JSX code without internal hooks.
 */
export const MilestoneBadgeView = React.memo(function MilestoneBadgeView({
  badgeStyle,
  glowStyle,
  days,
  emoji,
}: MilestoneBadgeViewProps): React.JSX.Element {
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
});

function MilestoneBadge({
  days,
  emoji,
}: {
  days: number;
  emoji: string;
}): React.JSX.Element {
  const viewModel = useMilestoneBadgeViewModel(days, emoji);
  return <MilestoneBadgeView {...viewModel} />;
}

export interface MilestoneTitleViewProps
  extends ReturnType<typeof useMilestoneTitleViewModel> {}

/**
 * Presentational View component for MilestoneTitle.
 * Strictly contains JSX code without internal hooks.
 */
export const MilestoneTitleView = React.memo(function MilestoneTitleView({
  style,
  title,
}: MilestoneTitleViewProps): React.JSX.Element {
  return (
    <Animated.View style={style} className="items-center mb-3">
      <Text className="text-3xl font-bold text-ink text-center">{title}</Text>
    </Animated.View>
  );
});

function MilestoneTitle({ title }: { title: string }): React.JSX.Element {
  const viewModel = useMilestoneTitleViewModel(title);
  return <MilestoneTitleView {...viewModel} />;
}

export interface RewardDescriptionViewProps
  extends ReturnType<typeof useRewardDescriptionViewModel> {}

/**
 * Presentational View component for RewardDescription.
 * Strictly contains JSX code without internal hooks.
 */
export const RewardDescriptionView = React.memo(function RewardDescriptionView({
  style,
  reward,
}: RewardDescriptionViewProps): React.JSX.Element {
  return (
    <Animated.View style={style} className="items-center mb-8 px-8">
      <Text className="text-base text-ink-soft text-center leading-6">
        {reward}
      </Text>
    </Animated.View>
  );
});

function RewardDescription({ reward }: { reward: string }): React.JSX.Element {
  const viewModel = useRewardDescriptionViewModel(reward);
  return <RewardDescriptionView {...viewModel} />;
}

export interface StreakMilestoneModalViewProps
  extends ReturnType<typeof useStreakMilestoneModalViewModel> {}

/**
 * Presentational View component for StreakMilestoneModal.
 * Strictly contains JSX code without internal hooks.
 */
export const StreakMilestoneModalView = React.memo(
  function StreakMilestoneModalView({
    showConfetti,
    config,
    handleConfettiComplete,
    handlePressKeepGoing,
    visible,
    milestoneDays,
    onDismiss,
  }: StreakMilestoneModalViewProps): React.JSX.Element {
    return (
      <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
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
              onPress={() => void handlePressKeepGoing()}
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
  },
);

/**
 * Container component for StreakMilestoneModal.
 */
export default function StreakMilestoneModal(
  props: StreakMilestoneModalProps,
): React.JSX.Element {
  const viewModel = useStreakMilestoneModalViewModel(props);
  return <StreakMilestoneModalView {...viewModel} />;
}
export type { StreakMilestoneModalProps };
