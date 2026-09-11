import { useEffect } from 'react';
import { useSharedValue, withTiming, withDelay, withSequence, runOnJS } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export function useCelebrationTimeline(isVisible: boolean, level: 1 | 2, onInteractionAvailable?: () => void) {
  const overlayOpacity = useSharedValue(0);
  const rippleScale = useSharedValue(0);
  const pandaProgress = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const secondaryTextOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  // Core Timeline
  // 0ms: Start, Haptic
  // 180ms: Overlay fades in (exercise retreats visually)
  // 350ms: Panda interact
  // 850ms: Ripple
  // 1000ms: Copy
  // 1300ms: Secondary copy
  // 1450ms: CTA

  const triggerHaptic = (timeMs: number, hapticLevel: 1 | 2) => {
    setTimeout(() => {
      if (hapticLevel === 1) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }, timeMs);
  };

  const triggerInteractionAvailable = () => {
    if (onInteractionAvailable) {
      onInteractionAvailable();
    }
  };

  useEffect(() => {
    if (isVisible) {
      // 100ms haptic
      triggerHaptic(100, level);

      // 180ms overlay fade in
      overlayOpacity.value = withDelay(180, withTiming(1, { duration: 300 }));

      // 350ms Panda animation (driven by component, we just trigger progress if needed)
      pandaProgress.value = withDelay(350, withTiming(1, { duration: 1000 }));

      // 850ms Ripple
      rippleScale.value = withDelay(850, withTiming(1, { duration: 500 }));

      // 1000ms Primary text
      textOpacity.value = withDelay(1000, withTiming(1, { duration: 300 }));

      // 1300ms Secondary text
      secondaryTextOpacity.value = withDelay(1300, withTiming(1, { duration: 300 }));

      // 1450ms Button CTA
      buttonOpacity.value = withDelay(1450, withTiming(1, { duration: 300 }, (finished) => {
        if (finished) {
          runOnJS(triggerInteractionAvailable)();
        }
      }));
    } else {
      // Reset state
      overlayOpacity.value = 0;
      rippleScale.value = 0;
      pandaProgress.value = 0;
      textOpacity.value = 0;
      secondaryTextOpacity.value = 0;
      buttonOpacity.value = 0;
    }
  }, [isVisible, level]);

  return {
    overlayOpacity,
    rippleScale,
    pandaProgress,
    textOpacity,
    secondaryTextOpacity,
    buttonOpacity,
  };
}
