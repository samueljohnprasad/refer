import { useEffect } from 'react';
import { useSharedValue, withTiming, withDelay, runOnJS, useReducedMotion } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { CelebrationContext } from '../types/celebration';

export function useCelebrationTimeline(isVisible: boolean, type: CelebrationContext['type'], onInteractionAvailable?: () => void) {
  const overlayOpacity = useSharedValue(0);
  const rippleScale = useSharedValue(0);
  const pandaProgress = useSharedValue(0);
  const eyebrowOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const secondaryTextOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  const reducedMotion = useReducedMotion();

  const triggerHaptic = (timeMs: number, hapticStyle: Haptics.ImpactFeedbackStyle) => {
    setTimeout(() => {
      Haptics.impactAsync(hapticStyle);
    }, timeMs);
  };

  const triggerInteractionAvailable = () => {
    if (onInteractionAvailable) {
      onInteractionAvailable();
    }
  };

  useEffect(() => {
    if (isVisible) {
      const isMilestone = type === 'unit' || type === 'course';
      
      // Overlay fades in immediately
      overlayOpacity.value = withTiming(1, { duration: reducedMotion ? 150 : 300 });

      // Panda animation starts at 0ms for milestones, 200ms for lessons
      pandaProgress.value = withDelay(reducedMotion ? 0 : (isMilestone ? 0 : 200), withTiming(1, { duration: reducedMotion ? 300 : 800 }));
      
      // Haptic at the peak of the panda animation
      triggerHaptic(reducedMotion ? 150 : (isMilestone ? 400 : 500), type === 'course' ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Medium);

      // Ripple effect (skip if reduced motion)
      rippleScale.value = reducedMotion ? 0 : withDelay(isMilestone ? 200 : 400, withTiming(1, { duration: 500 }));

      // Eyebrow (Unit Complete / Course Complete)
      eyebrowOpacity.value = withDelay(reducedMotion ? 150 : (isMilestone ? 400 : 500), withTiming(1, { duration: reducedMotion ? 150 : 300 }));

      // Primary text (Skill gained)
      textOpacity.value = withDelay(reducedMotion ? 150 : (isMilestone ? 700 : 700), withTiming(1, { duration: reducedMotion ? 150 : 300 }));

      // Secondary text (Unit title)
      secondaryTextOpacity.value = withDelay(reducedMotion ? 150 : (isMilestone ? 1000 : 900), withTiming(1, { duration: reducedMotion ? 150 : 300 }));

      // Button CTA
      buttonOpacity.value = withDelay(reducedMotion ? 150 : (isMilestone ? 1200 : 1100), withTiming(1, { duration: reducedMotion ? 150 : 300 }, (finished) => {
        if (finished) {
          runOnJS(triggerInteractionAvailable)();
        }
      }));
    } else {
      overlayOpacity.value = 0;
      rippleScale.value = 0;
      pandaProgress.value = 0;
      eyebrowOpacity.value = 0;
      textOpacity.value = 0;
      secondaryTextOpacity.value = 0;
      buttonOpacity.value = 0;
    }
  }, [isVisible, type]);

  return {
    overlayOpacity,
    rippleScale,
    pandaProgress,
    eyebrowOpacity,
    textOpacity,
    secondaryTextOpacity,
    buttonOpacity,
  };
}
