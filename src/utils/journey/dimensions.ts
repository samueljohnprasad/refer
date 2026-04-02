/**
 * Journey Path Dimensions Calculator
 * Computes total container dimensions needed for the SVG layer and ScrollView.
 */

import type { NodePosition } from "@/src/types/journey";
import { PATH_LAYOUT } from "@/src/data/journey/constants";
import { approximatePathLength } from "./pathBuilder";

/** Computed dimensions for the journey map container */
export interface PathDimensions {
  /** Total width of the SVG container (= screen width) */
  width: number;
  /** Total height including top/bottom padding */
  height: number;
  /** Approximate total path length for strokeDasharray animations */
  totalLength: number;
}

/**
 * Calculate the full container dimensions from node positions.
 *
 * @param positions - all computed node positions
 * @param screenWidth - current screen width in dp
 * @returns dimensions for the SVG container and ScrollView content
 */
export function calculatePathDimensions(
  positions: NodePosition[],
  screenWidth: number,
): PathDimensions {
  if (positions.length === 0) {
    return { width: screenWidth, height: 0, totalLength: 0 };
  }

  const lastNodeY: number = positions[positions.length - 1].y;
  const height: number = lastNodeY + PATH_LAYOUT.bottomPadding;
  const totalLength: number = approximatePathLength(positions);

  return {
    width: screenWidth,
    height,
    totalLength,
  };
}
