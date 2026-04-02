/**
 * useJourneyLayout Hook
 * Computes and memoizes node positions + path dimensions
 * based on screen width and node count. Recalculates on resize.
 */

import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import type { NodePosition } from "@/src/types/journey";
import type { PathDimensions, WaveConfig } from "@/src/utils/journey";
import {
  getAllNodePositions,
  calculatePathDimensions,
} from "@/src/utils/journey";

/** Return type for the useJourneyLayout hook */
export interface JourneyLayoutData {
  /** Screen width used for calculations */
  screenWidth: number;
  /** Screen height */
  screenHeight: number;
  /** Computed positions for each node */
  nodePositions: NodePosition[];
  /** SVG container dimensions and path length */
  pathDimensions: PathDimensions;
}

/**
 * Computes memoized layout data for the journey map.
 * Recalculates when nodeCount or screen dimensions change.
 *
 * @param nodeCount - number of nodes in the current unit
 * @param config - optional wave config overrides
 * @returns memoized positions and dimensions
 */
export function useJourneyLayout(
  nodeCount: number,
  config?: Partial<WaveConfig>,
): JourneyLayoutData {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const nodePositions: NodePosition[] = useMemo(
    () => getAllNodePositions(nodeCount, screenWidth, config),
    [nodeCount, screenWidth, config],
  );

  const pathDimensions: PathDimensions = useMemo(
    () => calculatePathDimensions(nodePositions, screenWidth),
    [nodePositions, screenWidth],
  );

  return {
    screenWidth,
    screenHeight,
    nodePositions,
    pathDimensions,
  };
}
