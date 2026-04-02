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
