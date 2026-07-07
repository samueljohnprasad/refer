// lib/utils/journeyLayout.ts
// Pure utility: builds JourneyFlashListItem[] from normalized v5 store data.
// No Redux, no side effects, fully unit-testable.

import { Dimensions } from "react-native";
import type {
  JourneyNode,
  JourneyDividerItem,
  JourneyFlashListItem,
  UnitData,
} from "@/src/types/journey";
import {
  NodeIcon,
  NodeStatus as JourneyNodeStatus,
} from "@/src/types/journey/enums";
import type {
  NodeVisualStatus,
  Section,
  Unit,
  Node,
  UserNodeProgress,
} from "@/src/types/journeyV5";
import { PATH_LAYOUT, DIVIDER_LAYOUT } from "@/src/data/journey/constants";
import { DEFAULT_JOURNEY_CONFIG } from "@/src/data/journey/journeyConfig";
import {
  findCurrentNodeIdInCourse,
  resolveNodeVisualStatus,
} from "@/src/lib/journey/journeyProgress";
import { resolveNodeIcon } from "@/src/lib/journey/mentalHealthNodeMapping";

const SCREEN_WIDTH = Dimensions.get("window").width;

// ── Constants ─────────────────────────────────────────────────────────────────

/** Where the node circle sits within its cell (matches JourneyNodeCell) */
const NODE_VERTICAL_POSITION_RATIO = 0.85;
const DEFAULT_NODE_ICON = NodeIcon.STAR;
type UnitPathNode = UnitData["nodes"][number];

/**
 * Maps v5 node types to their visual variant key.
 * Each content type gets its own HugeIcons-backed visual variant.
 */
const NODE_TYPE_TO_VARIANT: Record<string, string> = {
  lesson: "learn",
  story: "story",
  quiz: "quiz",
  exercise: "exercise",
  practice: "practice",
  challenge: "challenge",
  boss: "boss",
};
const DEFAULT_VARIANT = "learn";

/** Color theme keys cycling across units in order */
const COLOR_THEME_CYCLE = ["green", "blue", "purple", "orange"];

// ── Position math ─────────────────────────────────────────────────────────────

/** Returns the zigzag X offset for a node at globalIndex. */
function computeNodeX(globalIndex: number): number {
  return (
    SCREEN_WIDTH / 2 +
    Math.sin((globalIndex * Math.PI) / PATH_LAYOUT.waveFrequency) *
      SCREEN_WIDTH *
      PATH_LAYOUT.amplitudeFactor
  );
}

/**
 * Builds the SVG bezier path "M x0 0 C ... xN {cellHeight * 0.85}"
 * in LOCAL cell coordinates (y=0 at cell top, y=cellHeight at cell bottom).
 * Connects from prevX at top to thisX at the node position.
 */
function buildSegmentD(
  prevX: number,
  thisX: number,
  cellHeight: number,
): string {
  const controlY = cellHeight / 2;
  return `M ${prevX} 0 C ${prevX} ${controlY} ${thisX} ${controlY} ${thisX} ${cellHeight}`;
}

/**
 * Builds the connector segment used inside a divider row.
 * Unlike node cells, the divider should complete the horizontal shift toward
 * the next unit before the next node cell begins.
 */
function buildDividerSegmentD(
  entryX: number,
  exitX: number,
  cellHeight: number,
): string {
  const controlY = cellHeight / 2;
  return (
    `M ${entryX} 0 ` +
    `C ${entryX} ${controlY} ${exitX} ${controlY} ${exitX} ${cellHeight}`
  );
}

function getUnitNodes(
  unitId: string,
  nodesByUnit: Record<string, string[]>,
  nodeEntities: Record<string, Node | undefined>,
): Node[] {
  return (nodesByUnit[unitId] ?? [])
    .map((id) => nodeEntities[id])
    .filter((node): node is Node => node !== undefined);
}

function resolveColorThemeKey(globalUnitNumber: number): string {
  return COLOR_THEME_CYCLE[(globalUnitNumber - 1) % COLOR_THEME_CYCLE.length]!;
}

function resolveFirstNodeX(
  globalIndex: number,
  unitNodes: Node[],
  previousNodeX: number,
): number {
  return unitNodes.length > 0 ? computeNodeX(globalIndex) : previousNodeX;
}

function resolveDividerConnectorLaneX(entryX: number, exitX: number): number {
  const interpolation = DIVIDER_LAYOUT.connectorLaneInterpolation;
  return Math.round(entryX + (exitX - entryX) * interpolation);
}

