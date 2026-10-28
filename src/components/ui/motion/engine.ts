// ponytail: rossark-motion worklet engine for living animations
import { Easing } from "react-native-reanimated";
import { flow, type FlowKey } from "./flow";

export { flow, type FlowKey };

/** Things that travel (gaze, sway, a head turning, a lid closing). */
export const EASE_IN_OUT = Easing.bezierFn(0.77, 0, 0.175, 1);

/** Things that open or arrive (a mouth, a lid reopening, a prop appearing). */
export const EASE_OUT = Easing.bezierFn(0.23, 1, 0.32, 1);

/** Only for things leaving or falling away. Never for something the eye is waiting on. */
export const EASE_IN = Easing.bezierFn(0.55, 0, 1, 0.45);

export type Key = readonly [number, number, ("out" | "inOut")?];
export type Keys = readonly Key[];

/** The value of a track at time t. The last key should equal the first, so loops never jump. */
export function track(t: number, keys: Keys): number {
  "worklet";
  if (t <= keys[0][0]) return keys[0][1];
  const len = keys.length;
  for (let i = 1; i < len; i++) {
    const k1 = keys[i];
    if (t <= k1[0]) {
      const k0 = keys[i - 1];
      const span = k1[0] - k0[0];
      const p = span > 0 ? (t - k0[0]) / span : 1;
      const e = k1[2] === "out" ? EASE_OUT(p) : EASE_IN_OUT(p);
      return k0[1] + (k1[1] - k0[1]) * e;
    }
  }
  return keys[len - 1][1];
}

/** 0 -> 1 inside the window [a, b] of a clock (eased), 0 before it, 1 after. */
export function seg(t: number, a: number, b: number, curve: "out" | "inOut" = "out"): number {
  "worklet";
  if (t <= a) return 0;
  if (t >= b) return 1;
  const p = (t - a) / (b - a);
  return curve === "out" ? EASE_OUT(p) : EASE_IN_OUT(p);
}

/** A smooth back-and-forth from -1 to 1. phase (0 to 1) offsets one item from the next. */
export function wave(t: number, period: number, phase = 0): number {
  "worklet";
  return Math.sin((t / period + phase) * Math.PI * 2);
}

/** Progress through a loop, 0 to 1, with a phase (for drifting or falling items). */
export function loop(t: number, period: number, phase = 0): number {
  "worklet";
  const p = (t / period + phase) % 1;
  return p < 0 ? p + 1 : p;
}

/** 0 at both ends of a loop and 1 in the middle: fade in and out. */
export function bell(p: number): number {
  "worklet";
  return Math.sin(Math.PI * Math.min(1, Math.max(0, p)));
}

/** Stable pseudo-random number in [0, 1) for item i. */
export function seeded(i: number, salt = 0): number {
  "worklet";
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}
