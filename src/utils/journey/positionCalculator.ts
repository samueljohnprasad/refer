/**
 * Journey Node Position Calculator
 * Pure functions to compute node screen coordinates using a sine wave pattern.
 * Produces the Duolingo-style zigzag path layout.
 */

import type { NodePosition } from "@/src/types/journey";
import type { PathGeometryType } from "@/src/types/journey/config";
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
  /** Path style */
  pathGeometry?: PathGeometryType;
}

/** Default wave config derived from design constants */
const DEFAULT_WAVE_CONFIG: WaveConfig = {
  amplitudeFactor: PATH_LAYOUT.amplitudeFactor,
  verticalGap: PATH_LAYOUT.verticalGap,
  topPadding: PATH_LAYOUT.topPadding,
  waveFrequency: PATH_LAYOUT.waveFrequency,
  pathGeometry: 'straight',
};

/**
 * Calculate the screen position for a single node.
 * Uses the config.pathGeometry to determine mathematical path.
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
  const { amplitudeFactor, verticalGap, topPadding, waveFrequency, pathGeometry } = {
    ...DEFAULT_WAVE_CONFIG,
    ...config,
  };

  const centerX: number = screenWidth / 2;
  const amplitude: number = screenWidth * amplitudeFactor;
  let x = centerX;
  const y = topPadding + index * verticalGap;

  switch (pathGeometry) {
    case 'organic':
      // Base sine wave + pseudo-random noise jitter (index * prime)
      const baseSine = Math.sin((index * Math.PI) / waveFrequency);
      const noise = Math.sin(index * 7.3) * 0.3; // 30% jitter max
      x = centerX + (baseSine + noise) * amplitude;
      break;

    case 'zigzag':
      // Sharp linear triangle wave. (index % 4) maps smoothly
      // 0 -> 0, 1 -> 1, 2 -> 0, 3 -> -1
      const cycle = index % 4;
      let factor = 0;
      if (cycle === 0) factor = 0;
      else if (cycle === 1) factor = 1;
      else if (cycle === 2) factor = 0;
      else if (cycle === 3) factor = -1;
      else factor = 0; // fallback if index is fractional
      x = centerX + factor * amplitude * 1.2; // slight widen
      break;

    case 'straight':
      x = centerX;
      break;

    case 'sine':
    default:
      x = centerX + Math.sin((index * Math.PI) / waveFrequency) * amplitude;
      break;
  }

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
