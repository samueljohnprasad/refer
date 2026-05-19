/**
 * Section Map Types
 * Types for the lazy-loaded section map architecture.
 *
 * These correspond to the JSON returned by the `get_section_map` and
 * `get_node_content` Supabase RPCs.
 *
 * Data flow:
 *   get_section_map(slug, unitNumber?) → SectionMapResponse
 *   get_node_content(nodeId)           → NodeContentResponse
 */

import type { UnitColorScheme } from "./enums";
import type { PathNodeData } from "./node";
import type { MascotPlacement } from "./unit";

/** How the journey map is being accessed */
export type SectionViewMode = "active" | "completed" | "preview";

// ---------------------------------------------------------------------------
// Server node — PathNodeData + server-only metadata
// ---------------------------------------------------------------------------

/**
 * A node as returned by the `get_section_map` RPC.
 * Extends PathNodeData so it's directly usable by the UI pipeline.
 * The extra fields are server-only metadata not consumed by the path renderer.
 */
export interface ServerNodeData extends PathNodeData {
  /** UUID of the unit that owns this node */
  unitId: string;
  /** 1-indexed unit number within the current section */
  unitNumber: number;
  /** 1-indexed global unit number within the journey */
  globalUnitNumber: number;
  /** Base XP awarded on completion */
  xpReward: number;
  /** Estimated minutes to complete */
  estimatedMinutes: number;
  /** True if this is the last node in the section (trophy/checkpoint) */
  isTrophy: boolean;
}

// ---------------------------------------------------------------------------
// Section unit data — one unit nested inside a fetched section
// ---------------------------------------------------------------------------

/** One unit within a fetched section */
export interface SectionUnitData {
  /** UUID from DB */
  id: string;
  /** UUID of the parent section */
  sectionId: string;
  /** 1-indexed section number */
  sectionNumber: number;
  /** 1-indexed unit number within the section */
  unitNumber: number;
  /** 1-indexed unit number across the full journey */
  globalUnitNumber: number;
  /** Display title */
  title: string;
  /** Unit description */
  description: string;
  /** Color scheme for the unit header/theme */
  colorScheme: UnitColorScheme;
  /** Mascot placement configs */
  mascotPlacements: MascotPlacement[];
  /** Unlock rule: sequential | placement_test | immediate */
  unlockRule: string;
  /** Nodes — ordered by index */
  nodes: ServerNodeData[];
}

// ---------------------------------------------------------------------------
// Section data — metadata + nodes for one section
// ---------------------------------------------------------------------------

/** Full metadata for a single section */
export interface SectionData {
  /** UUID from DB */
  id: string;
  /** 1-indexed section number (legacy alias kept for compatibility) */
  unitNumber: number;
  /** 1-indexed section number */
  sectionNumber: number;
  /** Display title */
  title: string;
  /** Section description */
  description: string;
  /** Color scheme for the section header/theme */
  colorScheme: UnitColorScheme;
  /** Mascot placement configs */
  mascotPlacements: MascotPlacement[];
  /** Unlock rule: sequential | placement_test | immediate */
  unlockRule: string;
  /** Total units inside this section */
  unitCount: number;
  /** Flattened nodes across all units — ordered by unitNumber, index */
  nodes: ServerNodeData[];
  /** Nested units for this section */
  units: SectionUnitData[];
}

// ---------------------------------------------------------------------------
// Section list item — lightweight entry for sticky header tabs
// ---------------------------------------------------------------------------

/** Summary of a section for the sticky header tab bar */
export interface SectionListItem {
  /** 1-indexed section number (legacy alias kept for compatibility) */
  unitNumber: number;
  /** 1-indexed section number */
  sectionNumber: number;
  /** Display title */
  title: string;
  /** Color scheme for tab styling */
  colorScheme: string;
  /** Total number of nodes in this section */
  nodeCount: number;
  /** Total number of units in this section */
  unitCount?: number;
  /** Ordered unit titles for the section */
  unitTitles?: string[];
  /** Ordered HugeIcons keys for the section's units */
  unitIconKeys?: Array<string | null | undefined>;
}

