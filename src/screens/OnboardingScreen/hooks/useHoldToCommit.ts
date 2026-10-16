import { useCallback, useRef, useState } from "react";
import {
  useSharedValue,
  withTiming,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const HOLD_DURATION_MS = 800;

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
  const tickTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hasCompletedRef = useRef(false);

  const clearAllTimers = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    tickTimersRef.current.forEach((timer) => clearTimeout(timer));
    tickTimersRef.current = [];
  }, []);

  const handleComplete = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    clearAllTimers();
    setCommitted(true);
    setIsHolding(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Micro-transition acknowledgment (~550ms) before moving directly into reminders
    setTimeout(() => {
      onCommit();
    }, 550);
  }, [clearAllTimers, onCommit]);

  const onPressIn = useCallback(() => {
    if (committed || hasCompletedRef.current) return;
    setIsHolding(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    progress.value = withTiming(1, {
      duration: HOLD_DURATION_MS,
      easing: Easing.linear,
    });

    // Subtle haptic near completion
    tickTimersRef.current = [
      setTimeout(() => {
        Haptics.selectionAsync();
      }, 550),
    ];

    holdTimerRef.current = setTimeout(() => {
      runOnJS(handleComplete)();
    }, HOLD_DURATION_MS);
  }, [committed, progress, handleComplete]);

  const onPressOut = useCallback(() => {
    if (committed || hasCompletedRef.current) return;
    setIsHolding(false);
    clearAllTimers();

    // ponytail: fallback to complete on tap so reviewers/quick-tappers never get stuck
    progress.value = withTiming(
      1,
      {
        duration: 250,
        easing: Easing.out(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(handleComplete)();
        }
      },
    );
  }, [committed, progress, clearAllTimers, handleComplete]);

  return { progress, isHolding, committed, onPressIn, onPressOut };
};
