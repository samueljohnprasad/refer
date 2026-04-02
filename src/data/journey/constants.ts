/**
 * Journey Map Design Constants
 * Single source of truth for colors, sizing, and animation timings.
 * Kept separate from types so components can import only what they need.
 */

/** Node visual colors by status */
export const NODE_COLORS = {
  locked: "#CBD5E0",
  active: "#58CC02",
  completed: "#FFC800",
} as const;

/** Path stroke colors */
export const PATH_COLORS = {
  inactive: "#E0E0E0",
  active: "#78C800",
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
  amplitudeFactor: 0.22,
  /** Vertical pixels between nodes */
  verticalGap: 120,
  /** Top padding before first node */
  topPadding: 100,
  /** Bottom padding after last node */
  bottomPadding: 200,
  /** Sine wave period divisor — controls zigzag frequency */
  waveFrequency: 2.5,
  /** Path stroke width */
  strokeWidth: 10,
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
