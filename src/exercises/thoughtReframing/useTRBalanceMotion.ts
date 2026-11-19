// ponytail: container for the balance's motion — the beam settles with the prototype's .6s
// cubic-bezier(.34,1.56,.64,1) (a little overshoot), the pans hang plumb from its ends.
import { useEffect } from 'react';
import { Easing, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { trBeamMatrix, trPanAnchors, trTilt } from './trBalance';

export const SETTLE_EASE = Easing.bezier(0.34, 1.56, 0.64, 1);

type AnyProps = Record<string, unknown>;

export interface TRBalanceMotion {
  beamProps: AnyProps;
  forPanProps: AnyProps;
  againstPanProps: AnyProps;
}

export function useTRBalanceMotion(forCount: number, againstCount: number): TRBalanceMotion {
  const reducedMotion = useReducedMotion();
  const deg = useSharedValue(trTilt(forCount, againstCount));

  useEffect(() => {
    const target = trTilt(forCount, againstCount);
    deg.value = reducedMotion ? target : withTiming(target, { duration: 600, easing: SETTLE_EASE });
  }, [forCount, againstCount, reducedMotion, deg]);

  const beamProps = useAnimatedProps<AnyProps>(() => ({ matrix: trBeamMatrix(deg.value) }));
  const forPanProps = useAnimatedProps<AnyProps>(() => {
    const [[x, y]] = trPanAnchors(deg.value);
    return { matrix: [1, 0, 0, 1, x, y] };
  });
  const againstPanProps = useAnimatedProps<AnyProps>(() => {
    const [, [x, y]] = trPanAnchors(deg.value);
    return { matrix: [1, 0, 0, 1, x, y] };
  });

  return { beamProps, forPanProps, againstPanProps };
}
