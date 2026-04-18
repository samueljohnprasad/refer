/**
 * useMultiUnitLayout Hook (Task 9)
 * Computes node positions across ALL units in a single scrollable path.
 *
 * Each unit's nodes are offset vertically by the cumulative height of
 * previous units + divider spacing. Returns per-unit position arrays
 * and total path dimensions.
 */

import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import type { NodePosition } from "@/src/types/journey";
import type { UnitData, UnitConfig } from "@/src/types/journey";
import type { PathDimensions } from "@/src/utils/journey";
import { getAllNodePositions } from "@/src/utils/journey";
import type { WaveConfig } from "@/src/utils/journey";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Extra vertical space allocated for the divider between units */
const UNIT_DIVIDER_HEIGHT: number = 200;

/** Top padding before the first unit's first node */
const INITIAL_TOP_PADDING: number = 100;

/** Bottom padding after the last unit's last node */
const BOTTOM_PADDING: number = 200;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Layout data for a single unit within the multi-unit layout */
export interface UnitLayoutSegment {
  unitId: string;
  /** Node positions for this unit (absolute Y coordinates) */
  nodePositions: NodePosition[];
  /** Y offset where this unit starts (top of divider) */
  yOffset: number;
}

/** Return type for the useMultiUnitLayout hook */
export interface MultiUnitLayoutData {
  /** Screen width used for calculations */
  screenWidth: number;
  /** Per-unit layout segments with absolute positions */
  unitSegments: UnitLayoutSegment[];
  /** Total scrollable content dimensions */
  totalDimensions: PathDimensions;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Computes multi-unit layout. Each unit's nodes start after the previous
 * unit's last node + divider gap. All Y coordinates are absolute.
 *
 * Accepts a pre-built `unitConfigMap` (Map<unitId, UnitConfig>) so that
 * config lookups are O(1) instead of the previous O(n) `.find()` per unit.
 * The caller builds the Map once; this hook never scans the full config array.
 */
export function useMultiUnitLayout(
  units: UnitData[],
  unitConfigMap: Map<string, UnitConfig>,
  verticalGap: number = 160,
): MultiUnitLayoutData {
  const { width: screenWidth } = useWindowDimensions();

  const result: { segments: UnitLayoutSegment[]; totalHeight: number } =
    useMemo(() => {
      const segments: UnitLayoutSegment[] = [];
      let currentY: number = INITIAL_TOP_PADDING;

      units.forEach((unit: UnitData, unitIndex: number) => {
        // Add divider space before all units except the first
        if (unitIndex > 0) {
          currentY += UNIT_DIVIDER_HEIGHT;
        }

        const yOffset: number = currentY;

        // O(1) lookup instead of O(n) .find()
        const unitConfig: UnitConfig | undefined = unitConfigMap.get(unit.id);

        // Compute relative positions for this unit's nodes, then offset
        const nodePositions: NodePosition[] = getAllNodePositions(
          unit.nodes.length,
          screenWidth,
          {
            topPadding: 0,
            pathGeometry: unitConfig?.pathGeometry,
          },
        ).map((pos: NodePosition) => ({
          ...pos,
          y: pos.y + yOffset,
        }));

        segments.push({
          unitId: unit.id,
          nodePositions,
          yOffset,
        });

        // Advance currentY past the last node in this unit
        if (unit.nodes.length > 0) {
          currentY += (unit.nodes.length - 1) * verticalGap;
          // Add spacing after the last node before the next unit
          currentY += verticalGap;
        }
      });

      const totalHeight: number = currentY + BOTTOM_PADDING;

      return { segments, totalHeight };
    }, [units, screenWidth, unitConfigMap, verticalGap]);

  const totalDimensions: PathDimensions = useMemo(
    () => ({
      width: screenWidth,
      height: result.totalHeight,
      totalLength: result.totalHeight,
    }),
    [screenWidth, result.totalHeight],
  );

  return {
    screenWidth,
    unitSegments: result.segments,
    totalDimensions,
  };
}
