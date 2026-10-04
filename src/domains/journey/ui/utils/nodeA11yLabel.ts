import { NodeType, NodeState } from "@/src/types/journey";
import type { TFunction } from "i18next";

type NodeTypeKey =
  | "nodeTypeLesson"
  | "nodeTypeCheckpoint"
  | "nodeTypeRewardChest"
  | "nodeTypeMilestone"
  | "nodeTypeTrophy";

type NodeStateKey =
  | "nodeStatusLocked"
  | "nodeStatusAvailable"
  | "nodeStatusCurrent"
  | "nodeStatusCompleted"
  | "nodeStatusClaimed";

const TYPE_LABEL_KEY: Record<NodeType, NodeTypeKey> = {
  [NodeType.LESSON]: "nodeTypeLesson",
  [NodeType.CHECKPOINT]: "nodeTypeCheckpoint",
  [NodeType.CHEST]: "nodeTypeRewardChest",
  [NodeType.MILESTONE]: "nodeTypeMilestone",
  [NodeType.TROPHY]: "nodeTypeTrophy",
};

const STATE_LABEL_KEY: Record<NodeState, NodeStateKey> = {
  [NodeState.LOCKED]: "nodeStatusLocked",
  [NodeState.AVAILABLE]: "nodeStatusAvailable",
  [NodeState.CURRENT]: "nodeStatusCurrent",
  [NodeState.COMPLETED]: "nodeStatusCompleted",
  [NodeState.CLAIMED]: "nodeStatusClaimed",
};

/** FR-014: "[TypeName], [StateName]" */
export function nodeA11yLabel(
  type: NodeType,
  state: NodeState,
  t: TFunction<"journeys">,
): string {
  return `${t(TYPE_LABEL_KEY[type])}, ${t(STATE_LABEL_KEY[state])}`;
}
