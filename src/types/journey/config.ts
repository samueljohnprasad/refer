/**
 * Journey Config Types
 * Config-driven type system for the journey map UI.
 *
 * All visual and behavioral properties (node icons, colors, rewards,
 * section titles, mascot messages, divider text) are driven by these
 * configuration interfaces. Components read from a JourneyConfig object
 * via context — zero if/else or switch statements in rendering code.
 *
 * Adding a new node type = one entry in nodeVariants + one SVG in the registry.
 */

import type { NodeStatus } from './enums';
import type { JourneyReward } from './node';

// ---------------------------------------------------------------------------
// Node Variant Config (replaces hardcoded NodeType → icon/color mappings)
// ---------------------------------------------------------------------------

/** How to render an icon inside a node — supports multiple icon systems */
export interface NodeIconConfig {
    /** Icon source type */
    type: 'svg' | 'emoji' | 'hugeicons';
    /** Value: SVG registry key, emoji string, or HugeIcons component name */
    value: string;
    /** Optional tint color override (hex) */
    tintColor?: string;
}

/** Color properties for a single node status state */
export interface NodeColorConfig {
    /** Fill / background color (hex) */
    fill: string;
    /** Border / stroke color (hex) */
    border: string;
    /** Shadow / glow color for active state (hex). Optional. */
    glow?: string;
}

/**
 * A node variant defines ALL visual + behavioral properties for a node type.
 * Adding a new variant = adding one entry to the config registry.
 * Components look up variants by key — no conditionals.
 */
export interface NodeVariantConfig {
    /** Unique key for this variant (e.g. 'star', 'microphone', 'video') */
    key: string;
    /** Human-readable label for accessibility */
    label: string;
    /** Icon config per node status — looked up by status key */
    icons: Record<NodeStatus, NodeIconConfig>;
    /** Color config per node status — looked up by status key */
    colors: Record<NodeStatus, NodeColorConfig>;
    /** Default rewards granted when this node type is completed */
    rewards: JourneyReward[];
    /** Size override in dp. Falls back to global settings if omitted */
    size?: number;
    /** Animation to play when node is active: 'breathing' | 'shine' | 'shake' | 'none' */
    activeAnimation: string;
    /** Whether to show a circular progress ring when active */
    showProgressRing: boolean;
    /**
     * Button shape for this node variant.
     * - 'squircle': rounded-rectangle pill (Duolingo-style, default)
     * - 'circle':   fully circular button
     */
    shape?: 'squircle' | 'circle';
}

// ---------------------------------------------------------------------------
// Color Theme Config (replaces UNIT_GRADIENTS and hardcoded hex values)
// ---------------------------------------------------------------------------

/**
 * A color theme defines all colors for a unit's visual identity.
 * Components look up themes by key — no hardcoded hex in components.
 */
export interface ColorThemeConfig {
    /** Unique key (e.g. 'green', 'purple', 'blue', 'orange', 'pink') */
    key: string;
    /** Header gradient pair: [startColor, endColor] */
    headerGradient: [string, string];
    /** Header text color (hex) */
    headerTextColor: string;
    /** Path active/completed stroke color (hex) */
    pathActiveColor: string;
    /** Divider accent color (hex) */
    dividerColor: string;
    /** Jump button background color (hex) */
    jumpButtonColor: string;
}

// ---------------------------------------------------------------------------
// Section Config (new concept — groups of units)
// ---------------------------------------------------------------------------

/** Mascot appearance config for a section overview card */
export interface SectionMascotConfig {
    /** Asset key for the mascot image */
    imageKey: string;
    /** Speech bubble message shown on the overview card */
    message: string;
    /** Which side of the card to show mascot */
    side: 'left' | 'right';
}

/**
 * A Section groups multiple Units together.
 * Hierarchy: Course → Section → Unit → Node
 * Sections appear as cards on the Section Overview screen.
 */
export interface SectionConfig {
    /** Unique ID */
    id: string;
    /** Display number (e.g. 1, 2, 3) */
    sectionNumber: number;
    /** Section title shown in overview cards (e.g. "Getting Started") */
    title: string;
    /** Unit range label shown on cards (e.g. "5 to 9") */
    unitRangeLabel: string;
    /** Background color for the section overview card (hex) */
    cardBackgroundColor: string;
    /** Mascot config for the section overview card */
    mascot: SectionMascotConfig;
    /** Ordered IDs of units belonging to this section */
    unitIds: string[];
}

// ---------------------------------------------------------------------------
// Unit Config (enhanced — replaces UnitData for static config)
// ---------------------------------------------------------------------------

/** Geometry styles for how the path interpolates between nodes */
export type PathGeometryType = 'sine' | 'organic' | 'zigzag' | 'straight';

