/**
 * Divider item builder.
 *
 * WHY THIS FILE EXISTS:
 * When the journey transitions from one unit to the next, a visual divider
 * is rendered — a horizontal separator with the unit title (e.g. "Unit 2:
 * Managing Anxiety"). The divider also carries a straight SVG path segment
 * so the journey line doesn't break between units.
 *
 * This builder encapsulates all divider-specific logic: theme resolution
 * for the accent color, SVG path generation, and accumulator state updates.
 */

import type { UnitData } from "@/src/types/journey";
import type { JourneyDividerItem } from "@/src/types/journey";
import type { LayoutAccumulator, BuilderContext } from "./types";
import { DIVIDER_CELL_HEIGHT } from "./types";
import { buildDividerSegmentD } from "./segmentPath";

/**
 * Create a divider item between units and return the updated accumulator.
 *
 * WHAT: Builds a JourneyDividerItem with the unit's title, accent color
 * from the unit's color theme, and a straight vertical SVG path segment.
 *
 * STATE CHANGES:
 * - items:       divider appended
 * - cumulativeY: advanced by DIVIDER_CELL_HEIGHT (180px)
 * - globalIndex: unchanged (dividers don't count as nodes)
 * - prevX:       unchanged (the path continues straight down)
 */
export function buildDividerItem(
  unit: UnitData,
  acc: LayoutAccumulator,
  ctx: BuilderContext,
): LayoutAccumulator {
  const themeConfig = ctx.colorThemes[unit.colorScheme];

  const dividerItem: JourneyDividerItem = {
    id: `divider_${unit.id}`,
    itemType: "divider",
    cellHeight: DIVIDER_CELL_HEIGHT,
    title: unit.title,
    accentColor: themeConfig?.dividerColor,
    pathX: acc.prevX,
    segmentD: buildDividerSegmentD(acc.prevX, DIVIDER_CELL_HEIGHT),
    prevNodeGlobalIndex: acc.globalIndex - 1,
  };

  return {
    ...acc,
    items: [...acc.items, dividerItem],
    cumulativeY: acc.cumulativeY + DIVIDER_CELL_HEIGHT,
  };
}
