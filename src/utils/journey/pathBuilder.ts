/**
 * Journey SVG Path Builder
 * Generates SVG path `d` strings from node positions using d3-path.
 * Uses cubic Bézier curves for smooth S-curve connections.
 *
 * @see https://github.com/d3/d3-path
 */

import { path as d3Path } from "d3-path";
import type { NodePosition } from "@/src/types/journey";

/** Heuristic multiplier: Bézier arc is ~1.2x the chord length */
const BEZIER_LENGTH_MULTIPLIER = 1.2;

/**
 * Build an SVG path `d` string connecting nodes with smooth cubic Bézier curves.
 *
 * For each consecutive pair (P1 → P2), control points sit at the vertical midpoint:
 *   CP1 = (P1.x, midY)   CP2 = (P2.x, midY)
 * This creates natural S-curves between zigzagging nodes.
 *
 * @param positions - ordered array of node center coordinates
 * @returns SVG path `d` string, or empty string if fewer than 2 positions
 */
export function buildPathD(positions: NodePosition[]): string {
  if (positions.length < 2) return "";

  const p = d3Path();
  p.moveTo(positions[0].x, positions[0].y);

  for (let i = 1; i < positions.length; i++) {
    const prev: NodePosition = positions[i - 1];
    const curr: NodePosition = positions[i];
    const midY: number = (prev.y + curr.y) / 2;

    p.bezierCurveTo(prev.x, midY, curr.x, midY, curr.x, curr.y);
  }

  return p.toString();
}

/**
 * Build a partial path `d` string up to a specific node index.
 * Useful for rendering the "completed" green progress portion.
 *
 * @param positions - ordered array of all node positions
 * @param upToIndex - index of the last node to include (inclusive)
 * @returns SVG path `d` string for the partial path
 */
export function buildPartialPathD(
  positions: NodePosition[],
  upToIndex: number,
): string {
  const clampedIndex: number = Math.max(
    0,
    Math.min(upToIndex, positions.length - 1),
  );
  return buildPathD(positions.slice(0, clampedIndex + 1));
}

/**
 * Approximate the total length of a cubic Bézier path.
 *
 * Uses chord-length estimation with a 1.2× multiplier
 * (standard heuristic for smooth curves).
 * Accurate enough for strokeDasharray/strokeDashoffset animations.
 *
 * @param positions - ordered array of node positions
 * @returns approximate path length in dp
 */
export function approximatePathLength(positions: NodePosition[]): number {
  if (positions.length < 2) return 0;

  let totalLength = 0;
  for (let i = 1; i < positions.length; i++) {
    totalLength += approximateSegmentLength(positions[i - 1], positions[i]);
  }
  return totalLength;
}

/**
 * Approximate the length of a single path segment between two nodes.
 *
 * @param from - start position
 * @param to - end position
 * @returns approximate segment length in dp
 */
export function approximateSegmentLength(
  from: NodePosition,
  to: NodePosition,
): number {
  const dx: number = to.x - from.x;
  const dy: number = to.y - from.y;
  return Math.sqrt(dx * dx + dy * dy) * BEZIER_LENGTH_MULTIPLIER;
}
