/**
 * Mascot item builder.
 *
 * WHY THIS FILE EXISTS:
 * Mascot speech bubbles are interleaved between nodes in the journey list.
 * Each unit config can define mascot placements like:
 *   { afterNodeIndex: 2, side: "left", messageKey: "great_progress" }
 *
 * This means "after the 3rd node, show a mascot bubble on the left with
 * the message keyed as 'great_progress'". The builder checks if any
 * placements should trigger after the just-processed node and, if so,
 * appends mascot items to the flat list.
 *
 * Mascot items take up vertical space (MASCOT_CELL_HEIGHT = 80px) so
 * cumulativeY is advanced for each one emitted.
 */

import type { JourneyMascotItem, MascotPlacement } from "@/src/types/journey";
import type { LayoutAccumulator, BuilderContext } from "./types";
import { MASCOT_CELL_HEIGHT } from "./types";

/**
 * Check for mascot placements that trigger after the given nodeIndex.
 * If any match, append JourneyMascotItem(s) to the accumulator.
 *
 * WHAT: Filters the unit's mascot placements for those with
 * afterNodeIndex === nodeIndex, then creates a JourneyMascotItem for each.
 *
 * WHY CALLED AFTER EVERY NODE: Mascot placements are position-dependent —
 * they appear at specific points in the node sequence. By checking after
 * each node, we interleave mascots at exactly the right positions in
 * the flat list.
 *
 * MESSAGE RESOLUTION: The placement stores a messageKey (e.g. "keep_going").
 * We look it up in ctx.mascotMessages to get the display string. If the
 * key isn't found, the key itself is shown as the message (graceful fallback).
 *
 * STATE CHANGES:
 * - items:       mascot item(s) appended
 * - cumulativeY: advanced by MASCOT_CELL_HEIGHT (80px) per mascot
 * - globalIndex: unchanged (mascots don't count as nodes)
 * - prevX:       unchanged (mascots don't shift the path)
 *
 * Returns the accumulator unchanged if no placements trigger at this index.
 */
export function buildMascotItems(
  nodeIndex: number,
  placements: MascotPlacement[],
  acc: LayoutAccumulator,
  ctx: BuilderContext,
): LayoutAccumulator {
  // Find placements that should appear after this node
  const triggered = placements.filter((p) => p.afterNodeIndex === nodeIndex);

  if (triggered.length === 0) return acc;

  return triggered.reduce((current, placement) => {
    // Resolve the message key to a display string
    const message = placement.messageKey
      ? (ctx.mascotMessages[placement.messageKey] ?? placement.messageKey)
      : "";

    const mascotItem: JourneyMascotItem = {
      id: `mascot_${current.items.length}_${nodeIndex}_${placement.messageKey ?? "default"}`,
      itemType: "mascot",
      cellHeight: MASCOT_CELL_HEIGHT,
      x: current.prevX,
      side: placement.side as "left" | "right",
      message,
      imageKey: placement.imageKey,
      avatarSize: placement.avatarSize,
      offsetY: placement.offsetY,
    };

    return {
      ...current,
      items: [...current.items, mascotItem],
      cumulativeY: current.cumulativeY + MASCOT_CELL_HEIGHT,
    };
  }, acc);
}