function createDividerItem(
  unit: Unit,
  entryX: number,
  exitX: number,
  previousNodeVisualStatus: NodeVisualStatus | null,
  previousNodeGlobalIndex: number | undefined,
  colorThemeKey: string,
): JourneyDividerItem {
  const theme = DEFAULT_JOURNEY_CONFIG.colorThemes[colorThemeKey] ?? DEFAULT_JOURNEY_CONFIG.colorThemes.green;
  const accentColor = theme.headerGradient[1];
  return {
    id: `divider-${unit.id}`,
    itemType: "divider",
    cellHeight: DIVIDER_LAYOUT.cellHeight,
    title: unit.title,
    accentColor,
    connectorLaneX: resolveDividerConnectorLaneX(entryX, exitX),
    segmentD: buildDividerSegmentD(entryX, exitX, DIVIDER_LAYOUT.cellHeight),
    isConnectorActive: previousNodeVisualStatus === "completed",
    prevNodeGlobalIndex: previousNodeGlobalIndex,
  };
}

function toJourneyNodeStatus(
  visualStatus: NodeVisualStatus,
): JourneyNode["status"] {
  switch (visualStatus) {
    case "active":
      return JourneyNodeStatus.ACTIVE;
    case "completed":
      return JourneyNodeStatus.COMPLETED;
    case "locked":
    default:
      return JourneyNodeStatus.LOCKED;
  }
}

function resolveVariantKey(nodeType: Node["type"]): string {
  return NODE_TYPE_TO_VARIANT[nodeType] ?? DEFAULT_VARIANT;
}

function resolveNodeSegmentStartX(
  nodeIndex: number,
  isFirstVisibleUnit: boolean,
  firstNodeX: number,
  previousNodeX: number,
): number {
  const isFirstNodeInVisibleUnit = nodeIndex === 0;
  if (!isFirstVisibleUnit && isFirstNodeInVisibleUnit) {
    return firstNodeX;
  }

  return previousNodeX;
}

function buildNodeSegment(
  globalIndex: number,
  segmentStartX: number,
  nodeX: number,
  cellHeight: number,
): string {
  if (globalIndex === 0) {
    return "";
  }

  return buildSegmentD(segmentStartX, nodeX, cellHeight);
}

function createPathNodeData(
  node: Node,
  globalIndex: number,
  visualStatus: NodeVisualStatus,
): UnitPathNode {
  return {
    id: node.id,
    index: globalIndex,
    type: node.type as UnitPathNode["type"],
    status: toJourneyNodeStatus(visualStatus),
    icon: (node.icon as any) || resolveNodeIcon(node.type),
    taskId: node.contentId ?? node.id,
    rewards: [],
  };
}

function createJourneyNodeItem(
  node: Node,
  globalIndex: number,
  nodeX: number,
  segmentStartX: number,
  cellHeight: number,
  colorThemeKey: string,
  visualStatus: NodeVisualStatus,
): JourneyNode {
  return {
    id: node.id,
    itemType: "node",
    globalIndex,
    label: visualStatus === "active" ? "START" : undefined,
    x: nodeX,
    y: PATH_LAYOUT.topPadding + globalIndex * cellHeight,
    cellHeight,
    segmentD: buildNodeSegment(globalIndex, segmentStartX, nodeX, cellHeight),
    status: toJourneyNodeStatus(visualStatus),
    progress: undefined,
    variantKey: resolveVariantKey(node.type),
    colorThemeKey,
    taskId: node.contentId ?? node.id,
    taskType: node.type,
    type: node.type as JourneyNode["type"],
    icon: (node.icon as any) || resolveNodeIcon(node.type),
    rewards: [],
    unitId: node.unitId,
    prevX: segmentStartX,
  };
}

function createVisibleUnitData(
  unit: Unit,
  section: Section,
  globalUnitNumber: number,
  colorThemeKey: string,
  nodes: UnitPathNode[],
): UnitData {
  return {
    id: unit.id,
    sectionId: section.id,
    sectionNumber: section.orderIndex,
    unitNumber: unit.orderIndex,
    globalUnitNumber,
    title: unit.title,
    description: "",
    iconKey: unit.iconKey,
    colorScheme: colorThemeKey,
    nodes,
    mascotPlacements: [],
  };
}

// ── Main builder ──────────────────────────────────────────────────────────────

