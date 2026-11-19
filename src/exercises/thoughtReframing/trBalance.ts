// ponytail: pure rules for the evidence balance, copied from .agents/thought-reframing.html
// (`tilt`, `ends`, `SLOTS`, `stones`). No JSX, no hooks. `'worklet'` lets Reanimated call these on the UI thread.
export const PIVOT = { x: 160, y: 50 } as const;
const ARM = 104;
const MAX_TILT = 14;
const PER_FACT = 5;
export const MAX_STONES = 6;

/** More facts against tips the beam right (positive degrees), more facts for tips it left. */
export function trTilt(forCount: number, againstCount: number): number {
  'worklet';
  return Math.max(-MAX_TILT, Math.min(MAX_TILT, (againstCount - forCount) * PER_FACT));
}

/** Where each pan hangs from, for a beam tilted by `deg`: [left, right]. */
export function trPanAnchors(deg: number): [[number, number], [number, number]] {
  'worklet';
  const r = (deg * Math.PI) / 180;
  const c = Math.cos(r) * ARM;
  const s = Math.sin(r) * ARM;
  return [[PIVOT.x - c, PIVOT.y - s], [PIVOT.x + c, PIVOT.y + s]];
}

/** 2D affine [a, b, c, d, e, f] for a rotation about the pivot, the form react-native-svg's `matrix` takes. */
export function trBeamMatrix(deg: number): number[] {
  'worklet';
  const r = (deg * Math.PI) / 180;
  const cos = Math.cos(r);
  const sin = Math.sin(r);
  return [cos, sin, -sin, cos, PIVOT.x - PIVOT.x * cos + PIVOT.y * sin, PIVOT.y - PIVOT.x * sin - PIVOT.y * cos];
}

const SLOTS: ReadonlyArray<readonly [number, number]> = [[-20, 0], [0, 0], [20, 0], [-10, 1], [10, 1], [0, 2]];

export interface StonePlan {
  /** x offset on the pan, and the base y of the stone */
  slots: ReadonlyArray<{ x: number; cy: number }>;
  /** facts past the sixth are counted, not drawn */
  overflow: number;
}

export function trStonePlan(count: number): StonePlan {
  const shown = Math.min(Math.max(count, 0), MAX_STONES);
  return {
    slots: SLOTS.slice(0, shown).map(([x, row]) => ({ x, cy: 37 - row * 14 })),
    overflow: Math.max(0, count - MAX_STONES),
  };
}
