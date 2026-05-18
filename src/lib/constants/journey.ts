// lib/constants/journey.ts
// Single source of truth for all Journey Map numeric and string constants.
// Import JOURNEY from here — never hardcode these values elsewhere.

export const JOURNEY = {
  // ── Course ──────────────────────────────────────────────────────────────
  /** Course shown to users with zero enrollments. Set to your published course UUID. */
  DEFAULT_COURSE_ID: "00000000-0000-0000-0000-000000000001",

  // ── Progression thresholds ───────────────────────────────────────────────
  /** Minimum score to pass a quiz or challenge node (0–100). */
  DEFAULT_PASS_THRESHOLD: 70,
  /** Minimum score to pass a boss node (0–100). */
  BOSS_PASS_THRESHOLD: 80,
  /** Maximum retry attempts before giving up (UI hint — not enforced in DB). */
  MAX_RETRY_ATTEMPTS: 3,

  // ── Timing (milliseconds) ────────────────────────────────────────────────
  /** Debounce window for submit button to prevent double-tap. */
  SUBMIT_DEBOUNCE_MS: 500,
  /** Duration the celebration overlay is visible. */
  CELEBRATION_DURATION_MS: 2500,
  /** Delay before auto-scrolling to the new current node after completion. */
  SCROLL_TO_NODE_DELAY_MS: 300,

  // ── UI layout ───────────────────────────────────────────────────────────
  /** Standard node circle diameter in dp. */
  NODE_SIZE: 56,
  /** Vertical spacing between nodes in the zigzag path. */
  NODE_CONNECTOR_HEIGHT: 24,
  /** Horizontal offset for alternating node positions in the path. */
  ZIGZAG_OFFSET: 40,
  /** Width of the 'current node' highlight ring. */
  CURRENT_NODE_RING_WIDTH: 4,
} as const;

/** Type of the JOURNEY constants object (useful for type-safe access). */
export type JourneyConstants = typeof JOURNEY;
