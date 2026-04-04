/**
 * Journey Node Factory
 * DRY builder functions for creating PathNodeData objects.
 * Avoids repetitive object construction in mock data and future API mappers.
 */

import { JourneyRewardType, NodeIcon, NodeStatus, NodeType } from "@/src/types/journey/enums";
import { JourneyReward, PathNodeData } from "@/src/types/journey/node";




/** Default rewards for a completed lesson node */
const DEFAULT_LESSON_REWARDS: JourneyReward[] = [
  { type: JourneyRewardType.XP, amount: 10, icon: "⚡" },
];

/** Default rewards for a completed checkpoint node */
const DEFAULT_CHECKPOINT_REWARDS: JourneyReward[] = [
  { type: JourneyRewardType.XP, amount: 25, icon: "⚡" },
  { type: JourneyRewardType.GEMS, amount: 5, icon: "💎" },
];

/** Default rewards for a chest node */
const DEFAULT_CHEST_REWARDS: JourneyReward[] = [
  { type: JourneyRewardType.XP, amount: 50, icon: "⚡" },
  { type: JourneyRewardType.GEMS, amount: 15, icon: "💎" },
  { type: JourneyRewardType.HEARTS, amount: 2, icon: "❤️" },
];

/** Map node type to its default icon when completed */
const COMPLETED_ICON_MAP: Record<NodeType, NodeIcon> = {
  [NodeType.LESSON]: NodeIcon.CHECKMARK,
  [NodeType.CHECKPOINT]: NodeIcon.CHECKMARK,
  [NodeType.CHEST]: NodeIcon.CHEST,
};

/** Map node type to its default icon when active */
const ACTIVE_ICON_MAP: Record<NodeType, NodeIcon> = {
  [NodeType.LESSON]: NodeIcon.STAR,
  [NodeType.CHECKPOINT]: NodeIcon.BOOK,
  [NodeType.CHEST]: NodeIcon.CHEST,
};

/** Map node type to its default rewards */
const REWARD_MAP: Record<NodeType, JourneyReward[]> = {
  [NodeType.LESSON]: DEFAULT_LESSON_REWARDS,
  [NodeType.CHECKPOINT]: DEFAULT_CHECKPOINT_REWARDS,
  [NodeType.CHEST]: DEFAULT_CHEST_REWARDS,
};

/** Derive the correct icon based on node type and status */
function resolveIcon(type: NodeType, status: NodeStatus): NodeIcon {
  if (status === NodeStatus.LOCKED) return NodeIcon.LOCK;
  if (status === NodeStatus.COMPLETED) return COMPLETED_ICON_MAP[type];
  return ACTIVE_ICON_MAP[type];
}

/** Optional overrides when creating a node */
interface NodeOverrides {
  label?: string;
  progress?: number;
  rewards?: JourneyReward[];
  taskId?: string;
}

/**
 * Create a single PathNodeData with sensible defaults.
 * Only requires index, type, and status — everything else is derived or overridable.
 */
export function createNode(
  index: number,
  type: NodeType,
  status: NodeStatus,
  overrides: NodeOverrides = {},
): PathNodeData {
  const {
    label,
    progress,
    rewards = REWARD_MAP[type],
    taskId = `task_${index}`,
  } = overrides;

  return {
    id: `node_${index}`,
    index,
    type,
    status,
    icon: resolveIcon(type, status),
    progress,
    label,
    taskId,
    rewards,
  };
}

/**
 * Batch-create a sequence of nodes with auto-incrementing status.
 * Nodes up to `completedCount` are completed, the next one is active, rest are locked.
 */
export function createNodeSequence(
  configs: { type: NodeType; overrides?: NodeOverrides }[],
  completedCount: number,
): PathNodeData[] {
  return configs.map((config, index) => {
    let status: NodeStatus;
    if (index < completedCount) {
      status = NodeStatus.COMPLETED;
    } else if (index === completedCount) {
      status = NodeStatus.ACTIVE;
    } else {
      status = NodeStatus.LOCKED;
    }

    return createNode(index, config.type, status, {
      ...config.overrides,
      // Auto-add "START" label to the active node
      label: config.overrides?.label ?? (index === completedCount ? "START" : undefined),
      // Set default progress for active node
      progress:
        index === completedCount
          ? (config.overrides?.progress ?? 0)
          : undefined,
    });
  });
}
