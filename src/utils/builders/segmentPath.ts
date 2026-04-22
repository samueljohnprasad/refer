/**
 * SVG path segment builders for the journey map.
 *
 * WHY THIS FILE EXISTS:
 * Each cell in the FlashList renders its own SVG path segment that visually
 * connects to the cells above and below it. This "segment-per-cell" approach
 * means we don't need a single giant SVG canvas — each cell is independent
 * and can be recycled by the list virtualizer.
 *
 * All coordinates are LOCAL to the cell (y ranges from 0 to cellHeight).
 * The cell's SVG viewport handles the positioning on screen.
 */

import { path as d3Path } from "d3-path";

/**
 * Build a cubic bezier SVG `d` string connecting two nodes.
 *
 * WHAT: Draws a smooth S-curve from the previous node's X position (top of cell)
 * to the current node's X position (bottom of cell).
 *
 * WHY BEZIER: A straight line between zigzagging nodes would look jagged.
 * The bezier with control points at the vertical midpoint creates the smooth
 * Duolingo-style curves users expect.
 *
 * HOW:
 *   Start:  (prevX, 0)           — top of cell, aligned with previous node
 *   CP1:    (prevX, midY)        — pulls the curve down from the start
 *   CP2:    (thisX, midY)        — pulls the curve toward the end
 *   End:    (thisX, cellHeight)  — bottom of cell, aligned with current node
 */
export function buildSegmentD(
  prevX: number,
  thisX: number,
  cellHeight: number,
): string {
  if (cellHeight <= 0) return "";

  const p = d3Path();
  const midY = cellHeight / 2;

  p.moveTo(prevX, 0);
  p.bezierCurveTo(prevX, midY, thisX, midY, thisX, cellHeight);

  return p.toString();
}

/**
 * Build a straight vertical SVG path for a divider cell.
 *
 * WHAT: Draws a straight line from top to bottom of the divider cell.
 *
 * WHY: Dividers sit between units. The path must continue through them
 * so the journey line doesn't visually break. Since dividers don't shift
 * horizontally, a straight vertical line is all that's needed.
 */
export function buildDividerSegmentD(
  pathX: number,
  cellHeight: number,
): string {
  if (cellHeight <= 0) return "";

  const p = d3Path();
  p.moveTo(pathX, 0);
  p.lineTo(pathX, cellHeight);

  return p.toString();
}
