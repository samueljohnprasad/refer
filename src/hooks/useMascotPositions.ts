/**
 * useMascotPositions (Task 4.1.2)
 * Computes absolute positions for mascot placements along the journey path.
 *
 * For each MascotPlacement in the unit, the hook calculates an (x, y) position
 * relative to the referenced node, offset to the correct side of the path.
 */

import { useMemo } from "react";
import type { NodePosition, MascotPlacement } from "@/src/types/journey";
import { MascotSide } from "@/src/types/journey";
import { MASCOT_SIZE, NODE_SIZE } from "@/src/data/journey/constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Resolved position for a single mascot instance */
export interface MascotPositionData {
  /** Unique key for rendering */
  key: string;
  /** Center X of the mascot avatar */
  x: number;
  /** Center Y of the mascot avatar */
  y: number;
  /** Side of the path */
  side: MascotSide;
  /** Speech bubble message */
  message: string | undefined;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Given the unit's mascotPlacements and the computed nodePositions,
 * returns an array of resolved mascot positions ready for rendering.
 */
export function useMascotPositions(
  mascotPlacements: MascotPlacement[],
  nodePositions: NodePosition[],
  screenWidth: number,
): MascotPositionData[] {
  return useMemo(() => {
    if (mascotPlacements.length === 0 || nodePositions.length === 0) {
      return [];
    }

    return mascotPlacements
      .filter(
        (mp: MascotPlacement) =>
          mp.afterNodeIndex >= 0 && mp.afterNodeIndex < nodePositions.length,
      )
      .map((mp: MascotPlacement, idx: number): MascotPositionData => {
        const refNode: NodePosition = nodePositions[mp.afterNodeIndex];
        const nodeHalf: number = NODE_SIZE.regular / 2;

        // Place mascot to the designated side, offset from the node edge
        const xOffset: number =
          mp.position === MascotSide.LEFT
            ? -(nodeHalf + MASCOT_SIZE.horizontalOffset)
            : nodeHalf + MASCOT_SIZE.horizontalOffset;

        // Slightly below the reference node center
        const yOffset: number = MASCOT_SIZE.verticalOffset;

        // Clamp X so the mascot + bubble stays within screen bounds
        const rawX: number = refNode.x + xOffset;
        const margin: number = MASCOT_SIZE.avatar / 2 + 8;
        const clampedX: number = Math.max(
          margin,
          Math.min(rawX, screenWidth - margin - MASCOT_SIZE.bubbleMaxWidth),
        );

        return {
          key: `mascot-${mp.afterNodeIndex}-${idx}`,
          x: clampedX,
          y: refNode.y + yOffset,
          side: mp.position,
          message: mp.message,
        };
      });
  }, [mascotPlacements, nodePositions, screenWidth]);
}
