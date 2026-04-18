import React, { useEffect, useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";

import type { SectionViewMode } from "@/src/types/journey/sectionMap";
import { useSectionData } from "@/src/hooks/useSectionData";
import { sectionMapToJourneyState } from "@/src/utils/journey/sectionMapBridge";
import { useJourneyConfig } from "@/src/context/JourneyConfigContext";
import {
  journeyStateAtom,
  currentUnitAtom,
  journeyStatsAtom,
  enrollmentIdAtom,
  currentUnitIndexAtom,
  unitsAtom,
  journeyTemplateAtom,
} from "@/src/store/journeyStore";
import type { JourneyConfig, UnitConfig, JourneyState, UnitData } from "@/src/types/journey";
import { createLogger } from "@/src/lib/logger";

const log = createLogger("useJourneySectionBridge");

export function useJourneySectionBridge(
  journeySlug: string | null,
  journeyAccessMode: SectionViewMode
) {
  const toast = useToast();

  const {
    isLoading,
    error: dataError,
    isOfflineFallback,
    isSwitchingSection,
    sectionMap,
    sectionList,
    activeNodeId: sectionActiveNodeId,
    loadSection,
    refresh,
    loadCurrentPosition,
    wasVersionInvalidated,
    resetVersionInvalidated,
  } = useSectionData(journeySlug, journeyAccessMode);

  const journeyState = useAtomValue(journeyStateAtom);
  const setJourneyState = useSetAtom(journeyStateAtom);
  const currentUnit = useAtomValue(currentUnitAtom);
  const stats = useAtomValue(journeyStatsAtom);
  const enrollmentIdFromAtom = useAtomValue(enrollmentIdAtom);
  const currentUnitIndex = useAtomValue(currentUnitIndexAtom);
  const allUnitsRaw = useAtomValue(unitsAtom);
  const journeyTemplate = useAtomValue(journeyTemplateAtom);

  const enrollmentId: string | null =
    sectionMap?.enrollment?.id ?? enrollmentIdFromAtom;

  const journeyTitle: string =
    sectionMap?.journey.title ?? journeyTemplate?.title ?? "Journey Overview";

  // D4: Show toast when journey template was updated (cache invalidated)
  useEffect(() => {
    if (wasVersionInvalidated) {
      toast.show({
        id: "journey-version-updated",
        placement: "top",
        render: () => (
          <Toast action="info">
            <ToastTitle>Journey updated — loading latest content</ToastTitle>
          </Toast>
        ),
      });
      resetVersionInvalidated();
    }
  }, [wasVersionInvalidated, toast, resetVersionInvalidated]);

  // Bridge: sync section map → journeyStateAtom so existing FlashList + UI works
  useEffect(() => {
    if (sectionMap) {
      const bridgedState: JourneyState = sectionMapToJourneyState(
        sectionMap,
        stats,
      );
      log.info("Bridging section map into journey state", {
        journeySlug,
        journeyAccessMode,
        sectionNumber: sectionMap.section.unitNumber,
        unitCount: sectionMap.section.units?.length ?? 0,
        nodeCount: sectionMap.section.nodes.length,
        progressCount: sectionMap.progress.length,
        hasEnrollment: sectionMap.enrollment !== null,
      });
      setJourneyState(bridgedState);
    }
  }, [journeySlug, sectionMap, setJourneyState, journeyAccessMode]);
  // `stats` is left out of dependency array to prevent unnecessary full-state resets on stat ticks.

  const config: JourneyConfig = useJourneyConfig();

  // ── Pre-built lookup Maps — O(1) instead of O(n) .find() per lookup ──
  // Built once when config changes (extremely rare — only on hot-swap).
  const unitConfigMap: Map<string, UnitConfig> = useMemo(
    () => new Map(config.units.map((uc: UnitConfig) => [uc.id, uc])),
    [config.units],
  );

  // In the lazy section flow, `allUnitsRaw` already contains only the visible
  // section's unit, so avoid filtering it through static config groups.
  const allUnits: UnitData[] = useMemo(() => {
    return allUnitsRaw;
  }, [allUnitsRaw]);

  return {
    isLoading,
    dataError,
    isOfflineFallback,
    isSwitchingSection,
    sectionMap,
    sectionList,
    sectionActiveNodeId,
    loadSection,
    refresh,
    loadCurrentPosition,
    journeyState,
    setJourneyState,
    currentUnit,
    stats,
    enrollmentId,
    currentUnitIndex,
    allUnits,
    allUnitsRaw,
    journeyTitle,
    config,
    unitConfigMap,
  };
}
