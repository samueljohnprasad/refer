import React, { useEffect, useMemo } from "react";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";

import type { SectionViewMode } from "@/src/types/journey/sectionMap";
import { useSectionData } from "@/src/hooks/useSectionData";
import { sectionMapToJourneyState } from "@/src/utils/journey/sectionMapBridge";
import { useJourneyConfig } from "@/src/context/JourneyConfigContext";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { setJourneyState } from "@/src/store/slices/journeySlice";
import {
  setSectionMap,
  setSectionList,
  setActiveNodeId,
} from "@/src/store/slices/sectionMapSlice";
import type {
  JourneyConfig,
  UnitConfig,
  JourneyState,
  UnitData,
} from "@/src/types/journey";
import { createLogger } from "@/src/lib/logger";

const log = createLogger("useJourneySectionBridge");

export function useJourneySectionBridge(journeySlug: string | null) {
  const toast = useToast();
  const dispatch = useAppDispatch();

  const {
    isLoading,
    error: dataError,
    sectionMap,
    sectionList,
    activeNodeId: sectionActiveNodeId,
  } = useSectionData(journeySlug);

  const journeyState = useAppSelector((state) => state.journey.journeyState);
  const currentUnitIndex = useAppSelector(
    (state) => state.journey.currentUnitIndex,
  );
  const stats = useAppSelector((state) => state.journey.stats);

  const enrollmentId: string | null = sectionMap?.enrollment?.id ?? null;

  const journeyTitle: string = sectionMap?.journey.title ?? "Journey Overview";

  // Bridge: sync section map → Redux store
  useEffect(() => {
    if (sectionMap) {
      const bridgedState: JourneyState = sectionMapToJourneyState(
        sectionMap,
        stats,
      );

      dispatch(setJourneyState(bridgedState));
      dispatch(setSectionMap(sectionMap));
      dispatch(setSectionList(sectionList || []));
      dispatch(setActiveNodeId(sectionActiveNodeId || null));
    }
  }, [
    journeySlug,
    sectionMap,
    sectionList,
    sectionActiveNodeId,
    stats,
    dispatch,
  ]);

  const config: JourneyConfig = useJourneyConfig();

  // ── Pre-built lookup Maps — O(1) instead of O(n) .find() per lookup ──
  // Built once when config changes (extremely rare — only on hot-swap).
  const unitConfigMap: Map<string, UnitConfig> = useMemo(
    () => new Map(config.units.map((uc: UnitConfig) => [uc.id, uc])),
    [config.units],
  );

  // In the lazy section flow, `allUnitsRaw` already contains only the visible
  // section's unit, so avoid filtering it through static config groups.
  const allUnitsRaw = journeyState?.units || [];
  const allUnits: UnitData[] = useMemo(() => {
    return allUnitsRaw;
  }, [allUnitsRaw]);

  const currentUnit = journeyState?.units[journeyState.currentUnit];

  return {
    isLoading,
    dataError,
    sectionMap,
    sectionList,
    sectionActiveNodeId,
    journeyState,
    setJourneyState: (state: JourneyState) => dispatch(setJourneyState(state)),
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
