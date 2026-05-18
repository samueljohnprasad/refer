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
import type { NodeVisualStatus } from "@/src/types/journeyV5";
import type {
  Section,
  Unit,
  Node,
  UserNodeProgress,
} from "@/src/types/journeyV5";
import { PATH_LAYOUT } from "@/src/data/journey/constants";

const SCREEN_WIDTH = Dimensions.get("window").width;

// ── Constants ─────────────────────────────────────────────────────────────────

/** Where the node circle sits within its cell (matches JourneyNodeCell) */
const NODE_VERTICAL_POSITION_RATIO = 0.85;

/**
 * Maps the 5-state v5 NodeStatus to the 3-state visual status.
 * Any non-locked, non-completed status is visually 'active'.
 */
const V5_STATUS_TO_VISUAL: Record<string, NodeVisualStatus> = {
  locked: "locked",
  not_started: "active",
  in_progress: "active",
  attempted: "active",
  completed: "completed",
};

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
  const nodeY = cellHeight * NODE_VERTICAL_POSITION_RATIO;
  const controlY = cellHeight / 2;
  return `M ${prevX} 0 C ${prevX} ${controlY} ${thisX} ${controlY} ${thisX} ${nodeY}`;
}

// ── Main builder ──────────────────────────────────────────────────────────────

export interface JourneyLayoutResult {
  flashListData: JourneyFlashListItem[];
  activeGlobalIndex: number;
  units: UnitData[];
}

/**
 * Builds the flat FlashList data array from normalized v5 store entities.
 * Inserts a JourneyDividerItem before each unit's first node.
 * Computes zigzag positions and SVG bezier path segments per node.
 *
 * @param sections       - Ordered sections for the course
 * @param unitEntities   - Entity map of unit id → Unit
 * @param nodeEntities   - Entity map of node id → Node
 * @param unitsBySection - Relationship index from Redux store
 * @param nodesByUnit    - Relationship index from Redux store
 * @param nodeProgress   - Map of nodeId → UserNodeProgress (from store.journey.nodeProgress)
 */
export function buildJourneyFlashListData(
  sections: Section[],
  unitEntities: Record<string, Unit | undefined>,
  nodeEntities: Record<string, Node | undefined>,
  unitsBySection: Record<string, string[]>,
  nodesByUnit: Record<string, string[]>,
  nodeProgress: Record<string, UserNodeProgress>,
  selectedSectionId?: string,
): JourneyLayoutResult {
  const flashListData: JourneyFlashListItem[] = [];
  const unitsData: UnitData[] = [];

  const cellHeight = PATH_LAYOUT.verticalGap;
  let globalIndex = 0;
  let globalUnitNum = 0;
  let prevX = SCREEN_WIDTH / 2; // path enters from center for the first node

  let activeGlobalIndex = -1; // -1 means course complete (no active node)

  for (const section of sections) {
    const shouldIncludeSection =
      selectedSectionId === undefined || section.id === selectedSectionId;
    const unitIds = unitsBySection[section.id] ?? [];

    for (const unitId of unitIds) {
      const unit = unitEntities[unitId];
      if (!unit) continue;

      globalUnitNum++;
      const colorThemeKey =
        COLOR_THEME_CYCLE[(globalUnitNum - 1) % COLOR_THEME_CYCLE.length];
      if (!shouldIncludeSection) continue;

      const lastNodeGlobalIndex = globalIndex - 1;

      // ── Divider item before this unit's nodes ────────────────────────────
      const dividerItem: JourneyDividerItem = {
        id: `divider-${unit.id}`,
        itemType: "divider",
        cellHeight: 80,
        title: unit.title,
        accentColor: undefined,
        pathX: prevX,
        segmentD: `M ${prevX} 0 L ${prevX} ${cellHeight}`,
        prevNodeGlobalIndex:
          lastNodeGlobalIndex >= 0 ? lastNodeGlobalIndex : undefined,
      };
      flashListData.push(dividerItem);

      // ── Node items ───────────────────────────────────────────────────────
      const nodeIds = nodesByUnit[unit.id] ?? [];
      const unitNodes = nodeIds
        .map((id) => nodeEntities[id])
        .filter((n): n is Node => n !== undefined);

      const pathNodeDataList: UnitData["nodes"] = [];

      for (const node of unitNodes) {
        const v5Status = nodeProgress[node.id]?.status ?? "locked";
        const visualStatus = V5_STATUS_TO_VISUAL[v5Status] ?? "locked";
        const variantKey = NODE_TYPE_TO_VARIANT[node.type] ?? DEFAULT_VARIANT;
        const thisX = computeNodeX(globalIndex);

        if (visualStatus === "active" && activeGlobalIndex === -1) {
          activeGlobalIndex = globalIndex;
        }

        const journeyNode: JourneyNode = {
          id: node.id,
          itemType: "node",
          globalIndex,
          label: visualStatus === "active" ? "START" : undefined,
          x: thisX,
          y: PATH_LAYOUT.topPadding + globalIndex * cellHeight,
          cellHeight,
          segmentD: buildSegmentD(prevX, thisX, cellHeight),
          status: visualStatus as JourneyNode["status"],
          progress: undefined,
          variantKey,
          colorThemeKey,
          taskId: node.contentId ?? node.id,
          taskType: node.type,
          type: node.type as JourneyNode["type"],
          icon: "star" as JourneyNode["icon"],
          rewards: [],
          unitId: unit.id,
          prevX,
        };
        flashListData.push(journeyNode);

        pathNodeDataList.push({
          id: node.id,
          index: globalIndex,
          type: node.type as UnitData["nodes"][number]["type"],
          status: visualStatus as UnitData["nodes"][number]["status"],
          icon: "star" as UnitData["nodes"][number]["icon"],
          taskId: node.contentId ?? node.id,
          rewards: [],
        });

        prevX = thisX;
        globalIndex++;
      }

      // Build UnitData for useVisibleUnit
      unitsData.push({
        id: unit.id,
        sectionId: section.id,
        sectionNumber: section.orderIndex,
        unitNumber: unit.orderIndex,
        globalUnitNumber: globalUnitNum,
        title: unit.title,
        description: "",
        iconKey: unit.iconKey,
        colorScheme: colorThemeKey,
        nodes: pathNodeDataList,
        mascotPlacements: [],
      });
    }
  }

  return { flashListData, activeGlobalIndex, units: unitsData };
}
