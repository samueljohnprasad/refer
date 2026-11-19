// ponytail: worklet math ported verbatim from the finalized .agents/happi.js (pose()/keysFor()/splice()).
// Reuses flow()/wave()/seeded() from the shared motion engine and matrix() from the happy-scene rig — no
// reinvented math. One continuous worklet evaluated every frame; gestures (nod/stretch/look/nudge) are
// additive "shots" or direct channel-track overrides, not discrete withTiming/withSequence tweens.
import { flow, type FlowKey } from '@/src/components/ui/motion/flow';
import { wave, seeded } from '@/src/components/ui/motion/engine';
import { matrix, type Matrix } from '@/src/components/ui/happy-scene/pose';
import { eyes as EYES, PIVOT } from '@/src/components/ui/happy-scene/art';
import { NEUTRAL, type PoseChannels, type PoseRow, type HappiScene, type PropKind } from './happiPoses';

export type Channel = keyof PoseChannels;
export const CHANNELS = Object.keys(NEUTRAL) as Channel[];
export type Keys = Record<Channel, FlowKey[]>;
export interface Shot { t0: number; keys: FlowKey[] }
export type Shots = Partial<Record<'head' | 'sink' | 'sy', Shot>>;

const PHASE = seeded(7, 3);
const clamp01 = (v: number): number => {
  'worklet';
  return Math.min(1, Math.max(0, v));
};
const easeOutCubic = (p: number): number => {
  'worklet';
  return 1 - Math.pow(1 - p, 3);
};
// thought-cloud colour: clear (#e4eee0) to heavy (#a9bfa0), by weather `f`
const mix = (a: string, b: string, p: number): string => {
  'worklet';
  const h = (x: string): number[] => [1, 3, 5].map((i) => parseInt(x.slice(i, i + 2), 16));
  const A = h(a), B = h(b);
  return `rgb(${A.map((x, i) => Math.round(x + (B[i] - x) * clamp01(p))).join(',')})`;
};
// blink every ~3.7s: close 110ms, hold 40, reopen 190 ease-out
function blink(t: number): number {
  'worklet';
  const p = t % 3700;
  return p < 110 ? p / 110 : p < 150 ? 1 : p < 340 ? 1 - easeOutCubic((p - 150) / 190) : 0;
}

export function keysFor(from: PoseChannels, pose: PoseRow): Keys {
  'worklet';
  const h = pose.hold;
  const keys = {} as Keys;
  for (const c of CHANNELS) {
    const a = from[c];
    const poseValue = (pose as unknown as Record<string, number | undefined>)[c];
    const b = c === 'f' ? (pose.f !== undefined ? pose.f : a) : (poseValue !== undefined ? poseValue : NEUTRAL[c]);
    keys[c] = c[0] === 'a' && Math.abs(b - a) > 20
      ? [[0, a], [h * .25, a - Math.sign(b - a) * 6], [h, b]]
      : [[0, a], [h * .2, a], [h, b]];
  }
  // sy/lift stay flat (1/0) unless a pose sets `hop` — no onboarding pose does, matching happi.js exactly
  // (its per-pose `sy` target is likewise inert there; only `stretch()`'s one-shot and `hop` move it).
  keys.sy = [[0, 1], [1, 1]];
  return keys;
}

function shotValue(shot: Shot | undefined, t: number): number {
  'worklet';
  if (!shot) return 0;
  return flow(t - shot.t0, shot.keys);
}

export interface RigMatrices {
  shadow: Matrix; root: Matrix; body: Matrix; heart: Matrix;
  armL: Matrix; armLFront: Matrix; foreL: Matrix;
  armR: Matrix; foreR: Matrix;
  head: Matrix; earL: Matrix; earR: Matrix; face: Matrix;
  eyes: Matrix; eyesOpacity: number; happyOpacity: number;
  pupils: Matrix; pupilL: Matrix; pupilR: Matrix;
  smileOpacity: number; mouthOpenOpacity: number; mouthOpenMatrix: Matrix;
  stage: Matrix;
  propL: PropPlacement; propR: PropPlacement;
  detail: PropDetail;
}

export interface PropPlacement { matrix: Matrix; opacity: number; sway: Matrix }
export interface DropFrame { matrix: Matrix; opacity: number }
// small idle loops inside props and ground: jar thought bob, lantern glow/flame, flag cloth, water drops, sprout
export interface PropDetail {
  bob: Matrix; glow: Matrix; flame: Matrix; cloth: Matrix;
  drops: [DropFrame, DropFrame, DropFrame];
  sprout: Matrix;
}

