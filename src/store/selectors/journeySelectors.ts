import { createSelector } from "@reduxjs/toolkit";
import { Dimensions } from "react-native";
import type { RootState } from "@/src/store/store";
import type {
  UnitData,
  PathNodeData,
  JourneyFlashListItem,
  JourneyNode,
  JourneyConfig,
} from "@/src/types/journey";
import { NodeStatus } from "@/src/types/journey";
import {
  buildJourneyNodes,
  type BuildJourneyNodesInput,
} from "@/src/utils/journey/buildJourneyNodes";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ---------------------------------------------------------------------------
// Base selectors
// ---------------------------------------------------------------------------

const selectUnitsFromStore = (state: RootState): UnitData[] =>
  state.sectionMap.units;

const selectJourneyConfig = (state: RootState): JourneyConfig | null =>
  state.journey.config;

// ---------------------------------------------------------------------------
// Derived: Units (direct from store — no extraction needed)
// ---------------------------------------------------------------------------

export const selectUnits = selectUnitsFromStore;

// ---------------------------------------------------------------------------
// Derived: Completed counts
// ---------------------------------------------------------------------------

export const selectUnitCompletedCounts = createSelector(
  selectUnits,
  (units): Record<string, number> =>
    units.reduce(
      (counts, unit) => {
        const completed = unit.nodes.filter(
          (n: PathNodeData) => n.status === NodeStatus.COMPLETED,
        ).length;

        counts[unit.id] = completed;

        const sectionNumber = unit.sectionNumber;
        counts[`section_${sectionNumber}`] =
          (counts[`section_${sectionNumber}`] ?? 0) + completed;

        return counts;
      },
      {} as Record<string, number>,
    ),
);

export const selectTotalCompletedCount = createSelector(
  selectUnits,
  (units): number =>
    units.reduce(
      (acc, unit) =>
        acc +
        unit.nodes.filter(
          (n: PathNodeData) => n.status === NodeStatus.COMPLETED,
        ).length,
      0,
    ),
);

// ---------------------------------------------------------------------------
// Derived: FlashList data
// ---------------------------------------------------------------------------

export const selectFlashListData = createSelector(
  selectUnits,
  selectJourneyConfig,
  (units, config): JourneyFlashListItem[] => {
    if (units.length === 0 || !config) return [];

    const input: BuildJourneyNodesInput = {
      units,
      colorThemes: config.colorThemes,
      settings: config.settings,
      screenWidth: SCREEN_WIDTH,
      mascotMessages: config.mascotMessages,
    };

    return buildJourneyNodes(input);
  },
);

// ---------------------------------------------------------------------------
// Derived: Active node index (flat)
// ---------------------------------------------------------------------------

export const selectActiveNodeIndex = createSelector(
  selectUnits,
  (units): number => {
    let idx = 0;
    const found = units.find((unit) =>
      unit.nodes.find((node) => {
        if (node.status === NodeStatus.ACTIVE) return true;
        idx++;
        return false;
      }),
    );
    return found ? idx : -1;
  },
);

// ---------------------------------------------------------------------------
// Derived: Active global index (for path coloring)
// ---------------------------------------------------------------------------

export const selectActiveGlobalIndex = createSelector(
  selectFlashListData,
  selectActiveNodeIndex,
  (flashListData, activeNodeIndex): number => {
    if (activeNodeIndex < 0) return -1;
    const item = flashListData[activeNodeIndex];
    if (!item || item.itemType !== "node") return -1;
    return (item as JourneyNode).globalIndex;
  },
);

// ---------------------------------------------------------------------------
// Derived: Active node Y position (scroll target)
// ---------------------------------------------------------------------------

export const selectActiveNodeY = createSelector(
  selectFlashListData,
  selectActiveNodeIndex,
  (flashListData, activeNodeIndex): number | null => {
    if (activeNodeIndex < 0 || activeNodeIndex >= flashListData.length)
      return null;

    const yBeforeActive = flashListData
      .slice(0, activeNodeIndex)
      .reduce((sum, item) => sum + item.cellHeight, 0);

    return yBeforeActive + flashListData[activeNodeIndex].cellHeight / 2;
  },
);