/** Selector-backed section summary used by the overview sheet. */
export interface SectionOverviewItem {
  /** UUID from DB */
  id: string;
  /** 1-indexed section number */
  sectionNumber: number;
  /** Display title */
  title: string;
  /** Color scheme used for the section card */
  colorScheme: string;
  /** Total number of units in the section */
  unitCount: number;
  /** Ordered unit titles for the section */
  unitTitles: string[];
  /** Ordered HugeIcons keys for the section's units */
  unitIconKeys: Array<string | null | undefined>;
  /** Total number of nodes in the section */
  totalNodes: number;
  /** Completed node count in the section */
  completedNodes: number;
  /** Completed node percentage for the section */
  progressPercent: number;
  /** True when this section is currently reachable from progress */
  isUnlocked: boolean;
  /** True when this section is the progress-derived current section */
  isCurrent: boolean;
}

// ---------------------------------------------------------------------------
// Section node progress — user progress for one node
// ---------------------------------------------------------------------------

/** User's progress on a single node within a section */
export interface SectionNodeProgress {
  /** UUID of the template node */
  nodeId: string;
  /** completed | active */
  status: "completed" | "active";
  /** 0.0–1.0 progress */
  progress: number;
  /** Whether the user has claimed the node's rewards */
  rewardClaimed: boolean;
  /** ISO timestamp of completion, null if not completed */
  completedAt: string | null;
}

// ---------------------------------------------------------------------------
// Section enrollment — user's enrollment info
// ---------------------------------------------------------------------------

/** User's enrollment info returned with the section map */
export interface SectionEnrollment {
  /** UUID of the enrollment */
  id: string;
  /** User's current global unit number */
  currentUnitNumber: number;
  /** User's current section number */
  currentSectionNumber: number;
  /** User's current unit number within the current section */
  currentSectionUnitNumber: number;
  /** UUID of the current section */
  currentSectionId?: string | null;
  /** UUID of the current unit */
  currentUnitId?: string | null;
  /** active | completed | abandoned */
  status: "active" | "completed" | "abandoned";
  /** Template version at enrollment time */
  templateVersion: number;
}

// ---------------------------------------------------------------------------
// Journey metadata — high-level journey info
// ---------------------------------------------------------------------------

/** High-level journey metadata included in every section map response */
export interface SectionJourneyMeta {
  /** UUID of the journey */
  id: string;
  /** URL-safe slug */
  slug: string;
  /** Display title */
  title: string;
  /** Structural version (for cache invalidation) */
  version: number;
  /** Primary color scheme */
  colorScheme: string;
  /** Total number of sections in this journey */
  totalSections: number;
}

// ---------------------------------------------------------------------------
// Full section map response
// ---------------------------------------------------------------------------

/** Complete response from the `get_section_map` RPC */
export interface SectionMapResponse {
  /** Which access mode produced this response */
  viewMode: SectionViewMode;
  /** Node that should be focused/scrolled to on initial render */
  focusNodeId: string | null;
  /** High-level journey metadata */
  journey: SectionJourneyMeta;
  /** Section metadata + node stubs (no content) */
  section: SectionData;
  /** User's node progress for this section only (empty array if no enrollment) */
  progress: SectionNodeProgress[];
  /** User's enrollment info (null if not enrolled) */
  enrollment: SectionEnrollment | null;
  /** All sections for sticky header tabs */
  sectionList: SectionListItem[];
}

// ---------------------------------------------------------------------------
// Node content response
// ---------------------------------------------------------------------------

/** Full content for a single node — fetched on-demand via `get_node_content` */
export interface NodeContentResponse {
  /** UUID of the node */
  id: string;
  /** Node type for routing to correct renderer */
  nodeType: string;
  /** Display title */
  title: string | null;
  /** Node description */
  description: string | null;
  /** Full JSONB content — shape depends on nodeType */
  content: Record<string, unknown>;
}
