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
import { DEFAULT_JOURNEY_CONFIG } from "@/src/data/journey/journeyConfig";

function createLegacyDividerItem(
  unit: UnitData,
  previousNodeX: number,
  previousNodeGlobalIndex: number,
  accentColor: string | undefined,
): JourneyDividerItem {
  return {
    id: `divider_${unit.id}`,
    itemType: "divider",
    cellHeight: DIVIDER_CELL_HEIGHT,
    title: unit.title,
    accentColor,
    connectorLaneX: previousNodeX,
    segmentD: buildDividerSegmentD(previousNodeX, DIVIDER_CELL_HEIGHT),
    prevNodeGlobalIndex: previousNodeGlobalIndex,
  };
}

/**
 * Create a divider item between units and return the updated accumulator.
 *
 * WHAT: Builds a JourneyDividerItem with the unit's title, accent color
 * from the unit's color theme, and a straight vertical SVG path segment.
 *
 * NOTE: This builder belongs to the older layout pipeline. It preserves the
 * legacy straight-through divider behavior, whereas the newer
 * `src/lib/utils/journeyLayout.ts` pipeline bends toward the next unit inside
 * the divider row itself.
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
  const dividerItem = createLegacyDividerItem(
    unit,
    acc.prevX,
    acc.globalIndex - 1,
    DEFAULT_JOURNEY_CONFIG.colorThemes[unit.colorScheme]?.headerGradient[1] ?? DEFAULT_JOURNEY_CONFIG.colorThemes.green.headerGradient[1],
  );

  return {
    ...acc,
    items: [...acc.items, dividerItem],
    cumulativeY: acc.cumulativeY + DIVIDER_CELL_HEIGHT,
  };
}
