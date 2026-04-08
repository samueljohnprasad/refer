/**
 * useUnitCompletion (Task 4.3.2)
 * Detects when all nodes in the current unit are completed.
 *
 * Returns:
 * - isUnitComplete: boolean — true when every node is COMPLETED
 * - xpEarned: number — total XP from all node rewards in the unit
 *
 * The hook compares against the previous completion state to fire
 * the callback only on the transition from incomplete → complete.
 */

import { useEffect, useRef, useMemo } from "react";
import type {
  UnitData,
  PathNodeData,
  JourneyReward,
} from "@/src/types/journey";
import { NodeStatus, JourneyRewardType } from "@/src/types/journey";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UnitCompletionData {
  /** Whether every node in the unit is completed */
  isUnitComplete: boolean;
  /** Total XP earned across all node rewards in the unit */
  xpEarned: number;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Monitors unit completion state.
 *
 * @param unit - current unit data
 * @param onComplete - callback fired once when the unit transitions to complete
 */
export function useUnitCompletion(
  unit: UnitData | undefined,
  onComplete: () => void,
): UnitCompletionData {
  const prevCompleteRef = useRef<boolean>(false);

  const isUnitComplete: boolean = useMemo(() => {
    if (!unit || !unit.nodes || unit.nodes.length === 0) return false;
    return unit.nodes.every(
      (n: PathNodeData) => n && n.status === NodeStatus.COMPLETED,
    );
  }, [unit]);

  const xpEarned: number = useMemo(() => {
    if (!unit || !unit.nodes) return 0;
    return unit.nodes.reduce((total: number, node: PathNodeData) => {
      if (!node || !node.rewards) return total;
      const nodeXP: number = node.rewards.reduce(
        (sum: number, reward: JourneyReward) =>
          reward && reward.type === JourneyRewardType.XP ? sum + reward.amount : sum,
        0,
      );
      return total + nodeXP;
    }, 0);
  }, [unit]);

  // Fire onComplete only on the transition false → true
  useEffect(() => {
    if (isUnitComplete && !prevCompleteRef.current) {
      onComplete();
    }
    prevCompleteRef.current = isUnitComplete;
  }, [isUnitComplete, onComplete]);

  return { isUnitComplete, xpEarned };
}
