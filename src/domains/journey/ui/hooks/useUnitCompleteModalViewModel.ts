import { useCallback, useEffect, useMemo, useState } from "react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  useReducedMotion,
} from "react-native-reanimated";
import type { UnitRewardContent } from "@/src/types/journeyV5";
import { triggerIfEnabledSync } from "@/lib/haptics/hapticUtils";
import { HAPTIC_INTENSITIES } from "@/lib/haptics/hapticConfig";

export interface UnitCompleteModalProps {
  unitTitle: string;
  content: UnitRewardContent;
  onContinue: () => void;
}

export function useUnitCompleteModalViewModel(
  { unitTitle, content, onContinue }: UnitCompleteModalProps,
  ref: React.ForwardedRef<BottomSheetModal>,
) {
  const snapPoints = useMemo(() => ["65%"], []);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const trophyScale = useSharedValue(0);

  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (content) {
      if (ref && "current" in ref) ref.current?.present();
      const timer = setTimeout(() => setShowConfetti(!reduceMotion), 200);
      if (reduceMotion) {
        trophyScale.value = 1;
      } else {
        trophyScale.value = withDelay(
          100,
          withSequence(
            withSpring(1.2, {
              damping: 20,
              stiffness: 100,
              overshootClamping: true,
            }),
            withSpring(1, {
              damping: 20,
              stiffness: 100,
              overshootClamping: true,
            }),
          ),
        );
      }
      void triggerIfEnabledSync("swell", HAPTIC_INTENSITIES.SWELL);
      const burstTimer = setTimeout(() => {
        void triggerIfEnabledSync(
          "heartbeat",
          HAPTIC_INTENSITIES.HEARTBEAT_STRONG,
        );
      }, 350);
      return () => {
        clearTimeout(timer);
        clearTimeout(burstTimer);
      };
    }
  }, [content, ref, trophyScale, reduceMotion]);

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trophyScale.value }],
  }));

  const handleConfettiComplete = useCallback((): void => {
    setShowConfetti(false);
  }, []);

  const handleContinue = useCallback((): void => {
    void triggerIfEnabledSync("bloom", HAPTIC_INTENSITIES.BLOOM_STRONG);
    if (ref && "current" in ref && ref.current) {
      ref.current.dismiss();
    }
    onContinue();
  }, [ref, onContinue]);

  return {
    snapPoints,
    showConfetti,
    trophyStyle,
    handleConfettiComplete,
    handleContinue,
    unitTitle,
    content,
  };
}
