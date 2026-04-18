import React from "react";
import { useWindowDimensions } from "react-native";
import { Stack, router } from "expo-router";

import type { SectionViewMode } from "@/src/types/journey/sectionMap";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { useInteractionLock } from "@/src/hooks/useInteractionLock";
import { useSoundEffects } from "@/src/hooks/useSoundEffects";
import { useSectionPrefetch } from "@/src/hooks/useSectionPrefetch";
import { useEnrollmentProgressSync } from "@/src/hooks/useEnrollmentProgressSync";
// Guest auth gate (P1.6.1)
import { useJourneyAuthGate } from "@/hooks/data/useJourneyAuthGate";
import { useGuestProgress } from "@/hooks/data/useGuestProgress";

import GuestSignUpSheet from "@/src/components/journey/GuestSignUpSheet";
import ChestRewardModal from "@/src/components/journey/ChestRewardModal";
import UnitCompleteModal from "@/src/components/journey/UnitCompleteModal";
import JourneyLoadingSkeleton from "@/src/components/journey/JourneyLoadingSkeleton";
import JourneyErrorState from "@/src/components/journey/JourneyErrorState";
import { JourneySwitcherSheet } from "@/src/components/journey/JourneySwitcherSheet";
import SectionOverviewSheet from "@/src/components/journey/SectionOverviewSheet";
import JourneyMapFlashList from "./JourneyMapFlashList";
import NodeContentLoadingOverlay from "@/src/components/journey/NodeContentLoadingOverlay";
import { createLogger } from "@/src/lib/logger";

