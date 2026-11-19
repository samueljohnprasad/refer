// ponytail: imperative Happi motion surface — production equivalent of .agents/happi.js's window.Happi API.
// One clock drives a mutable keys/shots table (shared values), evaluated every frame into rig + cloud
// matrices. setPose/nudge/look/nod/stretch mutate that table directly; no per-call withTiming/withSequence.
import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import {
  useSharedValue, useFrameCallback, useDerivedValue, type DerivedValue,
} from 'react-native-reanimated';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { flow, type FlowKey } from '@/src/components/ui/motion/flow';
import { NEUTRAL, POSES, ActingPose, type PoseChannels, type PoseRow, type PoseKey, type HappiScene } from './happiPoses';
import {
  CHANNELS, keysFor, channelsToRig, channelsToCloud, type Channel, type Keys, type Shots,
  type RigMatrices, type CloudMatrices,
} from './happiMotionEngine';

export { ActingPose };

const flatKeys = (v: PoseChannels): Keys => {
  const keys = {} as Keys;
  for (const c of CHANNELS) keys[c] = [[0, v[c]], [1, v[c]]] as FlowKey[];
  return keys;
};

function snapshot(keys: Keys, t: number): PoseChannels {
  const v = {} as PoseChannels;
  for (const c of CHANNELS) v[c] = flow(t, keys[c]);
  return v;
}

export interface HappiMatrices {
  rig: RigMatrices;
  cloud: CloudMatrices;
}

export interface HappiGuideMotion {
  pose: DerivedValue<HappiMatrices>;
  /** held props + ground of the current pose; changes only when the pose swaps them */
  scene: HappiScene;
  setPose: (pose: PoseKey) => void;
  setWeather: (f: number, slow?: boolean) => void;
  nod: () => void;
  stretch: () => void;
  look: (gx: number, gy: number, dur?: number) => void;
  nudge: (channel: Channel, value: number, dur?: number) => void;
}

export function useHappiGuideMotion(): HappiGuideMotion {
  const reducedMotion = useReducedMotion();
  const [isForeground, setIsForeground] = useState(AppState.currentState === 'active');

  const keysRef = useSharedValue<Keys>(flatKeys(NEUTRAL));
  const shotsRef = useSharedValue<Shots>({});
  const holdUntilRef = useSharedValue<number>(0);
  const holdRef = useSharedValue<number>(0);
  const sceneRef = useSharedValue<HappiScene>({});
  const [scene, setScene] = useState<HappiScene>({});
  const poseT = useSharedValue<number>(0);
  const idleClock = useSharedValue<number>(0);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => setIsForeground(state === 'active'));
    return () => sub.remove();
  }, []);

  const frame = useFrameCallback(({ timeSincePreviousFrame }) => {
    const dt = Math.min(timeSincePreviousFrame ?? 0, 64);
    poseT.value += dt;
    idleClock.value += dt;
  }, false);

  useEffect(() => {
    frame.setActive(isForeground && !reducedMotion);
    return () => frame.setActive(false);
  }, [frame, isForeground, reducedMotion]);

  const setPose = useCallback((poseKey: PoseKey): void => {
    const row: PoseRow = POSES[poseKey];
    const cur = snapshot(keysRef.value, poseT.value);
    keysRef.value = keysFor(cur, row);
    poseT.value = 0;
    holdUntilRef.value = row.hold >= 1000 ? row.hold + 200 : 0;
    holdRef.value = row.hold;
    const next: HappiScene = { propL: row.propL, propR: row.propR, ground: row.ground };
    sceneRef.value = next;
    setScene((prev) => (prev.propL === next.propL && prev.propR === next.propR && prev.ground === next.ground ? prev : next));
  }, [keysRef, poseT, holdUntilRef, holdRef, sceneRef]);

  const nudge = useCallback((channel: Channel, value: number, dur = 400): void => {
    const t = poseT.value;
    const from = flow(t, keysRef.value[channel]);
    keysRef.value = { ...keysRef.value, [channel]: [[t, from], [t + dur, value]] };
  }, [keysRef, poseT]);

  const setWeather = useCallback((f: number, slow = false): void => {
    nudge('f', f, slow ? 1600 : 600);
  }, [nudge]);

  const look = useCallback((gx: number, gy: number, dur = 400): void => {
    if (poseT.value < holdUntilRef.value) return;
    nudge('gx', gx, dur);
    nudge('gy', gy, dur);
  }, [nudge, poseT, holdUntilRef]);

  const nod = useCallback((): void => {
    shotsRef.value = { ...shotsRef.value, head: { t0: poseT.value, keys: [[0, 0], [160, 5], [460, 0]] } };
  }, [shotsRef, poseT]);

  const stretch = useCallback((): void => {
    shotsRef.value = {
      ...shotsRef.value,
      sy: { t0: poseT.value, keys: [[0, 0], [260, .025], [700, 0]] },
      sink: { t0: poseT.value, keys: [[0, 0], [260, -3], [700, 0]] },
    };
  }, [shotsRef, poseT]);

  const pose = useDerivedValue<HappiMatrices>(() => {
    const t = reducedMotion ? 100000 : poseT.value;
    const idle = reducedMotion ? 0 : idleClock.value;
    const on: 0 | 1 = reducedMotion ? 0 : 1;
    const keys = keysRef.value;
    return {
      rig: channelsToRig(keys, shotsRef.value, t, idle, on, holdRef.value, sceneRef.value),
      cloud: channelsToCloud(flow(t, keys.f), idle),
    };
  }, [reducedMotion]);

  return { pose, scene, setPose, setWeather, nod, stretch, look, nudge };
}
