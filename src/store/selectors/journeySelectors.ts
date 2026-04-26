import { createSelector } from "@reduxjs/toolkit";
import { Dimensions } from "react-native";
import type { JourneyFlashListItem, JourneyNode } from "@/src/types/journey";
import {
  buildJourneyNodes,
  type BuildJourneyNodesInput,
} from "@/src/utils/journey/buildJourneyNodes";
import { selectUnits } from "@/src/store/slices/sectionMapSelectors";
import { selectJourneyConfig } from "@/src/store/slices/enrolledCoursesSlice";
import { selectActiveNodeIndex } from "@/src/store/slices/sectionMapSelectors";

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
