/**
 * Journey State Update Actions
 * Pure functions that produce new JourneyState from the current state.
 * Used by the container to dispatch state changes via Jotai's useSetAtom.
 *
 * Each action is a pure reducer: (state, payload) => newState
 * This keeps logic testable and separate from UI/atoms.
 */

import type {
  JourneyState,
  PathNodeData,
  UnitData,
  JourneyReward,
} from "@/src/types/journey";
import { NodeStatus, NodeIcon, JourneyRewardType } from "@/src/types/journey";

// ---------------------------------------------------------------------------
// completeNode
// ---------------------------------------------------------------------------

/**
 * Mark a node as completed and unlock the next node in sequence.
 * Awards rewards from the completed node to the stats.
 *
 * @param state - current journey state
 * @param nodeId - id of the node being completed
 * @returns updated JourneyState
 */
export function completeNode(
  state: JourneyState,
  nodeId: string,
): JourneyState {
  // Search ALL units for the node — not just currentUnit
  let targetUnitIndex: number = -1;
  let nodeIndex: number = -1;

  for (let ui: number = 0; ui < state.units.length; ui++) {
    const ni: number = state.units[ui].nodes.findIndex(
      (n: PathNodeData) => n.id === nodeId,
    );
    if (ni !== -1) {
      targetUnitIndex = ui;
      nodeIndex = ni;
      break;
    }
  }

  if (targetUnitIndex === -1 || nodeIndex === -1) return state;

  const unit: UnitData = state.units[targetUnitIndex];
  const node: PathNodeData = unit.nodes[nodeIndex];
  if (node.status !== NodeStatus.ACTIVE) return state;

  // Clone nodes array
  const updatedNodes: PathNodeData[] = [...unit.nodes];

  // Mark current node as completed
  updatedNodes[nodeIndex] = {
    ...node,
    status: NodeStatus.COMPLETED,
    icon: NodeIcon.CHECKMARK,
    progress: 1,
  };

  // Unlock next node if it exists and is locked
  const nextIndex: number = nodeIndex + 1;
  if (
    nextIndex < updatedNodes.length &&
    updatedNodes[nextIndex].status === NodeStatus.LOCKED
  ) {
    updatedNodes[nextIndex] = {
      ...updatedNodes[nextIndex],
      status: NodeStatus.ACTIVE,
      icon: NodeIcon.STAR,
      label: "START",
      progress: 0,
    };
  }

  // Apply rewards to stats
  const updatedStats = applyRewards(state.stats, node.rewards);

  // Build new units array
  const updatedUnits: UnitData[] = [...state.units];
  updatedUnits[targetUnitIndex] = { ...unit, nodes: updatedNodes };

  return {
    ...state,
    units: updatedUnits,
    lastActiveNodeId:
      nextIndex < updatedNodes.length ? updatedNodes[nextIndex].id : node.id,
    stats: updatedStats,
  };
}

// ---------------------------------------------------------------------------
// updateNodeProgress
// ---------------------------------------------------------------------------

/**
 * Update the progress value (0–1) of the active node.
 *
 * @param state - current journey state
 * @param nodeId - id of the active node
 * @param progress - new progress value (0–1)
 * @returns updated JourneyState
 */
export function updateNodeProgress(
  state: JourneyState,
  nodeId: string,
  progress: number,
): JourneyState {
  const unitIndex: number = state.currentUnit;
  const unit: UnitData = state.units[unitIndex];
  const nodeIndex: number = unit.nodes.findIndex(
    (n: PathNodeData) => n.id === nodeId,
  );

  if (nodeIndex === -1) return state;

  const node: PathNodeData = unit.nodes[nodeIndex];
  if (node.status !== NodeStatus.ACTIVE) return state;

  const clampedProgress: number = Math.max(0, Math.min(1, progress));

  const updatedNodes: PathNodeData[] = [...unit.nodes];
  updatedNodes[nodeIndex] = { ...node, progress: clampedProgress };

  const updatedUnits: UnitData[] = [...state.units];
  updatedUnits[unitIndex] = { ...unit, nodes: updatedNodes };

  return { ...state, units: updatedUnits };
}

// ---------------------------------------------------------------------------
// unlockUnit
// ---------------------------------------------------------------------------

/**
 * Unlock the next unit by setting its first node to ACTIVE.
 * Called when the last node in the current unit is completed.
 *
 * @param state - current journey state
 * @returns updated JourneyState with next unit unlocked
 */
export function unlockUnit(state: JourneyState): JourneyState {
  const nextUnitIndex: number = state.currentUnit + 1;
  if (nextUnitIndex >= state.units.length) return state;

  const nextUnit: UnitData = state.units[nextUnitIndex];
  if (nextUnit.nodes.length === 0) return state;

  const updatedNodes: PathNodeData[] = [...nextUnit.nodes];
  updatedNodes[0] = {
    ...updatedNodes[0],
    status: NodeStatus.ACTIVE,
    icon: NodeIcon.STAR,
    label: "START",
    progress: 0,
  };

  const updatedUnits: UnitData[] = [...state.units];
  updatedUnits[nextUnitIndex] = { ...nextUnit, nodes: updatedNodes };

  return {
    ...state,
    currentUnit: nextUnitIndex,
    units: updatedUnits,
    lastActiveNodeId: updatedNodes[0].id,
  };
}

// ---------------------------------------------------------------------------
// Reward helpers (private)
// ---------------------------------------------------------------------------

interface JourneyStatsInternal {
  streakDays: number;
  wallet: { coins: number; gems: number };
  hearts: number;
  totalXP: number;
}

function applyRewards(
  stats: JourneyStatsInternal,
  rewards: JourneyReward[],
): JourneyStatsInternal {
  let { totalXP, hearts } = stats;
  let { coins, gems } = stats.wallet;

  for (const reward of rewards) {
    switch (reward.type) {
      case JourneyRewardType.XP:
        totalXP += reward.amount;
        break;
      case JourneyRewardType.GEMS:
        gems += reward.amount;
        break;
      case JourneyRewardType.HEARTS:
        hearts += reward.amount;
        break;
      case JourneyRewardType.ACHIEVEMENT:
        // Handled separately by achievement system
        break;
    }
  }

  return {
    ...stats,
    totalXP,
    hearts,
    wallet: { coins, gems },
  };
}
