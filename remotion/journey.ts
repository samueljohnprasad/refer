// ponytail: remotion journey config, geometry, and path utilities
/**
 * Geometry and copy for the icon-badge journey hero, matching the original
 * welcome.png composition: a gentle S-curve of icon badges with handwritten
 * labels alternating sides — not a Duolingo-style progress path. Positions
 * are hand-authored from that reference image, mapped onto this canvas.
 */

export const COMP = {
  width: 1080,
  height: 2334,
  fps: 30,
  durationInFrames: 210,
} as const;

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

/**
 * Node column starts 50px higher and the gap between nodes widened from 235
 * to 258 — using the space freed at the top (originally a 112px dead gap
 * under the headline) and reclaimed at the bottom (the path now runs all
 * the way to the button instead of stopping ~130px short of it), rather
 * than leaving both as empty margin.
 */
export const NODES: JourneyNodeDef[] = [
  { icon: "lock", iconColor: "#9AA7B2", label: ["Keep growing"], side: "right", x: 616, y: 560 },
  { icon: "star", iconColor: "#3FC7A6", label: ["Reflect", "deeply"], side: "right", x: 566, y: 818 },
  { icon: "heart", iconColor: "#F25C68", label: ["Understand", "yourself"], side: "left", x: 468, y: 1076 },
  { icon: "pencil", iconColor: "#3B8CF0", label: ["Today", "Start here"], side: "left", x: 522, y: 1334 },
  { icon: "leaf", iconColor: "#8C7FD6", label: ["Build a", "habit"], side: "right", x: 458, y: 1592 },
  { icon: "sun", iconColor: "#F0A93B", label: ["A brighter", "mind"], side: "left", x: 508, y: 1850 },
];

export const TODAY_INDEX = 3;
export const NODE_SIZE = 132;
export const TODAY_SIZE = 150;

export const COPY = {
  headline: ["Start your", "journey within"],
  subhead: "one thought at a time",
} as const;

/**
 * The app's real primary button (src/components/ui/Button.tsx, variant
 * "primary", size "xl") — a 3D tactile pill: a face pressed down onto a
 * darker rim, spring-back release. Values below are that variant's resolved
 * light-mode hex, taken from button.config.ts + palette.ts's SAGE/NEUTRAL —
 * the source file itself can't be imported here because adaptiveColor() calls
 * DynamicColorIOS, a React Native-only API that Remotion's browser renderer
 * doesn't have.
 */
export const BUTTON = {
  face: "#5f7f58",
  rim: "#29452a",
  label: "#ffffff",
  height: 140,
  pressDepth: 10,
  marginX: 72,
} as const;

type Point = { x: number; y: number };

/**
 * Continues the trail past the last node down to `targetY` — the button's
 * top edge, so the path visually reaches and touches it, rather than
 * stopping ~130px short with empty background in between. Two points:
 * one continuing the same drift the last two nodes were on, one easing
 * back toward center as it nears the button (smoothPath's cubic handles
 * turn these into a smooth continuation, not a hard kink).
 */
export const trailPoints = (targetY: number): Point[] => {
  const last = NODES[NODES.length - 1];
  const prev = NODES[NODES.length - 2];
  const dx = (last.x - prev.x) * 0.5;
  const midY = last.y + (targetY - last.y) * 0.6;
  const centerX = COMP.width / 2;
  return [
    ...NODES.map((n) => ({ x: n.x, y: n.y })),
    { x: last.x + dx, y: midY },
    { x: (last.x + dx + centerX) / 2, y: targetY },
  ];
};

/** One cubic segment per pair of points, vertical handles, passes through
 *  every point exactly — the fix from the earlier Duolingo-style rebuild. */
export const smoothPath = (points: Point[]): string => {
  const [first, ...rest] = points;
  let d = `M ${first.x} ${first.y}`;
  let previous = first;
  for (const point of rest) {
    const handle = (point.y - previous.y) * 0.4;
    d += ` C ${previous.x} ${previous.y + handle} ${point.x} ${point.y - handle} ${point.x} ${point.y}`;
    previous = point;
  }
  return d;
};

/** Darkens a hex color by a factor (e.g. 0.7 = 70% brightness) — used to
 *  derive a node's rim shade from its own face color, the same relationship
 *  button.config.ts's primary variant has between face (SAGE 500) and rim
 *  (SAGE 700). */
export const shade = (hex: string, factor: number): string => {
  const n = parseInt(hex.slice(1), 16);
  const clamp = (c: number) => Math.max(0, Math.min(255, Math.round(c * factor)));
  const r = clamp((n >> 16) & 255);
  const g = clamp((n >> 8) & 255);
  const b = clamp(n & 255);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

/**
 * Completed/locked indicator colors — reused from the app's real journey map
 * (src/data/journey/constants.ts's NODE_COLORS) so "done" and "not yet"
 * read as the same states the actual product uses, not invented ones.
 */
export const NODE_STATE = {
  completed: "#FFC800",
  locked: "#DDE5D8",
} as const;

/** White has no hue to darken, so locked/regular badges (white face) get a
 *  fixed soft blue-grey rim instead — reads as depth against the sky
 *  background rather than a flat grey. */
export const NEUTRAL_RIM = "#C9DCEA";

/** Star polygon path, centred on the origin. */
export const starPath = (rOuter: number, rInner: number, points = 5): string => {
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = (Math.PI / points) * i - Math.PI / 2;
    d += `${i === 0 ? "M" : "L"} ${Math.cos(a) * r} ${Math.sin(a) * r} `;
  }
  return `${d}Z`;
};
