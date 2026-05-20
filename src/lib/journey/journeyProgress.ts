import type {
  DerivedStatus,
  NodeVisualStatus,
  UserNodeProgress,
} from "@/src/types/journeyV5";

type NodeProgressMap = Record<string, UserNodeProgress>;
type UnitsBySectionIndex = Record<string, string[]>;
type NodesByUnitIndex = Record<string, string[]>;

function isCompletedStatus(status: UserNodeProgress["status"] | undefined): boolean {
  return status === "completed";
}

function isStartedStatus(status: UserNodeProgress["status"] | undefined): boolean {
  return status === "in_progress" || status === "attempted";
}

export function findCurrentNodeIdInCourse(
  sectionIds: string[],
  unitsBySection: UnitsBySectionIndex,
  nodesByUnit: NodesByUnitIndex,
  nodeProgress: NodeProgressMap,
): string | null {
  for (const sectionId of sectionIds) {
    for (const unitId of unitsBySection[sectionId] ?? []) {
      for (const nodeId of nodesByUnit[unitId] ?? []) {
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
): DerivedStatus {
  if (nodeIds.length === 0) {
    return "locked";
  }

  const hasCurrentNode = currentNodeId !== null && nodeIds.includes(currentNodeId);
  const hasCompletedNode = nodeIds.some((nodeId) =>
    isCompletedStatus(nodeProgress[nodeId]?.status),
  );
  const hasStartedNode = nodeIds.some((nodeId) =>
    isStartedStatus(nodeProgress[nodeId]?.status),
  );

  if (nodeIds.every((nodeId) => isCompletedStatus(nodeProgress[nodeId]?.status))) {
    return "completed";
  }

  if (hasCurrentNode || hasCompletedNode || hasStartedNode) {
    return "in_progress";
  }

  return "locked";
}

export function resolveNodeVisualStatus(
  nodeId: string,
  currentNodeId: string | null,
  nodeProgress: NodeProgressMap,
): NodeVisualStatus {
  if (isCompletedStatus(nodeProgress[nodeId]?.status)) {
    return "completed";
  }

  if (nodeId === currentNodeId) {
    return "active";
  }

  return "locked";
}
