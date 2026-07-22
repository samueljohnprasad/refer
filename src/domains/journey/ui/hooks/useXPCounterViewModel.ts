import { useCallback, useEffect, useRef, useState } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  runOnJS,
  Easing,
} from "react-native-reanimated";

export interface XPGain {
  id: string;
  amount: number;
  label: string;
}

export interface XPCounterProps {
  totalIP: number;
  recentGains: XPGain[];
  onGainDismissed?: (id: string) => void;
  onPress?: () => void;
  compact?: boolean;
}

const COUNT_DURATION: number = 600;
const FLYOVER_DURATION: number = 1500;

export function useAnimatedNumberViewModel(value: number, compact: boolean) {
  const [displayValue, setDisplayValue] = useState<number>(value);
  const prevValueRef = useRef<number>(value);
  const scale = useSharedValue<number>(1);

  useEffect(() => {
    const prevValue: number = prevValueRef.current;
    prevValueRef.current = value;

    if (prevValue === value) return;

    scale.value = withSequence(
      withSpring(1.2, { damping: 20, stiffness: 100, overshootClamping: true }),
      withSpring(1, { damping: 20, stiffness: 100, overshootClamping: true }),
    );

    const startTime: number = Date.now();
    const diff: number = value - prevValue;
    const interval = setInterval(() => {
      const elapsed: number = Date.now() - startTime;
      const fraction: number = Math.min(elapsed / COUNT_DURATION, 1);
      const eased: number = 1 - Math.pow(1 - fraction, 3);
      const current: number = Math.round(prevValue + diff * eased);
      setDisplayValue(current);
      if (fraction >= 1) clearInterval(interval);
    }, 16);

    return () => clearInterval(interval);
  }, [value, scale]);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return {
    displayValue,
    scaleStyle,
    compact,
  };
}

export function useGainFlyoverViewModel(
  gain: XPGain,
  onComplete: (id: string) => void,
) {
  const translateY = useSharedValue<number>(0);
  const opacity = useSharedValue<number>(1);

  useEffect(() => {
    translateY.value = withTiming(-40, {
      duration: FLYOVER_DURATION,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withDelay(
      FLYOVER_DURATION * 0.6,
      withTiming(0, { duration: FLYOVER_DURATION * 0.4 }, (finished) => {
        if (finished) {
          runOnJS(onComplete)(gain.id);
        }
      }),
    );
  }, [gain.id, translateY, opacity, onComplete]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return {
    style,
    gain,
  };
}

export function useXPCounterViewModel({
  totalIP,
  recentGains,
  onGainDismissed,
  onPress,
  compact = false,
}: XPCounterProps) {
  const handleFlyoverComplete = useCallback(
    (id: string): void => {
      onGainDismissed?.(id);
    },
    [onGainDismissed],
  );

  return {
    handleFlyoverComplete,
    totalIP,
    recentGains,
    onPress,
    compact,
  };
}