// Refactored hooks
import {
  useJourneyRouteParams,
  useJourneySectionBridge,
  useNodeContentWithTimeout,
  useJourneyPersistence,
  useJourneyDerivedState,
  useNodePressHandler,
  useNodeActions,
  useJourneyScroll,
  useJourneySheets,
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
  const { play: playSound } = useSoundEffects();
  const { isOnline } = useNetworkStatus();
  const { guardedPress, lock: lockInteraction } = useInteractionLock();

  // 1. Route Params
  const {
    journeySlug,
    journeyAccessMode,
    resolvedJourneySlug,
    isSwitchingJourney,
    jumpToSection,
  } = useJourneyRouteParams({ slugOverride, modeOverride });

  // 2. Section Bridge (loading data & bridging to Jotai)
  const {
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
    allUnitsRaw,
    journeyTitle,
    config,
    unitConfigMap,
  } = useJourneySectionBridge(journeySlug, journeyAccessMode);

  // 3. Node Content Fetcher with Timeout
  const {
    content: nodeContent,
    isLoading: isNodeContentLoading,
    error: nodeContentError,
    fetchContent: fetchNodeContent,
    clearContent: clearNodeContent,
  } = useNodeContentWithTimeout();

  // 4. Persistence
  useJourneyPersistence(journeyState, isOnline);

  // Sync node completion progress → multi-journey enrollment store
  useEnrollmentProgressSync();

  // D5: Proactive prefetching
  useSectionPrefetch({
    slug: journeySlug,
    sectionMap,
    enabled: !isLoading && !isSwitchingSection,
  });

  // 5. Derived State & FlashList Data
  const {
    unitCompletedCounts,
    totalCompletedCount,
    flashListData,
    flashActiveNodeIndex,
    activeGlobalIndex,
    flashScreenWidth,
    flashActiveNodeY,
    unitHeaders,
  } = useJourneyDerivedState(journeyState, allUnitsRaw, config, unitConfigMap);

  // 6. Node Actions (Complete, update progress, chest claim)
  const { isGuest, canAccessNode, showSignUpPrompt, signUpSheetRef } = useJourneyAuthGate();
  const { guestProgress, recordGuestNodeCompletion } = useGuestProgress();

  const {
    handleCompleteNode,
    handleUpdateProgress,
    handleChestClaim,
    handleUnitComplete,
    handleUnitContinue,
    xpEarned,
    chestNode,
    setChestNode,
    chestModalRef,
    unitCompleteModalRef,
  } = useNodeActions({
    setJourneyState,
    playSound,
    lockInteraction,
    isOnline,
    enrollmentId,
    refresh,
    isGuest,
    recordGuestNodeCompletion,
    resolvedJourneySlug,
    journeyTitle,
    sectionMap,
    loadSection,
    journeySlug,
    loadCurrentPosition,
    journeyAccessMode,
    currentUnit,
    allUnitsRaw,
  });

  // 7. Node Press Handler
  const handleNodePress = useNodePressHandler({
    sectionMap,
    isGuest,
    canAccessNode,
    totalCompletedCount,
    showSignUpPrompt,
    playSound,
    fetchNodeContent,
    journeyAccessMode,
    resolvedJourneySlug,
    setChestNode,
    chestModalRef,
    guardedPress,
  });

  // 8. Scroll Management
  const {
    flashListRef,
    handleFlashListScrollToActive,
    handleFlashListJumpToUnit,
    currentScrollY,
    scrollY,
    isActiveOffScreen,
    scrollDirection,
    updateVisibility,
  } = useJourneyScroll({
    flashActiveNodeY,
    viewportHeight,
    flashActiveNodeIndex,
    jumpToSection,
    flashListData,
    USE_FLASH_LIST,
  });

  // 9. Sheets / Modals Management
  const {
    isSectionOverviewOpen,
    handleGuidePress,
    handleSectionOverviewClose,
    handleJumpToSection,
    isSwitcherOpen,
    handleFlagPress,
    handleSwitcherClose,
    handleSwitchJourney,
    handleDiscoverPress,
    handleArchiveJourney,
    switcherItems,
  } = useJourneySheets({
    loadSection,
    flashListRef,
    USE_FLASH_LIST,
  });

  // ── Render Error / Loading States ──
  if (!journeySlug) {
    return (
      <JourneyErrorState
        message="No journey was selected. Please choose a journey to continue."
        onRetry={() => {
          router.push("/tabs/(tabs)/journeys" as never);
        }}
      />
    );
  }

  if ((isLoading && !sectionMap) || isSwitchingJourney || isSwitchingSection) {
    return <JourneyLoadingSkeleton />;
  }

  if (dataError && !sectionMap) {
    return <JourneyErrorState message={dataError} onRetry={refresh} />;
  }

  if (!sectionMap || !currentUnit) {
    return (
      <JourneyErrorState
        message={dataError ?? "Could not load journey data. Please try again."}
        onRetry={refresh}
      />
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <JourneyMapFlashList
        key={`${journeySlug}:${sectionMap.section.id}`}
        data={flashListData}
        stats={stats}
        screenWidth={flashScreenWidth}
        activeGlobalIndex={activeGlobalIndex}
        onNodePress={handleNodePress}
        isOffline={!isOnline}
        isActiveOffScreen={isActiveOffScreen}
        scrollDirection={scrollDirection}
        onScrollToActive={() => handleFlashListScrollToActive()}
        onJumpToUnit={handleFlashListJumpToUnit}
        listRef={flashListRef}
        unitHeaders={unitHeaders}
        onGuidePress={handleGuidePress}
        onFlagPress={handleFlagPress}
        onScroll={(y) => {
          currentScrollY.current = y;
          updateVisibility(y);
        }}
      />

      {chestNode && (
        <ChestRewardModal
          ref={chestModalRef}
          node={chestNode}
          onClaim={handleChestClaim}
        />
      )}
      
      <UnitCompleteModal
        ref={unitCompleteModalRef}
        unit={currentUnit}
        xpEarned={xpEarned}
        onContinue={handleUnitContinue}
      />
      
      <GuestSignUpSheet ref={signUpSheetRef} guestProgress={guestProgress} />
      
      <SectionOverviewSheet
        isOpen={isSectionOverviewOpen}
        onClose={handleSectionOverviewClose}
        currentUnitIndex={currentUnitIndex}
        unitCompletedCounts={unitCompletedCounts}
        sectionList={sectionList}
        currentSectionUnitNumber={sectionMap?.section.unitNumber ?? 1}
        onJumpToSection={handleJumpToSection}
        journeyTitle={journeyTitle}
      />
      
      <JourneySwitcherSheet
        isOpen={isSwitcherOpen}
        onClose={handleSwitcherClose}
        items={switcherItems}
        onSwitchJourney={handleSwitchJourney}
        onDiscoverPress={handleDiscoverPress}
        onArchive={handleArchiveJourney}
      />
      
      <NodeContentLoadingOverlay
        isVisible={isNodeContentLoading}
        onCancel={clearNodeContent}
      />
    </>
  );
}
