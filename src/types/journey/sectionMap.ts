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

import type { UnitColorScheme } from './enums';
import type { JourneyReward } from './node';

// ---------------------------------------------------------------------------
// Node stub — lightweight node metadata (NO content JSONB)
// ---------------------------------------------------------------------------

/** A node in the section map — excludes heavy `content` field */
export interface NodeStub {
    /** UUID from DB */
    id: string;
    /** 0-indexed position within the unit */
    nodeIndex: number;
    /** learn | exercise | quiz | checkpoint | chest | mood_check | etc. */
    nodeType: string;
    /** Links to actual content/exercise */
    taskId: string;
    /** Config-driven visual variant key */
    variantKey: string;
    /** Display title */
    title: string | null;
    /** Icon key for the node */
    iconKey: string | null;
    /** Base XP awarded on completion */
    xpReward: number;
    /** Estimated minutes to complete */
    estimatedMinutes: number;
    /** Rewards granted on completion */
    rewards: JourneyReward[];
    /** True if this is the last node in the section (trophy/checkpoint) */
    isTrophy: boolean;
    /** True if nodes in this section can be tapped (false = preview mode) */
    canInteract: boolean;
}

// ---------------------------------------------------------------------------
// Section data — metadata + node stubs for one section
// ---------------------------------------------------------------------------

/** Full metadata for a single section (unit) */
export interface SectionData {
    /** UUID from DB */
    id: string;
    /** 1-indexed section number */
    unitNumber: number;
    /** Display title */
    title: string;
    /** Section description */
    description: string;
    /** Color scheme for the section header/theme */
    colorScheme: UnitColorScheme;
    /** Mascot placement configs */
    mascotPlacements: unknown[];
    /** Unlock rule: sequential | placement_test | immediate */
    unlockRule: string;
    /** Node stubs (no content) — ordered by nodeIndex */
    nodes: NodeStub[];
}

// ---------------------------------------------------------------------------
// Section list item — lightweight entry for sticky header tabs
// ---------------------------------------------------------------------------

/** Summary of a section for the sticky header tab bar */
export interface SectionListItem {
    /** 1-indexed section number */
    unitNumber: number;
    /** Display title */
    title: string;
    /** Color scheme for tab styling */
    colorScheme: string;
    /** Total number of nodes in this section */
    nodeCount: number;
}

// ---------------------------------------------------------------------------
// Section node progress — user progress for one node
// ---------------------------------------------------------------------------

/** User's progress on a single node within a section */
export interface SectionNodeProgress {
    /** UUID of the template node */
    nodeId: string;
    /** completed | active */
    status: 'completed' | 'active';
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
    /** User's current section number */
    currentUnitNumber: number;
    /** active | completed | abandoned */
    status: 'active' | 'completed' | 'abandoned';
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
