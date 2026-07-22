import { useCallback, useEffect, useMemo } from "react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import type { JourneyReward, PathNodeData } from "@/src/types/journey/node";
import { JourneyRewardType } from "@/src/types/journey/enums";
import {
  triggerIfEnabledSync,
  triggerStaggeredItems,
} from "@/lib/haptics/hapticUtils";
import {
  HAPTIC_INTENSITIES,
  REWARD_HAPTICS,
  HAPTIC_TIMING,
} from "@/lib/haptics/hapticConfig";

export interface NodeCompletionModalProps {
  node: PathNodeData | null;
  onContinue: () => void;
}

export const REWARD_ICONS: Record<string, string> = {
  [JourneyRewardType.XP]: "⚡",
  [JourneyRewardType.GEMS]: "💎",
  [JourneyRewardType.HEARTS]: "❤️",
  [JourneyRewardType.ACHIEVEMENT]: "🏆",
};

export const REWARD_LABELS: Record<string, string> = {
  [JourneyRewardType.XP]: "XP",
  [JourneyRewardType.GEMS]: "Gems",
  [JourneyRewardType.HEARTS]: "Hearts",
  [JourneyRewardType.ACHIEVEMENT]: "Achievement",
};

export const REWARD_COLORS: Record<string, string> = {
  [JourneyRewardType.XP]: "#FFF3CD",
  [JourneyRewardType.GEMS]: "#E0F2FE",
  [JourneyRewardType.HEARTS]: "#FEE2E2",
  [JourneyRewardType.ACHIEVEMENT]: "#F3E8FF",
};

export function useRewardBadgeViewModel(reward: JourneyReward) {
  const icon: string = REWARD_ICONS[reward.type] ?? "🎁";
  const label: string = REWARD_LABELS[reward.type] ?? "Reward";
  const bgColor: string = REWARD_COLORS[reward.type] ?? "#F1F5F9";

  return {
    icon,
    label,
    bgColor,
    reward,
  };
}

export function useNodeCompletionModalViewModel(
  { node, onContinue }: NodeCompletionModalProps,
  ref: React.ForwardedRef<BottomSheetModal>,
) {
  const snapPoints = useMemo(() => ["50%"], []);

  useEffect(() => {
    if (node) {
      void triggerIfEnabledSync("bloom", HAPTIC_INTENSITIES.BLOOM);
      void triggerStaggeredItems(
        node.rewards.map((reward) => REWARD_HAPTICS[reward.type]),
        {
          baseDelay: HAPTIC_TIMING.REWARD_BASE_DELAY,
          delayStep: HAPTIC_TIMING.REWARD_DELAY_STEP,
        },
      );
    }
  }, [node]);

  const handleContinue = useCallback(async (): Promise<void> => {
    await triggerIfEnabledSync("bloom", HAPTIC_INTENSITIES.BLOOM_STRONG);
    if (ref && "current" in ref && ref.current) {
      ref.current.dismiss();
    }
    onContinue();
  }, [onContinue, ref]);

  return {
    snapPoints,
    handleContinue,
    node,
  };
}
