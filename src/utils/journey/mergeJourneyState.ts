/**
 * mergeJourneyState
 * Pure function that combines a shared JourneyTemplate with per-user
 * UserJourneyProgress to produce the JourneyState shape consumed by
 * all existing UI components.
 *
 * The merge uses sparse storage semantics:
 * - A node with a progress row → use that row's status + progress
 * - A node with NO progress row → NodeStatus.LOCKED
 *
 * Output is the exact same JourneyState / UnitData / PathNodeData shape
 * the presentation layer already expects — zero UI changes required.
 */

import type {
  JourneyTemplate,
  JourneyTemplateNode,
  JourneyTemplateUnit,
} from '@/src/types/journey/template';
import type {
  UserJourneyProgress,
  UserNodeProgress,
} from '@/src/types/journey/progress';
import type {
  JourneyState,
  JourneyStats,
  PathNodeData,
  UnitData,
  MascotPlacement,
} from '@/src/types/journey';
import {
  NodeStatus,
  NodeType,
  NodeIcon,
} from '@/src/types/journey/enums';

// ---------------------------------------------------------------------------
// Icon resolution (mirrors nodeFactory.ts logic)
// ---------------------------------------------------------------------------

/** Map node type to its default icon when completed */
const COMPLETED_ICON_MAP: Record<string, NodeIcon> = {
  [NodeType.LESSON]: NodeIcon.CHECKMARK,
  [NodeType.CHECKPOINT]: NodeIcon.CHECKMARK,
  [NodeType.CHEST]: NodeIcon.CHEST,
};

/** Map node type to its default icon when active */
const ACTIVE_ICON_MAP: Record<string, NodeIcon> = {
  [NodeType.LESSON]: NodeIcon.STAR,
  [NodeType.CHECKPOINT]: NodeIcon.BOOK,
  [NodeType.CHEST]: NodeIcon.CHEST,
};

/** Derive the correct icon based on node type and status */
function resolveIcon(nodeType: string, status: NodeStatus): NodeIcon {
  if (status === NodeStatus.LOCKED) return NodeIcon.LOCK;
  if (status === NodeStatus.COMPLETED) {
    return COMPLETED_ICON_MAP[nodeType] ?? NodeIcon.CHECKMARK;
  }
  return ACTIVE_ICON_MAP[nodeType] ?? NodeIcon.STAR;
}

// ---------------------------------------------------------------------------
// Node merging
// ---------------------------------------------------------------------------

/**
 * Merge a single template node with user progress to produce a PathNodeData.
 *
 * @param templateNode - static node from the journey template
 * @param userProgress - user's progress for this node, or undefined if locked
 * @returns fully-resolved PathNodeData ready for the UI
 */
function mergeNode(
  templateNode: JourneyTemplateNode,
  userProgress: UserNodeProgress | undefined,
): PathNodeData {
  const status: NodeStatus = userProgress?.status ?? NodeStatus.LOCKED;

  return {
    id: templateNode.id,
    index: templateNode.nodeIndex,
    type: templateNode.nodeType as NodeType,
    status,
    icon: resolveIcon(templateNode.nodeType, status),
    progress: status === NodeStatus.ACTIVE
      ? (userProgress?.progress ?? 0)
      : status === NodeStatus.COMPLETED
        ? 1
        : undefined,
    label: status === NodeStatus.ACTIVE ? 'START' : undefined,
    taskId: templateNode.taskId,
    rewards: templateNode.rewards,
  };
}

// ---------------------------------------------------------------------------
// Unit merging
// ---------------------------------------------------------------------------

/**
 * Merge a template unit with user progress to produce a UnitData.
 *
 * @param templateUnit - static unit from the journey template
 * @param progressMap - lookup map of nodeId → UserNodeProgress
 * @returns fully-resolved UnitData ready for the UI
 */
