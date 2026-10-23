import { flow, type FlowKey } from "../motion/flow";

export const SCENE = { duration: 7200, width: 390, height: 844, scale: 1.48, floor: 610 };
export type Matrix = [number, number, number, number, number, number];
const ACT = {
  squash: [[0, 1], [500, 1], [850, .88], [1040, 1.08], [1500, 1.04], [1660, .83], [1900, 1.02], [2200, 1], [7200, 1]],
  lean: [[0, 0], [800, -5], [1100, 3], [1660, 0], [2600, -4], [3600, -3], [4800, 2], [5800, 0], [7200, 0]],
  head: [[0, 0], [800, 5], [1100, -5], [1800, 3], [2700, -7], [4100, -5], [5200, 3], [6200, 0], [7200, 0]],
  yaw: [[0, 0], [600, -.3], [1400, .25], [2200, .1], [2800, -.35], [4000, 0], [5200, .2], [6200, 0], [7200, 0]],
  left: [[0, 0], [850, -18], [1200, 65], [1640, 40], [2100, 12], [2700, 65], [4300, 65], [5200, 0], [7200, 0]],
  elbowL: [[0, 0], [850, -20], [1200, 30], [1700, 15], [2200, 0], [2700, 75], [4300, 75], [5200, 0], [7200, 0]],
  right: [[0, 0], [850, 16], [1200, -60], [1650, -40], [2200, -8], [3000, -15], [4400, -10], [5400, 0], [7200, 0]],
  shift: [[0, 0], [800, -3], [1700, 0], [2600, 5], [4200, 4], [5600, 0], [7200, 0]],
} satisfies Record<string, readonly FlowKey[]>;

function wave(time: number, period: number, phase = 0): number {
  "worklet";
  return Math.sin(2 * Math.PI * (time / period + phase));
}

export function matrix(x = 0, y = 0, angle = 0, px = 0, py = 0, sx = 1, sy = 1): Matrix {
  "worklet";
  const radians = angle * Math.PI / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  return [cosine * sx, sine * sx, -sine * sy, cosine * sy,
    x + px - cosine * sx * px + sine * sy * py,
    y + py - sine * sx * px - cosine * sy * py];
}

function blink(time: number, start: number): number {
  "worklet";
  return flow(time, [[0, 0], [start, 0], [start + 110, 1], [start + 150, 1], [start + 340, 0], [7200, 0]]);
}

export function getHappyPose(time: number, idleTime = time) {
  "worklet";
  const t = Math.min(time, SCENE.duration);
  const breath = 1 + .008 * wave(idleTime, 2400);
  const sy = flow(t, ACT.squash) * breath;
  const jumpProgress = Math.max(0, Math.min(1, (t - 1020) / 620));
  const lift = 4 * 52 * jumpProgress * (1 - jumpProgress);
  const lean = flow(t, ACT.lean) + .7 * wave(idleTime, 7200);
  const yaw = flow(t, ACT.yaw);
  const armL = flow(t, ACT.left) + 1.7 * wave(idleTime, 2400, .2);
  const armR = flow(t, ACT.right) + 2 * wave(idleTime, 3600, .6);
  const waveWindow = flow(t, [[0, 0], [2650, 0], [2900, 1], [4100, 1], [4500, 0], [7200, 0]]);
  const elbowL = flow(t, ACT.elbowL) + 12 * wave(t, 650) * waveWindow
    + .45 * (flow(t - 90, ACT.left) - flow(t, ACT.left));
  const lid = Math.max(blink(t, 600), blink(t, 2460), blink(t, 5500), blink(idleTime % 7200, 6500));
  return {
    shadow: matrix(0, 0, 0, 120, 226, 1 - lift / 160, 1 - lift / 200),
    root: matrix(flow(t, ACT.shift), -lift, lean, 120, 226, 1 / Math.pow(sy, .6), sy),
    legL: matrix(0, 0, lift * .22, 96, 192),
    legR: matrix(0, -lift * .05, -lift * .35, 140, 192),
    body: matrix(.6 * wave(idleTime, 3600), 0),
    armL: matrix(0, 0, armL, 75, 144),
    foreL: matrix(0, 0, elbowL, 58, 164),
    armR: matrix(0, 0, armR, 145, 144),
    foreR: matrix(0, 0, -8 + 3 * wave(idleTime, 2400, .4) + .45 * (flow(t - 100, ACT.right) - flow(t, ACT.right)), 160, 164),
    head: matrix(0, 0, flow(t, ACT.head) - .45 * flow(t - 110, ACT.lean) + .7 * wave(idleTime, 3600), 118, 140),
    earL: matrix(-yaw * 7, 0, 2 * wave(idleTime - 100, 2400), 62, 46),
    earR: matrix(-yaw * 7, 0, 2 * wave(idleTime - 160, 3600), 173, 46),
    face: matrix(yaw * 9, 0),
    eyes: matrix(0, 0, 0, 112, 83, 1, Math.max(.02, 1 - lid)),
    pupils: matrix(yaw * 5, -lift * .03),
    muzzle: matrix(yaw * 3, 0),
    cloud: matrix(5 * wave(idleTime, 14400), 0),
    plant: matrix(0, 0, 2 * wave(idleTime, 3600, .3), 324, 601),
  };
}

export type HappyPose = ReturnType<typeof getHappyPose>;
export type PoseLayer = keyof HappyPose;
