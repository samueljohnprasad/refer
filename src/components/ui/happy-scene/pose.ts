// ponytail: rossark-motion character performance matching Screenshot 2 design
import { flow } from "../motion/flow";

export type Matrix = [number, number, number, number, number, number];

export const SCENE = {
  duration: 7200,
  floor: 630,
  scale: 1.45,
  pivotX: 120,
  pivotY: 226,
} as const;

function wave(time: number, period: number, phase = 0): number {
  "worklet";
  return Math.sin(2 * Math.PI * (time / period + phase));
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

  // 1. Torso Breathing & Volume Preservation (period 3200ms)
  const breath = 1 + 0.014 * wave(idleTime, 3200);
  const sy = breath;
  const sx = 1 / Math.sqrt(sy); // volume preservation

  // 2. Heartbeat Pulse on Lavender Belly Heart (every 1600ms)
  const heartCycle = (idleTime % 1600) / 1600;
  const heartScale = 1 + (heartCycle < 0.15 ? Math.sin(heartCycle / 0.15 * Math.PI) * 0.08 : 0);

  // 3. Curious Head Tilt around Neck (120, 132)
  const headAngle = flow(t, [
    [0, 0],
    [1200, 2.5],
    [2600, 2.5],
    [3600, -3.2], // curious tilt toward sprout
    [4800, -3.2],
    [5800, 2.0],  // glance toward cloud
    [6600, 0],
    [7200, 0],
  ]) + 0.8 * wave(idleTime, 4400);

  // 4. Ears Follow-Through (lagging behind head motion)
  const earLag = 0.5 * headAngle + 1.2 * wave(idleTime, 4400, 0.15);

  // 5. Natural Arm Swaying from Shoulder Joints
  const armLAngle = 2.2 * wave(idleTime, 3600, 0.1);
  const armRAngle = -2.0 * wave(idleTime, 4000, 0.35);

  // 6. Sliding Pupils & Saccades (look forward, glance at sprout, glance at cloud)
  const gazeX = flow(t, [
    [0, 0],
    [1000, 0],
    [1600, 1.2],  // look warm at user
    [3200, 0],
    [3600, 3.5],  // glance down-right at sprout
    [4800, 3.5],
    [5400, -2.8], // glance up-left at cloud
    [6400, -2.8],
    [6800, 0],    // lock back onto user
    [7200, 0],
  ]) + 0.8 * wave(idleTime, 4800);

  const gazeY = flow(t, [
    [0, 0],
    [3600, 2.2],  // look down at sprout
    [4800, 2.2],
    [5400, -2.0], // look up at cloud
    [6400, -2.0],
    [6800, 0],
    [7200, 0],
  ]) + 0.5 * wave(idleTime, 3600, 0.2);

  // 7. Eyelids Blink (smooth ease-out blinks every 3.5s)
  const lid = Math.max(
    blink(t, 800),
    blink(t, 3100),
    blink(t, 5200),
    blink(idleTime % SCENE.duration, 6400),
  );

  // 8. 2.5D Snout Parallax (nose & mouth shift slightly with gaze)
  const snoutX = gazeX * 0.35;
  const snoutY = gazeY * 0.25;

  // 9. Cheek Squint Pulse with Smile
  const cheekScale = 1 + 0.05 * wave(idleTime, 3200);

  return {
    shadow: matrix(0, 0, 0, 120, 226, sx, 1),
    root: matrix(0, 0, 0, 120, 226, 1, 1),
    body: matrix(0, 0, 0, 120, 194, sx, sy),
    heart: matrix(0, 0, 0, 108, 164, heartScale, heartScale),
    armL: matrix(0, 0, armLAngle, 78, 139),
    armR: matrix(0, 0, armRAngle, 143, 138),
    head: matrix(0, 0, headAngle, 120, 132),
    earL: matrix(0, 0, -earLag, 55, 45),
    earR: matrix(0, 0, earLag, 170, 45),
    face: matrix(snoutX, snoutY),
    cheeks: matrix(0, 0, 0, 120, 103, cheekScale, cheekScale),
    eyes: matrix(0, 0, 0, 112, 83, 1, Math.max(0.06, 1 - lid)),
    pupils: matrix(gazeX, gazeY),
    cloud: matrix(14 * wave(idleTime, 16000), 0),
    plant: matrix(0, 0, 2.5 * wave(idleTime, 3600, 0.2), 324, 601),
  };
}

export type HappyPose = ReturnType<typeof getHappyPose>;
export const getHappySceneMatrices = getHappyPose;