export interface JourneyLayoutResult {
  flashListData: JourneyFlashListItem[];
  activeGlobalIndex: number;
  activeListIndex: number;
  units: UnitData[];
}

/**
 * Builds the flat FlashList data array from normalized v5 store entities.
 * Inserts a JourneyDividerItem before each visible unit after the first one.
 * Computes zigzag positions and SVG bezier path segments per node.
 *
 * @param sections       - Ordered sections for the course
 * @param unitEntities   - Entity map of unit id → Unit
 * @param nodeEntities   - Entity map of node id → Node
 * @param unitsBySection - Relationship index from Redux store
 * @param nodesByUnit    - Relationship index from Redux store
 * @param nodeProgress   - Map of nodeId → UserNodeProgress (from store.journey.nodeProgress)
 * @param renderedSectionId - Optional section id to render in isolation
 */
export function buildJourneyFlashListData(
  sections: Section[],
  unitEntities: Record<string, Unit | undefined>,
  nodeEntities: Record<string, Node | undefined>,
  unitsBySection: Record<string, string[]>,
  nodesByUnit: Record<string, string[]>,
  nodeProgress: Record<string, UserNodeProgress>,
  renderedSectionId?: string,
): JourneyLayoutResult {
  const flashListData: JourneyFlashListItem[] = [];
  const unitsData: UnitData[] = [];
  const currentNodeId = findCurrentNodeIdInCourse(
    sections.map((section) => section.id),
    unitsBySection,
    nodesByUnit,
    nodeProgress,
  );

  const cellHeight = PATH_LAYOUT.verticalGap;
  let globalIndex = 0;
  let globalUnitNumber = 0;
  let previousNodeX = SCREEN_WIDTH / 2; // path enters from center for the first node
  let previousNodeVisualStatus: NodeVisualStatus | null = null;

  let activeGlobalIndex = -1; // -1 means there is no active node in the rendered slice
  let activeListIndex = -1; // -1 means there is no active list item in the rendered slice

  for (const section of sections) {
    const shouldIncludeSection =
      renderedSectionId === undefined || section.id === renderedSectionId;
    const unitIds = unitsBySection[section.id] ?? [];

    for (const unitId of unitIds) {
      const unit = unitEntities[unitId];
      if (!unit) continue;

      globalUnitNumber++;
      const colorThemeKey = resolveColorThemeKey(globalUnitNumber);
      if (!shouldIncludeSection) continue;

      const unitNodes = getUnitNodes(unit.id, nodesByUnit, nodeEntities);
      const isFirstVisibleUnit = flashListData.length === 0;
      const lastNodeGlobalIndex = globalIndex - 1;
      const firstNodeX = resolveFirstNodeX(
        globalIndex,
        unitNodes,
        previousNodeX,
      );

      // ── Divider item before this unit's nodes ────────────────────────────
      if (!isFirstVisibleUnit) {
        flashListData.push(
          createDividerItem(
            unit,
            previousNodeX,
            firstNodeX,
            previousNodeVisualStatus,
            lastNodeGlobalIndex >= 0 ? lastNodeGlobalIndex : undefined,
            colorThemeKey,
          ),
        );
      }

      const pathNodeDataList: UnitPathNode[] = [];

      for (const [nodeIndex, node] of unitNodes.entries()) {
        const visualStatus = resolveNodeVisualStatus(
          node.id,
          currentNodeId,
          nodeProgress,
        );
        const nodeX = computeNodeX(globalIndex);
        const segmentStartX = resolveNodeSegmentStartX(
          nodeIndex,
          isFirstVisibleUnit,
          firstNodeX,
          previousNodeX,
        );

        if (visualStatus === "active" && activeGlobalIndex === -1) {
          activeGlobalIndex = globalIndex;
          activeListIndex = flashListData.length;
        }

        flashListData.push(
          createJourneyNodeItem(
            node,
            globalIndex,
            nodeX,
            segmentStartX,
            cellHeight,
            colorThemeKey,
            visualStatus,
          ),
        );
        pathNodeDataList.push(createPathNodeData(node, globalIndex, visualStatus));

        previousNodeX = nodeX;
        previousNodeVisualStatus = visualStatus;
        globalIndex++;
      }

      unitsData.push(
        createVisibleUnitData(
          unit,
          section,
          globalUnitNumber,
          colorThemeKey,
          pathNodeDataList,
        ),
      );
    }
  }

  return { flashListData, activeGlobalIndex, activeListIndex, units: unitsData };
}