function mergeUnit(
  templateUnit: JourneyTemplateUnit,
  progressMap: Map<string, UserNodeProgress>,
): UnitData {
  const nodes: PathNodeData[] = templateUnit.nodes.map(
    (templateNode: JourneyTemplateNode) =>
      mergeNode(templateNode, progressMap.get(templateNode.id)),
  );

  // Convert template mascot placements to the UI's MascotPlacement shape
  const mascotPlacements: MascotPlacement[] = templateUnit.mascotPlacements.map(
    (mp) => ({
      afterNodeIndex: mp.afterNodeIndex,
      position: mp.position,
      message: mp.message,
    }),
  );

  return {
    id: templateUnit.id,
    unitNumber: templateUnit.unitNumber,
    title: templateUnit.title,
    description: templateUnit.description,
    colorScheme: templateUnit.colorScheme,
    nodes,
    mascotPlacements,
  };
}

// ---------------------------------------------------------------------------
// Top-level merge
// ---------------------------------------------------------------------------

/**
 * Find the ID of the current active node across all units.
 * Falls back to the first node of the first unit if none found.
 */
function findActiveNodeId(units: UnitData[]): string {
  for (const unit of units) {
    const activeNode: PathNodeData | undefined = unit.nodes.find(
      (n: PathNodeData) => n.status === NodeStatus.ACTIVE,
    );
    if (activeNode) return activeNode.id;
  }
  // Fallback: first node of first unit
  return units[0]?.nodes[0]?.id ?? '';
}

/**
 * Merge a JourneyTemplate with UserJourneyProgress to produce JourneyState.
 *
 * This is the core function that bridges backend data to the existing UI.
 * The output shape is identical to what JourneyMapPresentation already consumes.
 *
 * @param template - shared journey structure from Supabase
 * @param progress - per-user enrollment + node progress from Supabase
 * @param stats - user stats for the journey header (from separate query)
 * @returns JourneyState ready for the Jotai atom
 */
export function mergeJourneyState(
  template: JourneyTemplate,
  progress: UserJourneyProgress,
  stats: JourneyStats,
): JourneyState {
  // Build a lookup map: nodeId → UserNodeProgress for O(1) access
  const progressMap: Map<string, UserNodeProgress> = new Map(
    progress.nodeProgress.map(
      (np: UserNodeProgress) => [np.nodeId, np] as const,
    ),
  );

  // Merge all units
  const units: UnitData[] = template.units.map(
    (templateUnit: JourneyTemplateUnit) =>
      mergeUnit(templateUnit, progressMap),
  );

  // Determine current unit (0-indexed from 1-indexed DB value)
  const currentUnit: number = Math.max(
    0,
    Math.min(
      progress.enrollment.currentUnitNumber - 1,
      units.length - 1,
    ),
  );

  return {
    currentUnit,
    units,
    lastActiveNodeId: findActiveNodeId(units),
    stats,
  };
}

// ---------------------------------------------------------------------------
// Helper: create empty progress for a fresh enrollment
// ---------------------------------------------------------------------------

/**
 * Create initial UserJourneyProgress for a user who just enrolled.
 * Sets the first node of the first unit as active, everything else locked.
 *
 * @param template - the journey template being enrolled in
 * @param enrollmentId - UUID of the new enrollment row
 * @param journeyId - UUID of the journey
 * @returns initial progress with one active node
 */
export function createInitialProgress(
  template: JourneyTemplate,
  enrollmentId: string,
  journeyId: string,
): UserJourneyProgress {
  const firstNode: JourneyTemplateNode | undefined =
    template.units[0]?.nodes[0];

  const nodeProgress: UserNodeProgress[] = firstNode
    ? [
        {
          nodeId: firstNode.id,
          status: NodeStatus.ACTIVE,
          progress: 0,
          rewardClaimed: false,
          completedAt: null,
        },
      ]
    : [];

  return {
    enrollment: {
      id: enrollmentId,
      journeyId,
      currentUnitNumber: 1,
      status: 'active',
      enrolledAt: new Date().toISOString(),
      templateVersion: template.version,
    },
    nodeProgress,
  };
}
