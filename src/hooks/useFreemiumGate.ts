// ponytail: unified freemium gating hook without speculative abstractions
import { useCallback } from "react";
import * as Haptics from "expo-haptics";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";

export const FREEMIUM_LIMITS = {
  HABITS: 3,
  COPING_CARDS: 5,
  VOICE_RECORDINGS_WEEKLY: 3,
  AI_ASSISTANT_DAILY: 5,
} as const;

export type FreemiumFeature =
  | "journey_unit"
  | "exercise"
  | "habits"
  | "coping_cards"
  | "voice_recording"
  | "ai_assistant";

export function useFreemiumGate() {
  const { hasPro, presentPaywall, isLoadingRevenueCat } = useRevenueCat();

  const isFeatureGated = useCallback(
    (feature: FreemiumFeature, currentCount = 0): boolean => {
      if (hasPro) return false;

      switch (feature) {
        case "journey_unit":
        case "exercise":
          return true;
        case "habits":
          return currentCount >= FREEMIUM_LIMITS.HABITS;
        case "coping_cards":
          return currentCount >= FREEMIUM_LIMITS.COPING_CARDS;
        case "voice_recording":
          return currentCount >= FREEMIUM_LIMITS.VOICE_RECORDINGS_WEEKLY;
        case "ai_assistant":
          return currentCount >= FREEMIUM_LIMITS.AI_ASSISTANT_DAILY;
        default:
          return false;
      }
    },
    [hasPro],
  );

  const requirePro = useCallback(
    async (feature: FreemiumFeature, currentCount = 0): Promise<boolean> => {
      if (hasPro) return true;

      const isGated = isFeatureGated(feature, currentCount);
      if (isGated) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        const unlocked = await presentPaywall();
        return unlocked;
      }

      return true;
    },
    [hasPro, isFeatureGated, presentPaywall],
  );

  return {
    hasPro,
    isLoadingRevenueCat,
    isFeatureGated,
    requirePro,
    presentPaywall,
  };
}
