import React, { useCallback, useMemo } from "react";
import Animated from "react-native-reanimated";
import { LegendList } from "@legendapp/list";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { JourneyFlashListItem, PathNodeData } from "@/src/types/journey";

import BottomSheetWithRNContent from "@/src/components/BottomSheetWithRNContent";
import { SectionOverviewSheet } from "@/src/components/journey/SectionOverviewSheet";
import ScrollToActiveButton from "@/src/components/journey/ScrollToActiveButton";
import {
  ESTIMATED_ITEM_SIZE,
  JOURNEY_VIEWABILITY_CONFIG,
  JourneyMapEmptyState,
  JourneyMapListFooter,
  JourneyMapListItem,
  JourneyMapLoadingState,
  getJourneyMapItemKey,
  getJourneyMapItemType,
} from "./JourneyMapListItems";
import { useJourneyMapController } from "./useJourneyMapController";
import { View } from "react-native";

const AnimatedLegendList = Animated.createAnimatedComponent(
  LegendList,
) as typeof LegendList;

export interface JourneyMapFlashListProps {
  courseId: string;
  controller: ReturnType<typeof useJourneyMapController>;
}

function JourneyMapFlashListInner({
  courseId,
  controller,
}: JourneyMapFlashListProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const {
    activeGlobalIndex,
    activeNodeInitialScrollIndex,
    bottomSpacerHeight,
    courseTitle,
    flashListData,
    handleListLoad,
    handleNodePress,
    handleOpenSections,
    handleScrollHintPress,
    handleSelectSection,
    handleViewableItemsChanged,
    headerState,
    isLoaded,
    isSectionSheetOpen,
    legendListRef,
    listKey,
    scrollHint,
    sectionOverviewItems,
    setIsSectionSheetOpen,
  } = controller;

  const renderItem = useCallback(
    ({ item }: { item: JourneyFlashListItem }): React.JSX.Element => {
      return (
        <JourneyMapListItem
          item={item}
          courseId={courseId}
          activeGlobalIndex={activeGlobalIndex}
          onNodePress={handleNodePress}
        />
      );
    },
    [activeGlobalIndex, handleNodePress],
  );

  const listFooterComponent = useMemo(
    () => <JourneyMapListFooter height={bottomSpacerHeight} />,
    [bottomSpacerHeight],
  );

  return (
    <>
      {!isLoaded ? (
        <JourneyMapLoadingState />
      ) : flashListData.length > 0 ? (
        <AnimatedLegendList<JourneyFlashListItem>
          style={{ flex: 1 }}
          key={listKey}
          ref={legendListRef}
          data={flashListData}
          renderItem={renderItem}
          keyExtractor={getJourneyMapItemKey}
          getItemType={getJourneyMapItemType}
          estimatedItemSize={ESTIMATED_ITEM_SIZE}
          initialScrollIndex={activeNodeInitialScrollIndex}
          waitForInitialLayout
          onLoad={handleListLoad}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          ListFooterComponent={listFooterComponent}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={JOURNEY_VIEWABILITY_CONFIG}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ paddingTop: insets.top + 100 }}
        />
      ) : (
        <JourneyMapEmptyState />
      )}

      <ScrollToActiveButton
        isVisible={scrollHint.isVisible}
        direction={scrollHint.direction}
        mode={scrollHint.mode}
        onPress={handleScrollHintPress}
      />

      {isSectionSheetOpen ? (
        <BottomSheetWithRNContent
          isPresented={isSectionSheetOpen}
          setIsPresented={setIsSectionSheetOpen}
        >
          <SectionOverviewSheet
            sections={sectionOverviewItems}
            onPreviewSection={handleSelectSection}
            onClose={() => setIsSectionSheetOpen(false)}
            journeyTitle={courseTitle}
          />
        </BottomSheetWithRNContent>
      ) : null}
    </>
  );
}

export const JourneyMapFlashList = React.memo(JourneyMapFlashListInner);
export default JourneyMapFlashList;
