/**
 * buildJourneyNodes — Orchestrator
 *
 * WHY THIS FILE EXISTS:
 * The FlashList that renders the journey map needs a flat array of items
 * (nodes, dividers, mascot bubbles) with pre-computed positions, SVG paths,
 * and config keys. This orchestrator composes focused builder functions to
 * produce that array.
 *
 * HOW IT WORKS:
 * The pipeline uses a functional "reduce" pattern. A LayoutAccumulator
 * (carrying the growing items array + layout state) is threaded through
 * each builder. Each builder appends its item(s) and returns updated state.
 *
 * The two-level reduce:
 *   1. Outer reduce: iterates units — inserts dividers between them
 *   2. Inner reduce: iterates nodes within a unit — builds node items
 *      and interleaves mascot bubbles after each node
 *
 * This runs ONCE at data load (not per-frame). The result is stored in a
 * Redux selector / Jotai atom and only recomputed when journey data changes.
 */

import type { UnitData } from "@/src/types/journey";
import { NodeStatus } from "@/src/types/journey";
import type { JourneyNode, JourneyFlashListItem } from "@/src/types/journey";
import type {
  ColorThemeConfig,
  JourneySettingsConfig,
} from "@/src/types/journey";
import { BuilderContext, LayoutAccumulator } from "../builders/types";
import { buildDividerItem } from "../builders/dividerBuilder";
import { buildNodeItem } from "../builders/nodeBuilder";
import { buildMascotItems } from "../builders/mascotBuilder";



// ---------------------------------------------------------------------------
// Public input type
// ---------------------------------------------------------------------------

export interface BuildJourneyNodesInput {
  /** Runtime unit data with server-resolved node statuses */
  units: UnitData[];
  /** Color theme registry (theme key → colors) */
  colorThemes: Record<string, ColorThemeConfig>;
  /** Global layout settings (verticalGap, topPadding, nodeSize, etc.) */
  settings: JourneySettingsConfig;
  /** Device screen width in dp (for sine-wave positioning) */
  screenWidth: number;
  /** Message key → display string lookup (for mascot speech bubbles) */
  mascotMessages: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

/**
 * Build the flat FlashList data array from units.
 *
 * WHAT: Transforms hierarchical journey data (units → nodes) into a flat
 * array of renderable items (nodes, dividers, mascots) with pre-computed
 * positions and SVG paths.
 *
 * WHY FLAT: FlashList needs a flat array. Each item knows its own height
 * (cellHeight) and carries its own SVG path segment. This eliminates all
 * per-frame layout computation — the list just renders what it's given.
 *
 * PIPELINE:
 *   1. Create the BuilderContext (shared deps for all builders)
 *   2. Seed the accumulator (empty items, initial positions)
 *   3. Reduce over units:
 *      a. Insert divider between units (skip first unit)
 *      b. Reduce over nodes in unit:
 *         - Build node item (position, segment, variant)
 *         - Check for mascot placements after this node
 *      c. Advance cumulativeY past all nodes in this unit
 *   4. Return the accumulated items array
 */
export function buildJourneyNodes(
  input: BuildJourneyNodesInput,
): JourneyFlashListItem[] {
  const { units, colorThemes, settings, screenWidth, mascotMessages } = input;

  // Step 1: Build shared context that all builders will reference
  const ctx: BuilderContext = {
    screenWidth,
    settings,
    colorThemes,
    mascotMessages,
  };

  // Step 2: Initial accumulator — empty list, first node starts at screen center
  const seed: LayoutAccumulator = {
    items: [],
    globalIndex: 0,
    prevX: screenWidth / 2,
    cumulativeY: settings.topPadding,
  };

  // Step 3: Compose builders via reduce
  const result = units.reduce((acc, unit, unitIndex) => {
    // 3a. Insert divider between units (skip the first unit — nothing above it)
    const withDivider = unitIndex > 0 ? buildDividerItem(unit, acc, ctx) : acc;

    // 3b. Process each node, interleaving mascots after each
    const withNodes = unit.nodes.reduce((nodeAcc, node, nodeIndex) => {
      const withNode = buildNodeItem(node, nodeIndex, unit, nodeAcc, ctx);
      return buildMascotItems(
        nodeIndex,
        unit.mascotPlacements ?? [],
        withNode,
        ctx,
      );
    }, withDivider);

    // 3c. Advance cumulativeY past all nodes in this unit
    return {
      ...withNodes,
      cumulativeY:
        withNodes.cumulativeY + unit.nodes.length * settings.verticalGap,
    };
  }, seed);

  // Step 4: Extract the flat items array
  return result.items;
}

// ---------------------------------------------------------------------------
// Helpers (already clean, single-purpose — kept here for barrel export)
// ---------------------------------------------------------------------------

/**
 * Find the index of the currently active node in the flat list.
 *
 * WHY: Used for scroll-to-active — the FlashList needs to know which
 * index to scroll to when the user opens the journey map.
 *
 * Returns -1 if no active node found (e.g. all nodes completed).
 */
export function findActiveNodeIndex(items: JourneyFlashListItem[]): number {
  return items.findIndex(
    (item) =>
      item.itemType === "node" &&
      (item as JourneyNode).status === NodeStatus.ACTIVE,
  );
}

/**
 * Update a single node's status in the flat array (immutable).
 *
 * WHY: When a user completes a node, we need to update the flat list
 * without rerunning the entire build pipeline. This returns a new array
 * with only the target node's status changed.
 *
 * O(n) copy but only runs on completion events — not per-frame.
 */
export function updateNodeStatus(
  items: JourneyFlashListItem[],
  nodeId: string,
  newStatus: NodeStatus,
): JourneyFlashListItem[] {
  return items.map((item): JourneyFlashListItem => {
    if (item.itemType !== "node") return item;
    const node = item as JourneyNode;
    if (node.id !== nodeId) return item;
    return { ...node, status: newStatus };
  });
}
