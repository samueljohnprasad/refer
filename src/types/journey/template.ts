/**
 * Journey Template Types
 * Raw template shapes as returned by the Supabase API.
 * These represent the shared structure of a journey — no user state.
 * Used by the merge function to combine with UserJourneyProgress.
 */

import type { UnitColorScheme, MascotSide } from "./enums";
import type { JourneyReward } from "./node";

// ---------------------------------------------------------------------------
// Template node (static definition — no user state)
// ---------------------------------------------------------------------------

/** A single node in a journey template (no status, no progress) */
export interface JourneyTemplateNode {
  /** UUID from DB */
  id: string;
  /** 0-indexed position within the unit */
  nodeIndex: number;
  /** lesson | checkpoint | chest */
  nodeType: string;
  /** Links to actual content/exercise */
  taskId: string;
  /** Rewards granted on completion */
  rewards: JourneyReward[];
  /** Extensible metadata bag (custom icons, A/B variants, etc.) */
  metadata?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Template unit (section within a journey)
// ---------------------------------------------------------------------------

/** Mascot placement config within a unit */
export interface TemplateMascotPlacement {
  afterNodeIndex: number;
  side: MascotSide;
  messageKey?: string;
}

/** A unit (section) in a journey template */
export interface JourneyTemplateUnit {
  /** UUID from DB */
  id: string;
  /** 1-indexed order within the journey */
  unitNumber: number;
  title: string;
  description: string;
  colorScheme: UnitColorScheme;
  mascotPlacements: TemplateMascotPlacement[];
  nodes: JourneyTemplateNode[];
}

// ---------------------------------------------------------------------------
// Top-level template
// ---------------------------------------------------------------------------

/** Full journey template as returned by get_journey_template RPC */
export interface JourneyTemplate {
  /** UUID from DB */
  id: string;
  /** URL-safe unique slug, e.g. "anxiety-management" */
  slug: string;
  title: string;
  description: string;
  /** Structural version — bumped on unit/node add/remove/reorder */
  version: number;
  /** Primary color scheme for the journey */
  colorScheme: UnitColorScheme;
  /** Ordered units within the journey */
  units: JourneyTemplateUnit[];
}

// ---------------------------------------------------------------------------
// Journey catalog item (for the picker screen)
// ---------------------------------------------------------------------------

/** Summary returned by get_journey_catalog RPC */
export interface JourneyListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  iconUrl: string | null;
  colorScheme: string;
  totalNodes: number;
  completedNodes: number;
  isEnrolled: boolean;
  enrollmentStatus: "active" | "completed" | null;
}
