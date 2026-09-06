import type {
  DerivedStatus,
  NodeVisualStatus,
  UserNodeProgress,
  Node,
} from "@/src/types/journeyV5";

type NodeProgressMap = Record<string, UserNodeProgress>;
type UnitsBySectionIndex = Record<string, string[]>;
type NodesByUnitIndex = Record<string, string[]>;
type NodeEntityMap = Record<string, Node | undefined>;

const AUTOMATIC_REWARD_NODE_TYPES = new Set<Node["type"]>(["trophy"]);
const CLAIMABLE_REWARD_NODE_TYPES = new Set<Node["type"]>(["chest"]);

export function isProgressionNode(node: Node | undefined): boolean {
  return Boolean(node && !AUTOMATIC_REWARD_NODE_TYPES.has(node.type));
}

export function isClaimableRewardNode(node: Node | undefined): boolean {
  return Boolean(node && CLAIMABLE_REWARD_NODE_TYPES.has(node.type));
}

function isCompletedStatus(
  status: UserNodeProgress["status"] | undefined,
): boolean {
  return status === "completed";
}

function isStartedStatus(
  status: UserNodeProgress["status"] | undefined,
): boolean {
  return status === "in_progress" || status === "attempted";
}

export function findCurrentNodeIdInCourse(
  sectionIds: string[],
  unitsBySection: UnitsBySectionIndex,
  nodesByUnit: NodesByUnitIndex,
  nodeProgress: NodeProgressMap,
  nodeEntities: NodeEntityMap,
): string | null {
  for (const sectionId of sectionIds) {
    for (const unitId of unitsBySection[sectionId] ?? []) {
      for (const nodeId of nodesByUnit[unitId] ?? []) {
        if (!isProgressionNode(nodeEntities[nodeId])) continue;
        if (!isCompletedStatus(nodeProgress[nodeId]?.status)) {
          return nodeId;
        }
      }
    }
  }

  return null;
}

export function resolveDerivedStatusFromNodeIds(
  nodeIds: string[],
  currentNodeId: string | null,
  nodeProgress: NodeProgressMap,
  nodeEntities: NodeEntityMap,
): DerivedStatus {
  const requiredNodeIds = nodeIds.filter((nodeId) =>
    isProgressionNode(nodeEntities[nodeId]),
  );
  if (requiredNodeIds.length === 0) {
    return "locked";
  }

  const hasCurrentNode =
    currentNodeId !== null && requiredNodeIds.includes(currentNodeId);
  const hasCompletedNode = requiredNodeIds.some((nodeId) =>
    isCompletedStatus(nodeProgress[nodeId]?.status),
  );
  const hasStartedNode = requiredNodeIds.some((nodeId) =>
    isStartedStatus(nodeProgress[nodeId]?.status),
  );

  if (
    requiredNodeIds.every((nodeId) =>
      isCompletedStatus(nodeProgress[nodeId]?.status),
    )
  ) {
    return "completed";
  }

  if (hasCurrentNode || hasCompletedNode || hasStartedNode) {
    return "in_progress";
  }

  return "locked";
}

export function resolveNodeVisualStatus(
  node: Node,
  currentNodeId: string | null,
  nodeProgress: NodeProgressMap,
  previousRequiredNodeId: string | null,
): NodeVisualStatus {
  if (isCompletedStatus(nodeProgress[node.id]?.status)) {
    if (AUTOMATIC_REWARD_NODE_TYPES.has(node.type)) return "claimed";
    return "completed";
  }

  if (node.type === "chest" && !node.rewardContent) return "locked";

  if (node.type === "chest" && previousRequiredNodeId) {
    if (!isCompletedStatus(nodeProgress[previousRequiredNodeId]?.status)) {
      return "locked";
    }
  }

  if (node.id === currentNodeId) {
    return "active";
  }

  if (node.type === "chest") return "available";

  return "locked";
}
