import { createSelector } from "@reduxjs/toolkit";
import { Dimensions } from "react-native";
import type { JourneyFlashListItem, JourneyNode } from "@/src/types/journey";
import {
  buildJourneyNodes,
  type BuildJourneyNodesInput,
} from "@/src/utils/journey/buildJourneyNodes";
import { selectUnits } from "@/src/store/selectors/sectionMapSelectors";
import { selectJourneyConfig } from "@/src/store/selectors/enrolledCoursesSelectors";
import { selectActiveNodeIndex } from "@/src/store/selectors/sectionMapSelectors";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ---------------------------------------------------------------------------
// Derived: FlashList data (cross-slice selector)
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
// Derived: Active global index (for path coloring)
// ---------------------------------------------------------------------------

/**
 * Returns the `globalIndex` of the currently active node so that path
 * segments can be coloured accordingly.
 *
 * WHY a scan instead of `flashListData[activeNodeIndex]`:
 * `activeNodeIndex` is a count of pure nodes before the active one, but
 * `flashListData` is a heterogeneous array (nodes + dividers + mascots).
 * Using `activeNodeIndex` as an array subscript puts us on a divider most
 * of the time, returning -1 and making every segment appear grey.
 *
 * We scan `flashListData` directly for the first item whose `itemType` is
 * "node" and whose `status` is "active", then return its stable `globalIndex`.
 *
 * Returns -1 when no active node exists (all completed or none loaded).
 */
export const selectActiveGlobalIndex = createSelector(
  selectFlashListData,
  (flashListData): number => {
    for (const item of flashListData) {
      if (item.itemType === "node") {
        const node = item as JourneyNode;
        if (node.status === "active") {
          return node.globalIndex;
        }
      }
    }
    return -1;
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
