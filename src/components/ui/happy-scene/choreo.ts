// ponytail: choreo and pose math for living Happi panda following rossark-motion-skill
import { flow, track, wave, type FlowKey, type Keys } from "../motion/engine";

export const SCENE = {
  duration: 7200,
  width: 390,
  height: 844,
  floorY: 620,
  pivotX: 280,
  pivotY: 390, // neck pivot
} as const;

export interface HappiPose {
  lift: number;
  sx: number;
  sy: number;
  lean: number;
  shift: number;
  yaw: number;
  head: number;
  gazeX: number;
  gazeY: number;
  lid: number;
  cheek: number;
  mouthOpen: number;
  armWa: number;
  armWe: number;
  armHa: number;
  armHe: number;
  float: number;
  shadowScale: number;
  cloudX: number;
  plantAngle: number;
}

const ACT = {
  // Height scale: anticipation crouch, airborne stretch, landing squash, rebound, rest
  sy: [
    [0, 1],
    [750, 1],
    [980, 0.92],
    [1250, 1.07],
    [1550, 1.04],
    [1720, 0.84],
    [1950, 1.03],
    [2200, 1],
    [7200, 1],
  ],
  lean: [
    [0, 0],
    [950, -3],
    [1300, 2],
    [1720, 0],
    [2400, -3],
    [3600, -2],
    [4800, 1],
    [5600, 0],
    [7200, 0],
  ],
  shift: [
    [0, 0],
    [900, -4],
    [1720, 0],
    [2400, 6],
    [4200, 5],
    [5600, 0],
    [7200, 0],
  ],
  yaw: [
    [0, 0],
    [1000, -0.08],
    [1720, 0],
    [2400, 0.18],
    [4400, 0.16],
    [5600, 0],
    [7200, 0],
  ],
  head: [
    [0, 0],
    [950, 3],
    [1300, -4],
    [1720, 2],
    [2400, 5],
    [3400, 4],
    [4600, -2],
    [5600, 0],
    [7200, 0],
  ],
  // Waving arm: shoulder angle and elbow bend
  armWa: [
    [0, 24],
    [850, 32],
    [1250, 68],
    [1720, 36],
    [2200, 60],
    [4800, 60],
    [5800, 28],
    [7200, 24],
  ],
  armWe: [
    [0, 14],
    [850, 8],
    [1250, 40],
    [1720, 20],
    [2200, 112],
    [4800, 112],
    [5800, 20],
    [7200, 14],
  ],
  // Hanging arm: subtle balance
  armHa: [
    [0, 18],
    [950, 12],
    [1250, 42],
    [1720, 20],
    [2400, 16],
    [4800, 18],
    [7200, 18],
  ],
  armHe: [
    [0, -8],
    [950, 0],
    [1250, -24],
    [1720, -12],
    [2400, -8],
    [4800, -8],
    [7200, -8],
  ],
  gazeX: [
    [0, 0],
    [800, -1.5],
    [1720, 0],
    [2400, 2.5],
    [4200, 1.5],
    [5600, 0],
    [7200, 0],
  ],
  gazeY: [
    [0, 0],
    [900, 2],
    [1350, -2],
    [1720, 1],
    [2400, -0.5],
    [5600, 0],
    [7200, 0],
  ],
  cheek: [
    [0, 0],
    [2100, 0],
    [2400, 1],
    [4800, 1],
    [5500, 0],
    [7200, 0],
  ],
  mouth: [
    [0, 0.1],
    [1200, 0.4],
    [1720, 0.2],
    [2300, 0.7],
    [4800, 0.6],
    [5600, 0.2],
    [7200, 0.1],
  ],
} satisfies Record<string, readonly FlowKey[]>;

// Blinks every ~3.5s: close in 110ms, hold 40ms, reopen in 190ms with ease-out
const BLINK_CYCLE = 3600;
const BLINK_KEYS: Keys = [
  [0, 0],
  [1200, 0],
  [1310, 1],
  [1350, 1],
  [1540, 0, "out"],
  [BLINK_CYCLE, 0],
];

export function getHappiPose(time: number, idleTime = time): HappiPose {
  "worklet";
  const actingTime = Math.min(time, SCENE.duration);

  // Hop lift parabola between 1080ms and 1720ms
  let lift = 0;
  let float = 0;
  if (actingTime >= 1080 && actingTime < 1720) {
    const k = (actingTime - 1080) / 640;
    lift = 50 * 4 * k * (1 - k);
    float = 1 - Math.abs(2 * k - 1) * 0.4;
  }

  // Breathing & idle waves
  const breath = 0.012 * wave(idleTime, 2400);
  const baseSy = flow(actingTime, ACT.sy);
  const sy = baseSy * (1 + breath);
  const sx = 1 / Math.pow(sy, 0.6); // volume preservation

  const lean = flow(actingTime, ACT.lean) + 0.8 * wave(idleTime, 4800);
  const shift = flow(actingTime, ACT.shift) + 1.2 * wave(idleTime, 3600);
  const yaw = flow(actingTime, ACT.yaw) + 0.04 * wave(idleTime, 4200);

  // Counter-motion: head follows body lean delayed with negative coefficient
  const headFollowThrough = -0.42 * flow(Math.max(0, actingTime - 110), ACT.lean);
  const head = flow(actingTime, ACT.head) + headFollowThrough + 1.6 * wave(idleTime, 4000, 0.3);

  // Waving forearm motion: ±13 deg on a 680ms beat when raised
  const waveWindow = actingTime >= 2200 && actingTime <= 5000 ? 1 : 0;
  const forearmWave = 13 * wave(actingTime, 680) * waveWindow;
  const armWa = flow(actingTime, ACT.armWa) + 1.4 * wave(idleTime, 3000);
  const armWe = flow(actingTime, ACT.armWe) + forearmWave + 1.2 * wave(idleTime, 2200);

  // Hanging arm follow-through: trails torso lean
  const armTrail = 0.4 * (flow(Math.max(0, actingTime - 90), ACT.armHa) - flow(actingTime, ACT.armHa));
  const armHa = flow(actingTime, ACT.armHa) + armTrail + 1.6 * wave(idleTime, 3200, 0.5);
  const armHe = flow(actingTime, ACT.armHe) + 1.2 * wave(idleTime, 2800);

  // Eye blinks & gaze
  const blinkPhase = idleTime % BLINK_CYCLE;
  const lid = track(blinkPhase, BLINK_KEYS);
  const gazeX = flow(actingTime, ACT.gazeX) + 1.2 * wave(idleTime, 4200);
  const gazeY = flow(actingTime, ACT.gazeY) + 0.8 * wave(idleTime, 3200);
  const cheek = flow(actingTime, ACT.cheek);
  const mouthOpen = flow(actingTime, ACT.mouth);

  // Ground shadow scales down as character lifts
  const ground = 1 - Math.min(1, lift / 220);
  const shadowScale = ground * sx;

  // Environment
  const cloudX = 8 * wave(idleTime, 16000);
  const plantAngle = 2.4 * wave(idleTime, 4400, 0.2);

  return {
    lift,
    sx,
    sy,
    lean,
    shift,
    yaw,
    head,
    gazeX,
    gazeY,
    lid,
    cheek,
    mouthOpen,
    armWa,
    armWe,
    armHa,
    armHe,
    float,
    shadowScale,
    cloudX,
    plantAngle,
  };
}
