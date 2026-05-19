/**
 * Journey Map Design Constants
 * Single source of truth for colors, sizing, and animation timings.
 * Kept separate from types so components can import only what they need.
 */

/** Node visual colors by status */
export const NODE_COLORS = {
  locked: "rgba(226, 232, 240, 0.25)", // Semi-transparent light gray
  active: "#58CC02",
  completed: "#FFC800",
} as const;

/** Path stroke colors */
export const PATH_COLORS = {
  inactive: "#F1F5F9", // Very light gray for minimal visual weight
  active: "#DCFCE7", // Subtle light green
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
  regular: 64,
  chest: 80,
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
  /** Divider row height in dp */
  cellHeight: 80,
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
  titleMaxWidthRatio: 0.52,
  /** Minimum visible line width on either side of the title */
  minLineWidth: 24,
  /** Background behind the title pill */
  titlePillColor: "rgba(241, 245, 249, 0.9)",
  /** Divider title color */
  titleTextColor: "#64748B",
  /** Divider rule color */
  lineColor: "rgba(203, 213, 225, 0.92)",
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

/** Mascot encouragement messages */
export const MASCOT_MESSAGES: readonly string[] = [
  "Great job! Keep going! 🎉",
  "You're on fire! 🔥",
  "Almost there! 💪",
  "Incredible progress! ⭐",
  "You're a star learner! 🌟",
  "Way to go! 🚀",
  "Keep it up! 👏",
  "You've got this! 💯",
  "Amazing work! ✨",
  "One step at a time! 🐾",
] as const;
