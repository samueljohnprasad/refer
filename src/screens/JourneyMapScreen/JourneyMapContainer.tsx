import React from "react";
import { useWindowDimensions, View } from "react-native";
import { Stack, router } from "expo-router";

import type { SectionViewMode } from "@/src/types/journey/sectionMap";
import JourneyLoadingSkeleton from "@/src/components/journey/JourneyLoadingSkeleton";
import JourneyMapFlashList from "./JourneyMapFlashList";
import { createLogger } from "@/src/lib/logger";
import { fetchSectionMap } from "@/src/lib/api/journeyApi";
import { currentSectionMapAtom } from "@/src/store/journeyStore";
import { useSetAtom } from "jotai";

import {
  useJourneySectionBridge,
  useJourneyDerivedState,
  useJourneyScroll,
} from "@/src/hooks/journeyMap";

const USE_FLASH_LIST = true;
const log = createLogger("JourneyMapContainer");

export interface JourneyMapContainerProps {
  slugOverride?: string;
  modeOverride?: SectionViewMode;
}

export default function JourneyMapContainer({
  slugOverride,
  modeOverride,
}: JourneyMapContainerProps = {}): React.JSX.Element {
  const { height: viewportHeight } = useWindowDimensions();
  const setCurrentSectionMap = useSetAtom(currentSectionMapAtom);

  const {
    isLoading,
    dataError,
    sectionMap,
    sectionList,
    journeyState,
    currentUnit,
    stats,
    allUnitsRaw,
    config,
    unitConfigMap,
  } = useJourneySectionBridge(slugOverride || "", modeOverride || "active");

  const handleSectionSwitch = React.useCallback(
    async (unitNumber: number) => {
      if (!slugOverride) return;
      try {
        const res = await fetchSectionMap(
          slugOverride,
          unitNumber,
          modeOverride || "active",
        );
        if (res.success && res.data) {
          setCurrentSectionMap(res.data);
        }
      } catch (error) {
        log.error("Failed to switch section", error);
      }
    },
    [slugOverride, modeOverride, setCurrentSectionMap],
  );

  const currentSectionNumber = sectionMap?.section.unitNumber;

  const {
    flashListData,
    flashActiveNodeIndex,
    activeGlobalIndex,
    flashScreenWidth,
    flashActiveNodeY,
    unitHeaders,
  } = useJourneyDerivedState(journeyState, allUnitsRaw, config, unitConfigMap);

  const {
    flashListRef,
    handleFlashListScrollToActive,
    handleFlashListJumpToUnit,
    currentScrollY,
    isActiveOffScreen,
    scrollDirection,
    updateVisibility,
  } = useJourneyScroll({
    flashActiveNodeY,
    viewportHeight,
    flashActiveNodeIndex,
    flashListData,
    USE_FLASH_LIST,
  });

  if (!slugOverride) {
    return <JourneyLoadingSkeleton />;
  }

  if (isLoading && !sectionMap) {
    return <JourneyLoadingSkeleton />;
  }

  if (dataError && !sectionMap) {
    return <JourneyLoadingSkeleton />;
  }

  if (!sectionMap || !currentUnit) {
    return <JourneyLoadingSkeleton />;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <JourneyMapFlashList
        key={`${slugOverride}:${sectionMap.section.id}`}
        data={flashListData}
        stats={stats}
        screenWidth={flashScreenWidth}
        activeGlobalIndex={activeGlobalIndex}
        onNodePress={() => {}}
        isActiveOffScreen={isActiveOffScreen}
        scrollDirection={scrollDirection}
        onScrollToActive={() => handleFlashListScrollToActive()}
        onJumpToUnit={(unitId) => handleFlashListJumpToUnit(unitId)}
        listRef={flashListRef}
        unitHeaders={unitHeaders}
        onGuidePress={() => {}}
        onFlagPress={() => {}}
        sectionList={sectionList}
        currentSectionNumber={currentSectionNumber}
        onSectionSwitch={handleSectionSwitch}
        onScroll={(y) => {
          currentScrollY.current = y;
          updateVisibility(y);
        }}
      />
    </>
  );
}
