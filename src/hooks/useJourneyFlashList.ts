/**
 * useJourneyFlashList
 * Custom hook that bridges the existing journey state system with
 * the new FlashList segment-per-cell architecture.
 *
 * Responsibilities:
 * - Calls buildJourneyNodes() once when journey data changes
 * - Stores result in journeyFlashListAtom
 * - Derives the active node index for scroll-to-active
 * - Provides the flat data array for JourneyMapFlashList
 *
 * Keeps all FlashList data prep in one place — container stays clean.
 */

import { useEffect, useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useAtomValue, useSetAtom } from 'jotai';

import type {
    JourneyFlashListItem,
    JourneyNode,
    JourneyConfig,
    UnitData,
    UnitConfig,
    SectionConfig,
} from '@/src/types/journey';
import { NodeStatus } from '@/src/types/journey';
import {
    journeyFlashListAtom,
    activeFlashListIndexAtom,
    journeyStateAtom,
    unitsAtom,
} from '@/src/store/journeyStore';
import { buildJourneyNodes } from '@/src/utils/journey/buildJourneyNodes';
import type { BuildJourneyNodesInput } from '@/src/utils/journey/buildJourneyNodes';

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
    const allUnits: UnitData[] = useAtomValue(unitsAtom);
    const setFlashListData = useSetAtom(journeyFlashListAtom);
    const activeNodeIndex: number = useAtomValue(activeFlashListIndexAtom);

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
        let runningY = config.settings.topPadding;

        allUnits.forEach((unit: UnitData, index: number) => {
            const unitConf = unitConfigMap.get(unit.id);
            if (!unitConf) return;

            // Find section number
            const section = config.sections.find((sec: SectionConfig) =>
                sec.unitIds.includes(unit.id)
            );

            // For the first unit, start at Y=0. For others, include divider and mascot heights
            // Actually, we can just scan flashListData to find the exact Y offset of the first item of this unit.
            let yOffset = 0;
            let currentY = 0;
            const firstItemOfUnit = flashListData.find((item) => {
                if (item.itemType === 'node' && (item as JourneyNode).unitId === unit.id) {
                    return true;
                }
                if (item.itemType === 'divider' && (item as any).targetUnitId === unit.id) {
                    return true;
                }
                // Mascot has ID prefix 'mascot_UNITID_'
                currentY += item.cellHeight;
                return false;
            });
            yOffset = currentY;

            headers.push({
                unitId: unit.id,
                unitNumber: unitConf.unitNumber,
                unitTitle: unitConf.title,
                sectionNumber: section?.sectionNumber ?? 1,
                colorThemeKey: unitConf.colorThemeKey,
                yOffset,
            });
        });

        return headers;
    }, [allUnits, unitConfigMap, config.sections, flashListData]);

    // Push to atom so other components/atoms can derive from it
    useEffect(() => {
        setFlashListData(flashListData);
    }, [flashListData, setFlashListData]);

    // Derive the active node's globalIndex for path segment coloring
    const activeGlobalIndex: number = useMemo(() => {
        if (activeNodeIndex < 0) return -1;
        const item: JourneyFlashListItem | undefined = flashListData[activeNodeIndex];
        if (!item || item.itemType !== 'node') return -1;
        return (item as JourneyNode).globalIndex;
    }, [flashListData, activeNodeIndex]);

    // Calculate the actual Y position of the active node for scroll-to-active calculation
    const activeNodeY: number | null = useMemo(() => {
        if (activeNodeIndex < 0 || activeNodeIndex >= flashListData.length) return null;
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