/** Config for the visual divider rendered between units in the scrollable path */
export interface UnitDividerConfig {
    /** Title text shown in the divider (e.g. "Describe your family") */
    title: string;
    /** Whether to show "JUMP HERE?" badge */
    showJumpHere: boolean;
    /** Color of the jump button. Falls back to unit color theme if omitted */
    jumpButtonColor?: string;
}

/** Config for a single node within a unit (the static blueprint) */
export interface UnitNodeConfig {
    /** Key into the NodeVariantConfig registry */
    variantKey: string;
    /** Task ID linking to exercise/lesson content */
    taskId: string;
    /** Task type for routing to the correct exercise screen */
    taskType: string;
    /** Override rewards for this specific node. Falls back to variant defaults if omitted */
    rewardOverrides?: JourneyReward[];
    /** Override label (e.g. "START", "BOSS"). Optional */
    label?: string;
}

/** Mascot placement within a unit's node path */
export interface MascotPlacementConfig {
    /** Place mascot after this 0-based node index */
    afterNodeIndex: number;
    /** Which side of the path to show mascot: 'left' | 'right' */
    side: 'left' | 'right';
    /** Key into the mascot message registry, or a literal string */
    messageKey: string;
    /** Optional image key to show instead of the default owl avatar */
    imageKey?: string;
    /**
     * Avatar render size in dp. Defaults to MASCOT_SIZE.avatar (48) if omitted.
     * Set a larger value (e.g. 72) for image-based mascots.
     */
    avatarSize?: number;
    /**
     * Vertical offset from the node's centre-line, in dp.
     * Positive pushes the mascot downward. Defaults to MASCOT_SIZE.verticalOffset.
     */
    offsetY?: number;
    /**
     * Horizontal offset from the node's center, in dp.
     * Defaults to MASCOT_SIZE.horizontalOffset.
     */
    offsetX?: number;
    /** Optional: star rating to display next to mascot (e.g. 2 gold stars) */
    starRating?: number;
}

/**
 * Static blueprint for a unit. Runtime state (node statuses, progress)
 * is stored separately in UserJourneyProgress. This is config only.
 */
export interface UnitConfig {
    /** Unique ID */
    id: string;
    /** 1-indexed unit number within the journey */
    unitNumber: number;
    /** Short title for the header (e.g. "Order in a cafe") */
    title: string;
    /** Longer description */
    description: string;
    /** Key into the ColorThemeConfig registry */
    colorThemeKey: string;
    /** ID of the section this unit belongs to */
    sectionId: string;
    /** Ordered node blueprints */
    nodes: UnitNodeConfig[];
    /** Mascot placements within this unit */
    mascotPlacements: MascotPlacementConfig[];
    /** Divider config rendered above this unit (between previous unit and this one) */
    divider: UnitDividerConfig;
    /** Defines the mathematical path style. Defaults to 'sine' */
    pathGeometry?: PathGeometryType;
}

// ---------------------------------------------------------------------------
// Global Journey Settings
// ---------------------------------------------------------------------------

/** Global layout and sizing settings for the journey map */
export interface JourneySettingsConfig {
    /** Default node diameter in dp */
    defaultNodeSize: number;
    /** Chest node diameter in dp */
    chestNodeSize: number;
    /** Vertical gap between nodes in dp */
    verticalGap: number;
    /** Fraction of screen width for horizontal zigzag amplitude */
    amplitudeFactor: number;
    /** Sine wave frequency (controls zigzag period) */
    waveFrequency: number;
    /** Path stroke width in dp */
    pathStrokeWidth: number;
    /** Path inactive/locked stroke color (hex) */
    pathInactiveColor: string;
    /** Top padding before the first node in dp */
    topPadding: number;
    /** Bottom padding after the last node in dp */
    bottomPadding: number;
    /** Progress ring gap in dp */
    progressRingGap: number;
    /** Progress ring stroke width in dp */
    progressRingStroke: number;
}

// ---------------------------------------------------------------------------
// Master Config Object
// ---------------------------------------------------------------------------

/**
 * The single source of truth for all journey UI configuration.
 * Loaded from a local JSON file or fetched from an API.
 * Components read from this via JourneyConfigProvider context.
 *
 * ZERO hardcoded colors, icons, or node types in component code.
 */
export interface JourneyConfig {
    /** All node variants, keyed by variant key */
    nodeVariants: Record<string, NodeVariantConfig>;
    /** All color themes, keyed by theme key */
    colorThemes: Record<string, ColorThemeConfig>;
    /** All sections in display order */
    sections: SectionConfig[];
    /** All units in display order (referenced by sections via unitIds) */
    units: UnitConfig[];
    /** Mascot message registry: messageKey → message string */
    mascotMessages: Record<string, string>;
    /** Global layout and sizing settings */
    settings: JourneySettingsConfig;
}
