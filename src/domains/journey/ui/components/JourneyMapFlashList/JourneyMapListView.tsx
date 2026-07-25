import React from "react";
import Animated from "react-native-reanimated";
import { LegendList } from "@legendapp/list";

import type { JourneyFlashListItem } from "@/src/types/journey";
import BottomSheetWithRNContent from "@/src/components/BottomSheetWithRNContent";
import { SectionOverviewSheet } from "../SectionOverviewSheet";
import ScrollToActiveButton from "../ScrollToActiveButton";
import { JourneyMapEmptyState, JourneyMapLoadingState } from "../JourneyMapListItems";
import type { JourneyMapListViewModel, JourneyMapListActions } from "../../hooks/useJourneyMapListViewModel";



export interface JourneyMapListViewProps {
  model: JourneyMapListViewModel;
  actions: JourneyMapListActions;
}

/**
 * Presentational component for the Journey Map Flash List.
 * Purely renders the animated LegendList, scroll buttons, and sheets.
 * Does not contain any business logic or view calculation.
 */
export const JourneyMapListView = React.memo(function JourneyMapListView({
  model,
  actions,
}: JourneyMapListViewProps): React.JSX.Element {
  const {
    isLoaded,
    flashListData,
    listKey,
    legendListRef,
    renderItem,
    getJourneyMapItemKey,
    getJourneyMapItemType,
    estimatedItemSize,
    activeNodeInitialScrollIndex,
    listFooterComponent,
    viewabilityConfig,
    contentContainerStyle,
    scrollHint,
    isSectionSheetOpen,
    sectionOverviewItems,
    courseTitle,
  } = model;

  const {
    handleListLoad,
    handleViewableItemsChanged,
    handleScrollHintPress,
    setIsSectionSheetOpen,
    handleSelectSection,
  } = actions;

  return (
    <>
      {!isLoaded ? (
        <JourneyMapLoadingState />
      ) : flashListData.length > 0 ? (
        <LegendList<JourneyFlashListItem>
          style={{ flex: 1 }}
          key={listKey}
          ref={legendListRef}
          data={flashListData}
          renderItem={renderItem}
          keyExtractor={getJourneyMapItemKey}
          getItemType={getJourneyMapItemType}
          estimatedItemSize={estimatedItemSize}
          initialScrollIndex={activeNodeInitialScrollIndex}
          waitForInitialLayout
          onLoad={handleListLoad}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          ListFooterComponent={listFooterComponent}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={contentContainerStyle}
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
    </>
  );
});

export default JourneyMapListView;
