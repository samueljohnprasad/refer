// ponytail: calibrated geometry and timing matching remotion welcome hero reference
export const CANVAS_WIDTH: number = 1080;
export const CANVAS_HEIGHT: number = 2334;
export const DURATION_FRAMES: number = 210;
export const FPS: number = 30;

export const BACKGROUND = {
  top: "#BFE0F5",
  mid: "#EAF4FB",
  bottom: "#FFFFFF",
} as const;

export type IconKind = "lock" | "star" | "heart" | "pencil" | "leaf" | "sun";

export interface JourneyNodeDef {
  icon: IconKind;
  iconColor: string;
  label: string[];
  side: "left" | "right";
  x: number;
  y: number;
}

export const NODES: readonly JourneyNodeDef[] = [
  { icon: "lock", iconColor: "#9AA7B2", label: ["Keep growing"], side: "right", x: 616, y: 560 },
  { icon: "star", iconColor: "#3FC7A6", label: ["Reflect", "deeply"], side: "right", x: 566, y: 818 },
  { icon: "heart", iconColor: "#F25C68", label: ["Understand", "yourself"], side: "left", x: 468, y: 1076 },
  { icon: "pencil", iconColor: "#3B8CF0", label: ["Today", "Start here"], side: "left", x: 522, y: 1334 },
  { icon: "leaf", iconColor: "#8C7FD6", label: ["Build a", "habit"], side: "right", x: 458, y: 1592 },
  { icon: "sun", iconColor: "#F0A93B", label: ["A brighter", "mind"], side: "left", x: 508, y: 1850 },
] as const;

export const TODAY_INDEX: number = 3;
export const NODE_SIZE: number = 132;
export const TODAY_SIZE: number = 150;

export const COPY = {
  headline: ["Start your", "journey within"],
  subhead: "one thought at a time",
} as const;

export const TODAY: JourneyNodeDef = NODES[TODAY_INDEX];

export const PANDA = {
  width: 260,
  left: 657,
  top: 1176,
} as const;

export const NODE_STATE = {
  completed: "#FFC800",
  locked: "#DDE5D8",
} as const;

export const NEUTRAL_RIM: string = "#C9DCEA";

export const shade = (hex: string, factor: number): string => {
  "worklet";
  const n = parseInt(hex.replace("#", ""), 16);
  const clamp = (c: number) => Math.max(0, Math.min(255, Math.round(c * factor)));
  const r = clamp((n >> 16) & 255);
  const g = clamp((n >> 8) & 255);
  const b = clamp(n & 255);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

export const starPath = (rOuter: number, rInner: number, points: number = 5): string => {
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = (Math.PI / points) * i - Math.PI / 2;
    d += `${i === 0 ? "M" : "L"} ${Math.cos(a) * r} ${Math.sin(a) * r} `;
  }
  return `${d}Z`;
};

export const PATH_D: string =
  "M 616 560 C 616 663.2 566 714.8 566 818 C 566 921.2 468 972.8 468 1076 C 468 1179.2 522 1230.8 522 1334 C 522 1437.2 458 1488.8 458 1592 C 458 1695.2 508 1746.8 508 1850 C 508 1921.89824 533 1957.84736 533 2029.7456 C 533 2077.67776 536.5 2101.64384 536.5 2149.576";

export const TRAIL_TOP: number = NODES[0].y - 60;
export const TRAIL_BOTTOM: number = 2150;

export const NODE_STAGGER: number = 16;
export const NODE_START: number = 58;
export const COMPLETE_START: number = 80;
export const COMPLETE_STAGGER: number = 26;
export const SEGMENT_FILL_DURATION: number = 16;

export const completeAt = (index: number): number => {
  "worklet";
  return COMPLETE_START + index * COMPLETE_STAGGER;
};

export const nodeAt = (index: number): number => {
  "worklet";
  return NODE_START + index * NODE_STAGGER;
};

export const T = {
  headline: 4,
  pathStart: 34,
  pathEnd: 78,
  nodeAt,
  completeAt,
  arrowAt: COMPLETE_START + (TODAY_INDEX - 1) * COMPLETE_STAGGER + SEGMENT_FILL_DURATION + 14,
  pandaAt: COMPLETE_START + (TODAY_INDEX - 1) * COMPLETE_STAGGER + SEGMENT_FILL_DURATION + 26,
} as const;

export interface ProgressSegmentDef {
  d: string;
  length: number;
  startFrame: number;
  endFrame: number;
}

export const PROGRESS_SEGMENTS: readonly ProgressSegmentDef[] = [
  {
    d: "M 616 560 C 616 663.2 566 714.8 566 818",
    length: 265,
    startFrame: COMPLETE_START,
    endFrame: COMPLETE_START + SEGMENT_FILL_DURATION,
  },
  {
    d: "M 566 818 C 566 921.2 468 972.8 468 1076",
    length: 281,
    startFrame: COMPLETE_START + COMPLETE_STAGGER,
    endFrame: COMPLETE_START + COMPLETE_STAGGER + SEGMENT_FILL_DURATION,
  },
  {
    d: "M 468 1076 C 468 1179.2 522 1230.8 522 1334",
    length: 266,
    startFrame: COMPLETE_START + COMPLETE_STAGGER * 2,
    endFrame: COMPLETE_START + COMPLETE_STAGGER * 2 + SEGMENT_FILL_DURATION,
  },
] as const;
