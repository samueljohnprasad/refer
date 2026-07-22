import { useCallback, useEffect, useMemo, useState } from "react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
} from "react-native-reanimated";
import type { UnitData, PathNodeData } from "@/src/types/journey";
import { NodeType } from "@/src/types/journey";
import { triggerIfEnabledSync } from "@/lib/haptics/hapticUtils";
import { HAPTIC_INTENSITIES, HAPTIC_TIMING } from "@/lib/haptics/hapticConfig";

export interface UnitCompleteModalProps {
  unit: UnitData | null;
  xpEarned: number;
  onContinue: () => void;
}

export function useStatCardViewModel(index: number) {
  useEffect(() => {
    const delay =
      HAPTIC_TIMING.STAT_BASE_DELAY + index * HAPTIC_TIMING.STAT_DELAY_STEP;
    const timer = setTimeout(() => {
      void triggerIfEnabledSync("pulse", HAPTIC_INTENSITIES.PULSE_LIGHT);
    }, delay);
    return () => clearTimeout(timer);
  }, [index]);

  return { index };
}

export function useUnitCompleteModalViewModel(
  { unit, xpEarned, onContinue }: UnitCompleteModalProps,
  ref: React.ForwardedRef<BottomSheetModal>,
) {
  const snapPoints = useMemo(() => ["65%"], []);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const trophyScale = useSharedValue(0);

  useEffect(() => {
    if (unit) {
      const timer = setTimeout(() => setShowConfetti(true), 200);
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
    } else {
      setShowConfetti(false);
      trophyScale.value = 0;
    }
  }, [unit, trophyScale]);

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trophyScale.value }],
  }));

  const lessonCount: number = unit
    ? unit.nodes.filter((n: PathNodeData) => n.type === NodeType.LESSON).length
    : 0;

  const checkpointCount: number = unit
    ? unit.nodes.filter((n: PathNodeData) => n.type === NodeType.CHECKPOINT)
        .length
    : 0;

  const chestCount: number = unit
    ? unit.nodes.filter((n: PathNodeData) => n.type === NodeType.CHEST).length
    : 0;

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
    lessonCount,
    checkpointCount,
    chestCount,
    handleConfettiComplete,
    handleContinue,
    unit,
    xpEarned,
  };
}
