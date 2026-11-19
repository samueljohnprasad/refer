// ponytail: a fact lands on the pan like the prototype's `.stone` (drop .45s, same easing): slides down from
// 16 units above while fading in. Owns its own mount animation so the scale art stays JSX-only.
import React, { useEffect } from 'react';
import Animated, { useAnimatedProps, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { G } from 'react-native-svg';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';

const AnimatedG = Animated.createAnimatedComponent(G);
const LAND = Easing.bezier(0.34, 1.56, 0.64, 1);

export function TRDropIn({ children }: { children: React.ReactNode }): React.JSX.Element {
  const reducedMotion = useReducedMotion();
  const t = useSharedValue(reducedMotion ? 1 : 0);
  useEffect(() => {
    if (!reducedMotion) t.value = withTiming(1, { duration: 450, easing: LAND });
  }, [reducedMotion, t]);
  const props = useAnimatedProps<Record<string, unknown>>(() => ({
    matrix: [1, 0, 0, 1, 0, -16 * (1 - t.value)],
    opacity: Math.min(1, t.value * 3),
  }));
  return <AnimatedG animatedProps={props}>{children}</AnimatedG>;
}
