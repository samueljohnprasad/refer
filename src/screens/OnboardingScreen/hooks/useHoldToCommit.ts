import { useCallback, useRef, useState } from "react";
import {
  useSharedValue,
  withTiming,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const HOLD_DURATION_MS = 1500;

interface UseHoldToCommitReturn {
  progress: { value: number };
  isHolding: boolean;
  committed: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
}

export const useHoldToCommit = (
  onCommit: () => void,
): UseHoldToCommitReturn => {
  const progress = useSharedValue(0);
  const [isHolding, setIsHolding] = useState(false);
  const [committed, setCommitted] = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleComplete = useCallback(() => {
    setCommitted(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onCommit();
  }, [onCommit]);

  const onPressIn = useCallback(() => {
    if (committed) return;
    setIsHolding(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    progress.value = withTiming(1, {
      duration: HOLD_DURATION_MS,
      easing: Easing.linear,
    });

    holdTimerRef.current = setTimeout(() => {
      runOnJS(handleComplete)();
    }, HOLD_DURATION_MS);
  }, [committed, progress, handleComplete]);

  const onPressOut = useCallback(() => {
    if (committed) return;
    setIsHolding(false);

    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    progress.value = withTiming(0, { duration: 200 });
  }, [committed, progress]);

  return { progress, isHolding, committed, onPressIn, onPressOut };
};
