/**
 * Journey Map Design Constants
 * Single source of truth for colors, sizing, and animation timings.
 * Kept separate from types so components can import only what they need.
 */

/** Node visual colors by status */
export const NODE_COLORS = {
  locked: "#DDE5D8",   // Sage-tinted locked gray — visible but clearly de-emphasized
  active: "#58CC02",
  completed: "#FFC800",
} as const;

/** Path stroke colors */
export const PATH_COLORS = {
  inactive: "#EAF0E7", // Warm sage-gray path — harmonizes with canvas
  active: "#C8DEC0",  // Muted sage green progress path
} as const;

/** Unit header gradient pairs by color scheme */
export const UNIT_GRADIENTS: Record<string, readonly [string, string]> = {
  green: ["#78C800", "#58CC02"],
  blue: ["#1CB0F6", "#0A8FD4"],
  purple: ["#CE82FF", "#A855F7"],
  orange: ["#FF9600", "#FF7800"],
} as const;

/** Node sizing constants (dp) */
export const NODE_SIZE = {
  regular: 72,
  chest: 84,
  progressRingGap: 4,
  progressRingStroke: 6,
} as const;

/** Path layout constants */
export const PATH_LAYOUT = {
  /** Fraction of screen width for horizontal zigzag */
  amplitudeFactor: 0.15,
  /** Vertical pixels between nodes */
  verticalGap: 200,
  /** Top padding before first node */
  topPadding: 100,
  /** Bottom padding after last node */
  bottomPadding: 200,
  /** Sine wave period divisor — controls zigzag frequency */
  waveFrequency: 2.5,
  /** Path stroke width */
  strokeWidth: 10,
} as const;

/** Divider layout constants for unit transition rows */
export const DIVIDER_LAYOUT = {
  /** Divider row height in dp (matches node gap) */
  cellHeight: PATH_LAYOUT.verticalGap,
  /** Fraction of the entry→exit connector span used for the text-avoidance lane */
  connectorLaneInterpolation: 0.5,
  /** Fraction of screen width reserved for the title-avoidance lane */
  laneWidthFactor: 0.22,
  /** Horizontal padding around the divider row */
  edgePadding: 20,
  /** Minimum horizontal gap reserved for the connector lane */
  laneClearance: 84,
  /** Gap between the title pill and adjacent line */
  titleGap: 12,
  /** Maximum width of the title pill as a fraction of screen width */
  titleMaxWidthRatio: 0.75,
  /** Minimum visible line width on either side of the title */
  minLineWidth: 24,
  /** Background behind the title pill */
  titlePillColor: "#58CC02", // Bold, vibrant theme color
  /** Divider title color */
  titleTextColor: "#FFFFFF", // High contrast white
  /** Divider rule color */
  lineColor: "#EAF0E7", // Clean slate line
} as const;

/** Animation timing constants (ms) */
export const ANIMATION_TIMING = {
  breathing: 2000,
  tooltipBounce: 1500,
  pathDraw: 600,
  nodePop: 400,
  progressRing: 800,
  scrollToActive: 400,
  mascotEntrance: 200,
  chestShine: 2500,
  chestShake: 80,
  chestOpen: 500,
} as const;

/** Chest node colors */
export const CHEST_COLORS = {
  body: "#8B5E3C",
  bodyBorder: "#6B4226",
  locked: "#A0AEC0",
  lockedBorder: "#718096",
  shine: "#FFD700",
  shineBg: "rgba(255, 215, 0, 0.15)",
} as const;

/** Mascot sizing constants (dp) */
export const MASCOT_SIZE = {
  /** Owl avatar diameter */
  avatar: 48,
  /** Horizontal offset from the nearest node edge */
  horizontalOffset: 52,
  /** Vertical offset below the reference node center */
  verticalOffset: 30,
  /** Speech bubble max width */
  bubbleMaxWidth: 160,
} as const;

/** Mascot speech bubble messages — warm Sage voice, no emoji */
export const MASCOT_MESSAGES: readonly string[] = [
  "You're making real progress.",
  "One step at a time.",
  "Every session counts.",
  "You're doing great.",
  "Keep going · you've got this.",
  "Each step builds on the last.",
  "You're showing up. That matters.",
  "Nice work today.",
  "Consistency is your superpower.",
  "Take a breath. You're doing well.",
] as const;

export const NODE_SHAPES = {
  hexagon: "M50 0 L93 25 L93 75 L50 100 L7 75 L7 25 Z",
  shield: "M10 10 H90 V55 C90 75 50 95 50 95 C50 95 10 75 10 55 Z",
  rosette: "M 50 5 C 60 5 65 15 75 15 C 85 15 90 25 90 35 C 90 45 95 50 95 50 C 95 50 90 55 90 65 C 90 75 85 85 75 85 C 65 85 60 95 50 95 C 40 95 35 85 25 85 C 15 85 10 75 10 65 C 10 55 5 50 5 50 C 5 50 10 45 10 35 C 10 25 15 15 25 15 C 35 15 40 5 50 5 Z"
};
