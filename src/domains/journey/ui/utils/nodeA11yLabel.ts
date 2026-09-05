import { NodeType, NodeState } from "@/src/types/journey";

const TYPE_LABEL: Record<NodeType, string> = {
  [NodeType.LESSON]: "Lesson",
  [NodeType.CHECKPOINT]: "Checkpoint",
  [NodeType.CHEST]: "Reward chest",
  [NodeType.MILESTONE]: "Milestone",
};

const STATE_LABEL: Record<NodeState, string> = {
  [NodeState.LOCKED]: "locked",
  [NodeState.AVAILABLE]: "available",
  [NodeState.CURRENT]: "current",
  [NodeState.COMPLETED]: "completed",
  [NodeState.CLAIMED]: "claimed",
};

/** FR-014: "[TypeName], [StateName]" */
export function nodeA11yLabel(type: NodeType, state: NodeState): string {
  return `${TYPE_LABEL[type] ?? "Node"}, ${STATE_LABEL[state] ?? state}`;
}