const NO_SCENE: HappiScene = {};

function propSway(kind: PropKind | undefined, it: number, t: number): number {
  'worklet';
  switch (kind) {
    case 'lantern': return 4 * wave(it, 2600) + 1.5 * wave(it, 1500, .3);
    case 'frame': return 3 * wave(it, 3400, .1);
    case 'lens': return 2.5 * wave(it, 2400, .4);
    case 'can': return -24 * clamp01((t - 900) / 400) + 2 * wave(it, 2000);
    case 'jar': return 2 * wave(it, 3000, .2);
    case 'flag': return 2 * wave(it, 3600, .5);
    default: return 0;
  }
}

// props stay upright in the paw (counter-rotate the arm) and appear once the paw arrives:
// happi.js `rotate(-world paw) translate(paw) scale(k)` collapses to one matrix with translation = paw
function placeProp(paw: readonly [number, number], world: number, grow: number, kind: PropKind | undefined, it: number, t: number): PropPlacement {
  'worklet';
  const th = (-world * Math.PI) / 180, c = Math.cos(th), s = Math.sin(th);
  const k = .92 + .08 * easeOutCubic(grow);
  return {
    matrix: [c * k, s * k, -s * k, c * k, paw[0], paw[1]],
    opacity: grow > 0 ? easeOutCubic(grow) : 0,
    sway: matrix(0, 0, propSway(kind, it, t)),
  };
}

export function channelsToRig(
  keys: Keys, shots: Shots, t: number, idleTime: number, on: 0 | 1, hold = 0, scene: HappiScene = NO_SCENE,
): RigMatrices {
  'worklet';
  const v = {} as PoseChannels;
  for (const c of CHANNELS) v[c] = flow(t, keys[c]);
  const lag = (c: Channel): number => flow(Math.max(0, t - 90), keys[c]) - v[c];
  const it = idleTime, ph = PHASE;

  const aL = v.aL + on * (2 * wave(it, 3000, ph) + 1 * wave(it, 1800, ph + .3));
  const eL = v.eL + .45 * lag('aL') + on * 2.5 * wave(it, 2200, ph + .6);
  const aR = v.aR + on * (2 * wave(it, 4000, ph + .35) + 1 * wave(it, 2600, ph + .1));
  const eR = v.eR + .45 * lag('aR') + on * 2.5 * wave(it, 2800, ph + .9);
  const lean = v.lean + on * .8 * wave(it, 5200, ph + .2);
  const shift = v.shift + on * 1.2 * wave(it, 4800, ph + .5);
  const head = v.head - .45 * flow(Math.max(0, t - 110), keys.lean) + on * 1.5 * wave(it, 4400, ph) + shotValue(shots.head, t);
  const ear = .5 * (head - v.head) + on * 1.2 * wave(it, 4400, ph + .15);
  const breath = 1 + on * .014 * wave(it, 3200, ph);
  const sy = v.sy;
  const sx = 1 / Math.pow(sy, .6);
  const gx = v.gx + on * .6 * wave(it, 4800, ph + .4);
  const gy = v.gy + on * .4 * wave(it, 3600, ph + .2);
  const blinkLid = on ? blink(it + ph * 3700) : 0;
  const lid = v.lid + (1 - v.lid) * blinkLid;
  const heartBeat = (it % 1600) / 1600;
  const hs = 1 + on * (heartBeat < .15 ? Math.sin((heartBeat / .15) * Math.PI) * .08 : 0);

  const [fx, fy] = PIVOT.floor;
  const bodySquash = breath * (v.sy + shotValue(shots.sy, t));
  const bodySx = 1 / Math.pow(bodySquash, .6);
  const joy = clamp01((v.cheek - .6) / .1);
  const eyePupil = EYES[0].pupil, earPupilR = EYES[1].pupil;
  const grow = clamp01((t - hold * .45) / 260);
  const pour = clamp01((t - 1200) / 200) * on;
  const drop = (i: number): DropFrame => {
    const p = ((it + seeded(i) * 700) % 700) / 700;
    return { matrix: matrix(-2 * p, 4 + 42 * p * p), opacity: pour * Math.sin(Math.PI * p) };
  };
  const sproutGrow = .7 + .3 * easeOutCubic(clamp01((t - 1400) / 1800));

  return {
    shadow: matrix(shift, 0, 0, fx, fy, sx, 1),
    root: matrix(shift, 0, lean, fx, fy, sx, sy),
    body: matrix(0, 0, 0, PIVOT.body[0], PIVOT.body[1], bodySx, bodySquash),
    heart: matrix(0, 0, 0, PIVOT.heart[0], PIVOT.heart[1], hs, hs),
    armL: matrix(0, 0, aL, PIVOT.shoulderL[0], PIVOT.shoulderL[1]),
    armLFront: matrix(0, 0, aL, PIVOT.shoulderL[0], PIVOT.shoulderL[1]),
    foreL: matrix(0, 0, eL, PIVOT.elbowL[0], PIVOT.elbowL[1]),
    armR: matrix(0, 0, -aR, PIVOT.shoulderR[0], PIVOT.shoulderR[1]),
    foreR: matrix(0, 0, -eR, PIVOT.elbowR[0], PIVOT.elbowR[1]),
    head: matrix(0, v.sink + shotValue(shots.sink, t), head, PIVOT.neck[0], PIVOT.neck[1]),
    earL: matrix(0, 0, -ear, PIVOT.earL[0], PIVOT.earL[1]),
    earR: matrix(0, 0, ear, PIVOT.earR[0], PIVOT.earR[1]),
    face: matrix(gx * .35, gy * .25),
    eyes: matrix(0, 0, 0, PIVOT.eyes[0], PIVOT.eyes[1], 1, Math.max(.06, 1 - lid)),
    eyesOpacity: 1 - joy,
    happyOpacity: joy,
    pupils: matrix(gx, gy),
    pupilL: matrix(0, 0, 0, eyePupil.cx, eyePupil.cy, v.pup, v.pup),
    pupilR: matrix(0, 0, 0, earPupilR.cx, earPupilR.cy, v.pup, v.pup),
    smileOpacity: v.mouth > .03 ? 0 : 1,
    mouthOpenOpacity: v.mouth > .03 ? 1 : 0,
    mouthOpenMatrix: matrix(0, 0, 0, PIVOT.mouth[0], PIVOT.mouth[1], 1, Math.max(.01, v.mouth)),
    stage: matrix(0, v.stage),
    propL: placeProp(PIVOT.pawL, lean + aL + eL, grow, scene.propL, it, t),
    propR: placeProp(PIVOT.pawR, lean - aR - eR, grow, scene.propR, it, t),
    detail: {
      bob: matrix(1.2 * wave(it, 2600), (-2 * (wave(it, 1900) + 1)) / 2),
      glow: matrix(0, 0, 0, 0, 25, 1 + on * .04 * wave(it, 3200), 1 + on * .04 * wave(it, 3200)),
      flame: matrix(0, 0, 3 * wave(it, 700) * on, 0, 29, 1, 1 + on * .05 * wave(it, 1100)),
      cloth: matrix(0, 0, 4 * wave(it, 900) * on, 1, -44, 1 + .06 * wave(it, 1300, .3) * on, 1),
      drops: [drop(0), drop(1), drop(2)],
      sprout: matrix(40, 244, on * 2.5 * wave(it, 3600, .2), 0, 0, sproutGrow, sproutGrow),
    },
  };
}

