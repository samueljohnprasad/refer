/**
 * Shared types and constants for the journey node builder pipeline.
 *
 * WHY THIS FILE EXISTS:
 * The build pipeline uses a functional "reduce" pattern where each builder
 * receives the current state (LayoutAccumulator), produces an item, and
 * returns updated state. This file defines that shared state shape and
 * the context object that carries dependencies to every builder.
 *
 * This avoids each builder importing its own dependencies directly,
 * making them easier to test (just pass a mock context).
 */

import type { JourneyFlashListItem } from "@/src/types/journey";
import type {
  ColorThemeConfig,
  JourneySettingsConfig,
} from "@/src/types/journey";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Fixed pixel height for the visual separator rendered between units */
export const DIVIDER_CELL_HEIGHT = 180;

/** Fixed pixel height for a mascot speech-bubble row in the list */
export const MASCOT_CELL_HEIGHT = 80;

/** Floor value — prevents zero-height cells that would collapse the layout */
export const MIN_NODE_CELL_HEIGHT = 80;

// ---------------------------------------------------------------------------
// Pipeline types
// ---------------------------------------------------------------------------

/**
 * Immutable state threaded through the builder pipeline via reduce.
 *
 * WHY: The old code used three mutable variables (prevX, cumulativeY, globalIndex)
 * mutated inside nested forEach loops. This was hard to follow and impossible to
 * test in isolation. The accumulator makes state transitions explicit —
 * each builder receives it, returns a new one, and never mutates the original.
 *
 * - items:        The flat list being built up (nodes, dividers, mascots)
 * - globalIndex:  Running counter across ALL nodes in ALL units (for path coloring)
 * - prevX:        X position of the last emitted node (needed to draw the connecting
 *                 SVG segment from the previous node to the current one)
 * - cumulativeY:  Running Y offset from the top of the virtual canvas
 */
export interface LayoutAccumulator {
  readonly items: JourneyFlashListItem[];
  readonly globalIndex: number;
  readonly prevX: number;
  readonly cumulativeY: number;
}

/**
 * Shared read-only dependencies injected into every builder.
 *
 * WHY: Instead of each builder importing getNodePosition, colorThemes, etc.
 * directly, they receive this context object. This satisfies Dependency
 * Inversion (builders depend on the abstraction, not concrete imports) and
 * makes unit testing trivial — just pass a mock context.
 *
 * - screenWidth:      Device width in dp — used for node positioning (sine wave)
 * - settings:         Global layout settings (verticalGap, topPadding, etc.)
 * - colorThemes:      Theme registry — maps theme keys to color configs
 * - mascotMessages:   Message registry — maps message keys to display strings
 */
export interface BuilderContext {
  readonly screenWidth: number;
  readonly settings: JourneySettingsConfig;
  readonly colorThemes: Record<string, ColorThemeConfig>;
  readonly mascotMessages: Record<string, string>;
}
