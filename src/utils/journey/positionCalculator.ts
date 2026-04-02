/**
 * Journey Node Position Calculator
 * Pure functions to compute node screen coordinates using a sine wave pattern.
 * Produces the Duolingo-style zigzag path layout.
 */

import type { NodePosition } from "@/src/types/journey";
import { PATH_LAYOUT } from "@/src/data/journey/constants";

/** Configuration for tuning the zigzag wave */
export interface WaveConfig {
  /** Fraction of screenWidth for horizontal swing (default: 0.22) */
  amplitudeFactor: number;
  /** Vertical gap between nodes in dp (default: 120) */
  verticalGap: number;
  /** Top padding before first node in dp (default: 100) */
  topPadding: number;
  /** Controls how many nodes per full sine cycle (default: 2.5) */
  waveFrequency: number;
}

/** Default wave config derived from design constants */
const DEFAULT_WAVE_CONFIG: WaveConfig = {
  amplitudeFactor: PATH_LAYOUT.amplitudeFactor,
  verticalGap: PATH_LAYOUT.verticalGap,
  topPadding: PATH_LAYOUT.topPadding,
  waveFrequency: PATH_LAYOUT.waveFrequency,
};

/**
 * Calculate the screen position for a single node.
 *
 * Uses `x = centerX + sin(index * π / frequency) * amplitude`
 * to create a natural S-curve zigzag pattern.
 *
 * @param index - 0-based node index within the unit
 * @param screenWidth - current screen width in dp
 * @param config - optional wave tuning overrides
 * @returns {NodePosition} x, y coordinates for the node center
 */
export function getNodePosition(
  index: number,
  screenWidth: number,
  config: Partial<WaveConfig> = {},
): NodePosition {
  const { amplitudeFactor, verticalGap, topPadding, waveFrequency } = {
    ...DEFAULT_WAVE_CONFIG,
    ...config,
  };

  const centerX: number = screenWidth / 2;
  const amplitude: number = screenWidth * amplitudeFactor;

  const x: number =
    centerX + Math.sin((index * Math.PI) / waveFrequency) * amplitude;
  const y: number = topPadding + index * verticalGap;

  return { x, y };
}

/**
 * Calculate positions for all nodes in a unit.
 *
 * @param nodeCount - total number of nodes
 * @param screenWidth - current screen width in dp
 * @param config - optional wave tuning overrides
 * @returns array of NodePosition in order
 */
export function getAllNodePositions(
  nodeCount: number,
  screenWidth: number,
  config: Partial<WaveConfig> = {},
): NodePosition[] {
  return Array.from({ length: nodeCount }, (_, index) =>
    getNodePosition(index, screenWidth, config),
  );
}
