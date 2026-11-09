// Happi performance: raises a paw, waves hi, then holds the brand waving pose with idle life.
import { flow } from "../motion/flow";
import { PIVOT } from "./art";

export type Matrix = [number, number, number, number, number, number];

export const SCENE = {
  duration: 7200,
  floor: 650,
  scale: 1.75,
  pivotX: PIVOT.floor[0],
  pivotY: PIVOT.floor[1],
} as const;

const WAVE = { start: 1150, end: 4300, fade: 300, amp: 13, period: 680 } as const;

function wave(time: number, period: number, phase = 0): number {
  "worklet";
  return Math.sin(2 * Math.PI * (time / period + phase));
}

function clamp01(value: number): number {
  "worklet";
  return Math.min(1, Math.max(0, value));
}

export function matrix(x = 0, y = 0, angle = 0, px = 0, py = 0, sx = 1, sy = 1): Matrix {
  "worklet";
  const radians = (angle * Math.PI) / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  return [
    cosine * sx,
    sine * sx,
    -sine * sy,
    cosine * sy,
    x + px - cosine * sx * px + sine * sy * py,
    y + py - sine * sx * px - cosine * sy * py,
  ];
}

function blink(time: number, start: number): number {
  "worklet";
  return flow(time, [
    [0, 0],
    [start, 0],
    [start + 110, 1],
    [start + 150, 1],
    [start + 320, 0],
    [SCENE.duration, 0],
  ]);
}

export function getHappyPose(time: number, idleTime = time) {
  "worklet";
  const t = Math.min(time, SCENE.duration);

  const breath = 1 + 0.014 * wave(idleTime, 3200);
  const sy = breath;
  const sx = 1 / Math.pow(sy, 0.6);

  const heartCycle = (idleTime % 1600) / 1600;
  const heartScale = 1 + (heartCycle < 0.15 ? Math.sin((heartCycle / 0.15) * Math.PI) * 0.08 : 0);

  const headAngle = flow(t, [
    [0, 0],
    [1200, 3],
    [2600, 3],
    [3600, -3.2],
    [4800, -3.2],
    [5800, 2.0],
    [6600, 0],
    [7200, 0],
  ]) + 0.8 * wave(idleTime, 4400);

  const earLag = 0.5 * headAngle + 1.2 * wave(idleTime, 4400, 0.15);

  // Waving arm (viewer's left): positive angles swing outward. Shoulder leads, elbow trails 90 ms.
  const shoulderKeys = [[0, 12], [450, 10], [1150, 50], [7200, 50]] as const;
  const elbowKeys = [[0, 6], [450, 4], [1150, 125], [7200, 125]] as const;
  // Palm turns toward the viewer as the forearm rises past horizontal (shoulder + elbow > 90).
  const padOpacity = clamp01((flow(t, shoulderKeys) + flow(t, elbowKeys) - 95) / 40);
  const waveEnvelope =
    clamp01((t - WAVE.start) / WAVE.fade) * clamp01((WAVE.end - t) / WAVE.fade);
  const shoulderL = flow(t, shoulderKeys) + 2 * wave(idleTime, 3000);
  const elbowL =
    flow(t, elbowKeys) +
    0.45 * (flow(Math.max(0, t - 90), shoulderKeys) - flow(t, shoulderKeys)) +
    WAVE.amp * wave(t - WAVE.start, WAVE.period) * waveEnvelope +
    3 * wave(idleTime, 2200, 0.4);

  // Hanging arm (viewer's right): negative angles swing outward, out of phase with the left.
  const shoulderR = -16 - 2 * wave(idleTime, 4000, 0.35);
  const elbowR = 8 + 2.5 * wave(idleTime, 2800, 0.6);

  const gazeX = flow(t, [
    [0, 0],
    [1000, 0],
    [1600, 1.2],
    [3200, 0],
    [3600, 3.5],
    [4800, 3.5],
    [5400, -2.8],
    [6400, -2.8],
    [6800, 0],
    [7200, 0],
  ]) + 0.8 * wave(idleTime, 4800);

  const gazeY = flow(t, [
    [0, 0],
    [3600, 2.2],
    [4800, 2.2],
    [5400, -2.0],
    [6400, -2.0],
    [6800, 0],
    [7200, 0],
  ]) + 0.5 * wave(idleTime, 3600, 0.2);

  const lid = Math.max(
    blink(t, 800),
    blink(t, 3100),
    blink(t, 5200),
    blink(idleTime % SCENE.duration, 6400),
  );

  const [fx, fy] = PIVOT.floor;
  return {
    shadow: matrix(0, 0, 0, fx, fy, sx, 1),
    root: matrix(0, 0, 0, fx, fy, 1, 1),
    body: matrix(0, 0, 0, PIVOT.body[0], PIVOT.body[1], sx, sy),
    heart: matrix(0, 0, 0, PIVOT.heart[0], PIVOT.heart[1], heartScale, heartScale),
    armL: matrix(0, 0, shoulderL, PIVOT.shoulderL[0], PIVOT.shoulderL[1]),
    foreL: matrix(0, 0, elbowL, PIVOT.elbowL[0], PIVOT.elbowL[1]),
    padOpacity,
    armR: matrix(0, 0, shoulderR, PIVOT.shoulderR[0], PIVOT.shoulderR[1]),
    foreR: matrix(0, 0, elbowR, PIVOT.elbowR[0], PIVOT.elbowR[1]),
    head: matrix(0, 0, headAngle, PIVOT.neck[0], PIVOT.neck[1]),
    earL: matrix(0, 0, -earLag, PIVOT.earL[0], PIVOT.earL[1]),
    earR: matrix(0, 0, earLag, PIVOT.earR[0], PIVOT.earR[1]),
    face: matrix(gazeX * 0.35, gazeY * 0.25),
    eyes: matrix(0, 0, 0, PIVOT.eyes[0], PIVOT.eyes[1], 1, Math.max(0.06, 1 - lid)),
    pupils: matrix(gazeX, gazeY),
    cloud: matrix(14 * wave(idleTime, 16000), 0),
    plant: matrix(0, 0, 2.5 * wave(idleTime, 3600, 0.2), 324, 601),
  };
}

export type HappyPose = ReturnType<typeof getHappyPose>;
export const getHappySceneMatrices = getHappyPose;