export interface CloudMatrices {
  sun: Matrix; sunOpacity: number; rays: Matrix;
  cloud: Matrix; cloudFill: string;
  c0: Matrix; c1: Matrix; c2: Matrix; puffOpacity: number; c3Opacity: number;
}

// thought-cloud prop: how heavy the thought feels (f, 0 clear..1 heavy), ported verbatim from happi.js.
// Rain was in the handoff spec but never shipped in the approved happi.js — matching the approved build, not the spec.
export function channelsToCloud(f: number, idleTime: number): CloudMatrices {
  'worklet';
  const clear = 1 - f;
  const part = clamp01((clear - .6) / .35);
  const angle = (-10 + 80 * clear) * Math.PI / 180;
  return {
    sun: matrix(240 + 30 * Math.cos(angle), 44 - 30 * Math.sin(angle)),
    sunOpacity: clamp01(1.15 - f * 1.4),
    rays: matrix(0, 0, (idleTime / 40000) * 360 % 360),
    cloud: matrix(1.5 * wave(idleTime, 7000), 0),
    cloudFill: mix('#e4eee0', '#a9bfa0', f),
    c0: matrix(-12 * part, 2 * part, 0, 229, 30, 1 - .3 * part, 1 - .3 * part),
    c1: matrix(0 * part, -7 * part, 0, 245, 22, 1 - .3 * part, 1 - .3 * part),
    c2: matrix(12 * part, 3 * part, 0, 260, 31, 1 - .3 * part, 1 - .3 * part),
    puffOpacity: 1 - .6 * part,
    c3Opacity: 1 - part,
  };
}
