/**
 * Motion Design Tokens
 *
 * Single source of truth for all animation timing and spring configurations
 * across the app. Ensures consistent, cohesive motion design.
 *
 * Compositor-only rule: Only animate `transform` and `opacity`.
 */

import { WithSpringConfig, WithTimingConfig, Easing } from 'react-native-reanimated';

// ─── Spring Presets ───────────────────────────────────────────────────────────

/** For modals, full-screen transitions (~500ms settle) */
export const SPRING_GENTLE: WithSpringConfig = {
  stiffness: 120,
  damping: 14,
  mass: 1,
};

/** General-purpose buttons, state changes (~350ms settle) */
export const SPRING_DEFAULT: WithSpringConfig = {
  stiffness: 220,
  damping: 22,
  mass: 1,
};

/** Toggles, tabs, quick press feedback (~200ms settle) */
export const SPRING_SNAPPY: WithSpringConfig = {
  stiffness: 420,
  damping: 28,
  mass: 1,
};

/** Celebrations, XP gains, achievements (~600ms settle) */
export const SPRING_BOUNCY: WithSpringConfig = {
  stiffness: 320,
  damping: 10,
  mass: 1,
};

// ─── Timing Durations (ms) ────────────────────────────────────────────────────

export const DURATION = {
  /** 0–50ms: Ripple start, instant color feedback */
  instant: 0,
  /** 50–100ms: Checkbox, small state indicator */
  ultraFast: 80,
  /** 100–200ms: Button press, toggle, tooltip appear */
  fast: 150,
  /** 200–300ms: Panel expand, dropdown, modal open */
  normal: 250,
  /** 300–500ms: Page transition, complex layout shift */
  slow: 350,
  /** 500–1000ms: Onboarding, celebration, staggered list */
  dramatic: 600,
} as const;

// ─── Timing Configs ───────────────────────────────────────────────────────────

export const TIMING_ENTER: WithTimingConfig = {
  duration: DURATION.normal,
  easing: Easing.out(Easing.cubic),
};

export const TIMING_EXIT: WithTimingConfig = {
  duration: DURATION.fast,
  easing: Easing.in(Easing.cubic),
};

export const TIMING_FADE: WithTimingConfig = {
  duration: DURATION.fast,
  easing: Easing.inOut(Easing.ease),
};

// ─── Stagger Delays (ms) between list items ───────────────────────────────────

export const STAGGER = {
  fast: 30,
  normal: 50,
  slow: 80,
} as const;
