/**
 * Node item builder.
 *
 * WHY THIS FILE EXISTS:
 * Each journey node (lesson, quiz, checkpoint, chest, etc.) needs to be
 * transformed from raw data (PathNodeData) into a renderable JourneyNode
 * with computed screen position, SVG path segment, and resolved config keys.
 *
 * This is the most complex builder because it combines:
 * - Position calculation (sine-wave zigzag from positionCalculator)
 * - SVG segment generation (bezier curve connecting to previous node)
 * - Layout state tracking (globalIndex for path coloring, prevX for segments)
 */

import type { UnitData, PathNodeData, JourneyNode } from "@/src/types/journey";
import { NodeStatus, NodeType, NodeIcon } from "@/src/types/journey/enums";
import type { LayoutAccumulator, BuilderContext } from "./types";
import { MIN_NODE_CELL_HEIGHT } from "./types";
import { buildSegmentD } from "./segmentPath";
import { getNodePosition } from "../journey/positionCalculator";

// ---------------------------------------------------------------------------
// Icon resolution (visual concern — derived from type + status)
// ---------------------------------------------------------------------------

const COMPLETED_ICON_MAP: Record<string, NodeIcon> = {
  [NodeType.LESSON]: NodeIcon.CHECKMARK,
  [NodeType.CHECKPOINT]: NodeIcon.CHECKMARK,
  [NodeType.CHEST]: NodeIcon.CHEST,
};

const ACTIVE_ICON_MAP: Record<string, NodeIcon> = {
  [NodeType.LESSON]: NodeIcon.STAR,
  [NodeType.CHECKPOINT]: NodeIcon.BOOK,
  [NodeType.CHEST]: NodeIcon.CHEST,
};

function resolveIcon(nodeType: NodeType, status: NodeStatus): NodeIcon {
  if (status === NodeStatus.LOCKED) return NodeIcon.LOCK;
  if (status === NodeStatus.COMPLETED) {
    return COMPLETED_ICON_MAP[nodeType] ?? NodeIcon.CHECKMARK;
  }
  return ACTIVE_ICON_MAP[nodeType] ?? NodeIcon.STAR;
}

/**
 * Create a single JourneyNode and return the updated accumulator.
 *
 * WHAT: Takes a raw PathNodeData (from the API/store), computes its screen
 * position, builds the SVG path segment connecting it to the previous node,
 * and packages everything into a JourneyNode ready for FlashList rendering.
 *
 * HOW IT WORKS STEP BY STEP:
 *
 * 1. VARIANT RESOLUTION: Use the node's own variantKey. If missing, use
 *    taskType or type as-is. The UI handles unknown variants.
 *
 * 2. POSITION: Call getNodePosition(nodeIndex, screenWidth) which uses a sine-wave
 *    pattern to compute the zigzag X position. Y = cumulativeY + position.y.
 *
 * 3. CELL HEIGHT: Max of MIN_NODE_CELL_HEIGHT (80px) and settings.verticalGap.
 *    This is the pixel height of this cell in the FlashList — determines spacing.
 *
 * 4. SVG SEGMENT: For globalIndex > 0, build a cubic bezier from prevX (top of cell)
 *    to this node's X (bottom of cell). The first node has no segment (nothing above it).
 *
 * STATE CHANGES:
 * - items:       node appended
 * - globalIndex: incremented by 1 (used for path coloring — nodes before the active
 *                index get "completed" color, after get "locked" color)
 * - prevX:       updated to this node's X (next node's segment starts here)
 * - cumulativeY: unchanged (the orchestrator advances Y in bulk per unit)
 */
export function buildNodeItem(
  node: PathNodeData,
  nodeIndex: number,
  unit: UnitData,
  acc: LayoutAccumulator,
  ctx: BuilderContext,
): LayoutAccumulator {
  // Step 1: Resolve variant key directly from server data
  const variantKey = node.variantKey ?? node.taskType ?? String(node.type);

  const taskType = node.taskType ?? "lesson";

  // Step 2: Compute screen position (sine-wave zigzag)
  const position = getNodePosition(nodeIndex, ctx.screenWidth, {
    topPadding: 0,
  });

  // Step 3: Determine cell height (spacing between this node and the next)
  const cellHeight = Math.max(MIN_NODE_CELL_HEIGHT, ctx.settings.verticalGap);

  // Step 4: Build SVG segment from previous node to this one
  // Skip for the very first node (globalIndex 0) — nothing above it
  const segmentD =
    acc.globalIndex === 0
      ? ""
      : buildSegmentD(acc.prevX, position.x, cellHeight);

  // Derive visual properties from server-provided type + status
  const icon = resolveIcon(node.type, node.status);
  const label = node.status === NodeStatus.ACTIVE ? "START" : undefined;
  const progress =
    node.status === NodeStatus.ACTIVE
      ? (node.progress ?? 0)
      : node.status === NodeStatus.COMPLETED
        ? 1
        : undefined;

  const journeyNode: JourneyNode = {
    id: node.id,
    itemType: "node",
    globalIndex: acc.globalIndex,
    label,
    x: position.x,
    y: acc.cumulativeY + position.y,
    cellHeight,
    segmentD,
    status: node.status,
    progress,
    variantKey,
    colorThemeKey: unit.colorScheme,
    taskId: node.taskId,
    taskType,
    type: node.type,
    icon,
    rewards: node.rewards,
    unitId: unit.id,
    prevX: acc.prevX,
  };

  return {
    ...acc,
    items: [...acc.items, journeyNode],
    globalIndex: acc.globalIndex + 1,
    prevX: position.x,
  };
}
