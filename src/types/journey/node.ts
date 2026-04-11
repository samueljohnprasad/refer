/**
 * Journey Path Node Types
 * Defines the data shape for individual nodes on the journey path.
 */

import { NodeStatus, NodeType, NodeIcon, JourneyRewardType } from "./enums";

/** Reward granted when completing a node or opening a chest */
export interface JourneyReward {
  type: JourneyRewardType;
  amount: number;
  icon: string;
}

/** A single lesson/checkpoint/chest on the journey path */
export interface PathNodeData {
  id: string;
  index: number;
  type: NodeType;
  status: NodeStatus;
  icon: NodeIcon;
  /** Backend-provided visual variant key for config-driven rendering. */
  variantKey?: string;
  /** Backend-provided task type / node type string. */
  taskType?: string;
  /** Backend-provided display title for this node. */
  title?: string | null;
  /** Backend-provided icon key, if present. */
  iconKey?: string | null;
  /** 0–1 progress for the active node's ring. Undefined for non-active. */
  progress?: number;
  /** Tooltip text shown above node, e.g. "START" */
  label?: string;
  /** ID linking to the actual task/lesson content */
  taskId: string;
  /** Rewards earned upon completion */
  rewards: JourneyReward[];
}

/** Computed screen coordinates for a node */
export interface NodePosition {
  x: number;
  y: number;
}

// ---------------------------------------------------------------------------
// FlashList Segment-Per-Cell Node
// ---------------------------------------------------------------------------

/** Item types in the flat FlashList data array */
export type JourneyListItemType = "node" | "divider" | "mascot";

/**
 * Pre-computed node for the FlashList segment-per-cell architecture.
 * All layout values are computed once at build time — React never recomputes.
 * Each FlashList cell renders its own SVG segment from prevNode → thisNode.
 */
export interface JourneyNode {
  /** Unique node ID */
  id: string;
  /** Item type discriminator for FlashList `getItemType` */
  itemType: "node";
  /** 0-based global index across all units */
  globalIndex: number;
  /** Display label (tooltip text, e.g. "START") */
  label?: string;
  /** X offset from screen center for zig-zag positioning (px) */
  x: number;
  /** Absolute Y from top of virtual canvas (reference only) */
  y: number;
  /** FlashList cell height = Y gap to next node */
  cellHeight: number;
  /** Pre-built SVG path "M x0 y0 C ... x1 y1" in local cell coordinates (0 → cellHeight) */
  segmentD: string;
  /** Current node status */
  status: NodeStatus;
  /** 0–1 progress for active node ring */
  progress?: number;
  /** Config variant key (e.g. 'star', 'checkpoint', 'chest') */
  variantKey: string;
  /** Color theme key from parent unit */
  colorThemeKey: string;
  /** Task ID for navigation on press */
  taskId: string;
  /** Task type for routing */
  taskType: string;
  /** Node type for special handling (chest, etc.) */
  type: NodeType;
  /** Icon enum for fallback rendering */
  icon: NodeIcon;
  /** Rewards on completion */
  rewards: JourneyReward[];
  /** Parent unit ID */
  unitId: string;
  /** X position of the previous node (needed for segment start in local coords) */
  prevX: number;
}

/**
 * Unit divider item inserted between units in the flat FlashList array.
 */
export interface JourneyDividerItem {
  /** Unique ID for this divider */
  id: string;
  /** Item type discriminator */
  itemType: "divider";
  /** Cell height for the divider */
  cellHeight: number;
  /** Divider title text */
  title: string;
  /** Whether to show "JUMP HERE?" badge */
  showJumpHere: boolean;
  /** Accent color for the divider */
  accentColor?: string;
  /** Unit ID this divider precedes (for jump-to-unit) */
  targetUnitId: string;
}

/**
 * Mascot bubble item inserted at configured positions in the flat FlashList array.
 */
export interface JourneyMascotItem {
  /** Unique ID */
  id: string;
  /** Item type discriminator */
  itemType: "mascot";
  /** Cell height for the mascot row */
  cellHeight: number;
  /** Horizontal position */
  x: number;
  /** Which side of the path */
  side: "left" | "right";
  /** Message text */
  message: string;
}

/** Union type for all items in the FlashList data array */
export type JourneyFlashListItem =
  | JourneyNode
  | JourneyDividerItem
  | JourneyMascotItem;
