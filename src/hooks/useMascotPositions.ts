/**
 * useMascotPositions (Task 4.1.2)
 * Computes absolute positions for mascot placements along the journey path.
 *
 * For each MascotPlacement in the unit, the hook calculates an (x, y) position
 * relative to the referenced node, offset to the correct side of the path.
 *
 * NOTE: The pure computation is exposed via `computeMascotPositions` for use
 * inside useMemo / map callbacks where hook calls are not allowed.
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
// Pure computation helper (no hooks — safe to call anywhere)
// ---------------------------------------------------------------------------

/**
 * Pure function: computes mascot positions from placements + node positions.
 * Use this inside useMemo / map callbacks where hooks cannot be called.
 */
export function computeMascotPositions(
  mascotPlacements: MascotPlacement[],
  nodePositions: NodePosition[],
  screenWidth: number,
): MascotPositionData[] {
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

      // Move mascots to the far edges of the screen
      const margin: number = (MASCOT_SIZE.avatar / 2) + 16;
      const clampedX: number =
        mp.position === MascotSide.LEFT
          ? margin
          : screenWidth - margin;

      return {
        key: `mascot-${mp.afterNodeIndex}-${idx}`,
        x: clampedX,
        y: refNode.y + yOffset,
        side: mp.position,
        message: mp.message,
      };
    });
}

// ---------------------------------------------------------------------------
// Hook wrapper (memoized — safe to call at the top level of a component)
// ---------------------------------------------------------------------------

/**
 * Given the unit's mascotPlacements and the computed nodePositions,
 * returns an array of resolved mascot positions ready for rendering.
 * Call this at the top-level of a component only.
 * For useMemo / map callbacks use computeMascotPositions() instead.
 */
export function useMascotPositions(
  mascotPlacements: MascotPlacement[],
  nodePositions: NodePosition[],
  screenWidth: number,
): MascotPositionData[] {
  return useMemo(
    () => computeMascotPositions(mascotPlacements, nodePositions, screenWidth),
    [mascotPlacements, nodePositions, screenWidth],
  );
}
