// ponytail: reveal animations ported from .agents/onboarding.html's @keyframes (drop/rise/say/send/stick),
// as Reanimated custom entering functions. Each takes an optional stagger delay in ms.
import { withDelay, withTiming, Easing } from 'react-native-reanimated';

const OPEN = Easing.bezier(0.23, 1, 0.32, 1); // --open
const EASE = Easing.bezier(0.32, 0.72, 0, 1); // --ease

type EnteringResult = { initialValues: Record<string, unknown>; animations: Record<string, unknown> };

/** @keyframes drop: from{opacity:0;transform:translateY(-10px)} — goal-pick / pick tiles */
export function dropIn(delayMs = 0, durationMs = 450) {
  return (): EnteringResult => {
    'worklet';
    return {
      initialValues: { opacity: 0, transform: [{ translateY: -10 }] },
      animations: {
        opacity: withDelay(delayMs, withTiming(1, { duration: durationMs, easing: OPEN })),
        transform: [{ translateY: withDelay(delayMs, withTiming(0, { duration: durationMs, easing: OPEN })) }],
      },
    };
  };
}

/** @keyframes rise: from{opacity:0;transform:translateY(24px) scale(.97)} — scene art / saved card */
export function riseIn(delayMs = 0, durationMs = 300) {
  return (): EnteringResult => {
    'worklet';
    return {
      initialValues: { opacity: 0, transform: [{ translateY: 24 }, { scale: 0.97 }] },
      animations: {
        opacity: withDelay(delayMs, withTiming(1, { duration: durationMs, easing: OPEN })),
        transform: [
          { translateY: withDelay(delayMs, withTiming(0, { duration: durationMs, easing: OPEN })) },
          { scale: withDelay(delayMs, withTiming(1, { duration: durationMs, easing: OPEN })) },
        ],
      },
    };
  };
}

/** @keyframes say: from{opacity:0;transform:translateY(8px) scale(.97)} — Happi chat bubbles, quick replies */
export function sayIn(delayMs = 0, durationMs = 220) {
  return (): EnteringResult => {
    'worklet';
    return {
      initialValues: { opacity: 0, transform: [{ translateY: 8 }, { scale: 0.97 }] },
      animations: {
        opacity: withDelay(delayMs, withTiming(1, { duration: durationMs, easing: OPEN })),
        transform: [
          { translateY: withDelay(delayMs, withTiming(0, { duration: durationMs, easing: OPEN })) },
          { scale: withDelay(delayMs, withTiming(1, { duration: durationMs, easing: OPEN })) },
        ],
      },
    };
  };
}

/** @keyframes send: from{opacity:0;transform:scale(.94)} — the user's own chat bubble */
export function sendIn(durationMs = 200) {
  return (): EnteringResult => {
    'worklet';
    return {
      initialValues: { opacity: 0, transform: [{ scale: 0.94 }] },
      animations: {
        opacity: withTiming(1, { duration: durationMs, easing: OPEN }),
        transform: [{ scale: withTiming(1, { duration: durationMs, easing: OPEN }) }],
      },
    };
  };
}

/**
 * @keyframes stick: from{opacity:0;transform:rotate(8deg) scale(.95) translateY(-6px)} — saved-card sticker.
 * The card's permanent 8deg tilt is held constant throughout (never animated) and owned entirely by this
 * entering function so it doesn't fight a separate static `transform` style on the same view.
 */
export function stickIn(delayMs = 200, durationMs = 250) {
  return (): EnteringResult => {
    'worklet';
    return {
      initialValues: { opacity: 0, transform: [{ rotate: '8deg' }, { scale: 0.95 }, { translateY: -6 }] },
      animations: {
        opacity: withDelay(delayMs, withTiming(1, { duration: durationMs, easing: OPEN })),
        transform: [
          { rotate: '8deg' },
          { scale: withDelay(delayMs, withTiming(1, { duration: durationMs, easing: OPEN })) },
          { translateY: withDelay(delayMs, withTiming(0, { duration: durationMs, easing: OPEN })) },
        ],
      },
    };
  };
}

/** @keyframes pop/turn: from{opacity:0;transform:scale(fromScale)} — checkmark badge, saved-card turn-arrow */
export function popIn(delayMs = 0, durationMs = 250, fromScale = 0.95) {
  return (): EnteringResult => {
    'worklet';
    return {
      initialValues: { opacity: 0, transform: [{ scale: fromScale }] },
      animations: {
        opacity: withDelay(delayMs, withTiming(1, { duration: durationMs, easing: OPEN })),
        transform: [{ scale: withDelay(delayMs, withTiming(1, { duration: durationMs, easing: OPEN })) }],
      },
    };
  };
}

/** @keyframes fade: from{opacity:0} — the s0/s1/chat screen-level fade */
export function fadeIn(durationMs = 300) {
  return (): EnteringResult => {
    'worklet';
    return {
      initialValues: { opacity: 0 },
      animations: { opacity: withTiming(1, { duration: durationMs, easing: EASE }) },
    };
  };
}
