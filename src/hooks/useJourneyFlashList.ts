/**
 * useJourneyFlashList
 * Custom hook that bridges the existing journey state system with
 * the new FlashList segment-per-cell architecture.
 *
 * Responsibilities:
 * - Calls buildJourneyNodes() once when journey data changes
 * - Derives the active node index for scroll-to-active
 * - Provides the flat data array for JourneyMapFlashList
 *
 * Keeps all FlashList data prep in one place — container stays clean.
 */

import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { useAppSelector } from "@/src/store/hooks";

import type {
  JourneyFlashListItem,
  JourneyNode,
  JourneyDividerItem,
  JourneyConfig,
  UnitData,
  UnitConfig,
} from "@/src/types/journey";
import { NodeStatus } from "@/src/types/journey";
import { buildJourneyNodes } from "@/src/utils/journey/buildJourneyNodes";
import type { BuildJourneyNodesInput } from "@/src/utils/journey/buildJourneyNodes";

// ---------------------------------------------------------------------------
// Return type
// ---------------------------------------------------------------------------

export interface UseJourneyFlashListReturn {
  /** Pre-computed flat data array for FlashList */
  flashListData: JourneyFlashListItem[];
  /** Index of the active node in the flat list (-1 if none) */
  activeNodeIndex: number;
  /** Global index of the active JourneyNode (for path coloring) */
  activeGlobalIndex: number;
  /** Screen width used in computation */
  screenWidth: number;
  /** The Y pixel offset of the active node */
  activeNodeY: number | null;
  /** Header data for all units for StickyUnitHeader */
  unitHeaders: UnitHeaderData[];
}

export interface UnitHeaderData {
  unitId: string;
  unitNumber: number;
  unitTitle: string;
  sectionNumber: number;
  colorThemeKey: string;
  yOffset: number;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useJourneyFlashList(
  config: JourneyConfig,
  unitConfigMap: Map<string, UnitConfig>,
  unitFilter?: string[],
): UseJourneyFlashListReturn {
  const { width: screenWidth } = useWindowDimensions();
  const allUnits: UnitData[] = useAppSelector(
    (state) => state.journey.journeyState?.units || [],
  );
  const journeyState = useAppSelector((state) => state.journey.journeyState);

  // Calculate active node index from journey state
  const activeNodeIndex: number = useMemo(() => {
    if (!journeyState || !journeyState.units) return -1;
    let globalIndex = 0;
    for (const unit of journeyState.units) {
      for (const node of unit.nodes) {
        if (node.status === NodeStatus.ACTIVE) {
          return globalIndex;
        }
        globalIndex++;
      }
    }
    return -1;
  }, [journeyState]);

  // Build the flat FlashList data array when units or screen width change.
  // This runs infrequently — only on data load, unit unlock, or orientation change.
  const flashListData: JourneyFlashListItem[] = useMemo(() => {
    if (allUnits.length === 0) return [];

    const input: BuildJourneyNodesInput = {
      units: allUnits,
      unitConfigMap,
      colorThemes: config.colorThemes,
      settings: config.settings,
      screenWidth,
      mascotMessages: config.mascotMessages,
      unitFilter,
    };

    return buildJourneyNodes(input);
  }, [allUnits, unitConfigMap, config, screenWidth, unitFilter]);

  // Compute unit headers with their estimated Y offsets for StickyUnitHeader
  const unitHeaders: UnitHeaderData[] = useMemo(() => {
    const headers: UnitHeaderData[] = [];

    allUnits.forEach((unit: UnitData) => {
      const unitConf = unitConfigMap.get(unit.id);

      const sectionNumber: number =
        unit.sectionNumber ?? unitConf?.unitNumber ?? unit.unitNumber;

      // For the first unit, start at Y=0. For others, include divider and mascot heights
      // Actually, we can just scan flashListData to find the exact Y offset of the first item of this unit.
      let currentY = 0;
      flashListData.find((item) => {
        if (
          item.itemType === "node" &&
          (item as JourneyNode).unitId === unit.id
        ) {
          return true;
        }

        // Mascot has ID prefix 'mascot_UNITID_'
        currentY += item.cellHeight;
        return false;
      });

      headers.push({
        unitId: unit.id,
        unitNumber: unit.unitNumber,
        unitTitle: unitConf?.title ?? unit.title,
        sectionNumber,
        colorThemeKey:
          unitConf?.colorThemeKey ??
          (config.colorThemes[unit.colorScheme] ? unit.colorScheme : "green"),
        yOffset: currentY,
      });
    });

    return headers;
  }, [allUnits, config.colorThemes, flashListData, unitConfigMap]);

  // Derive the active node's globalIndex for path segment coloring
  const activeGlobalIndex: number = useMemo(() => {
    if (activeNodeIndex < 0) return -1;
    const item: JourneyFlashListItem | undefined =
      flashListData[activeNodeIndex];
    if (!item || item.itemType !== "node") return -1;
    return (item as JourneyNode).globalIndex;
  }, [flashListData, activeNodeIndex]);

  // Calculate the actual Y position of the active node for scroll-to-active calculation
  const activeNodeY: number | null = useMemo(() => {
    if (activeNodeIndex < 0 || activeNodeIndex >= flashListData.length)
      return null;
    let y = 0;
    for (let i = 0; i < activeNodeIndex; i++) {
      y += flashListData[i].cellHeight;
    }
    y += flashListData[activeNodeIndex].cellHeight / 2;
    return y;
  }, [flashListData, activeNodeIndex]);

  return {
    flashListData,
    activeNodeIndex,
    activeGlobalIndex,
    screenWidth,
    activeNodeY,
    unitHeaders,
  };
}

export default useJourneyFlashList;
