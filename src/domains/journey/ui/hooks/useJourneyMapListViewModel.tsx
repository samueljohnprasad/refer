import React, { useCallback, useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { JourneyFlashListItem } from "@/src/types/journey";
import {
  JourneyMapListFooter,
  JourneyMapListItem,
  ESTIMATED_ITEM_SIZE,
  JOURNEY_VIEWABILITY_CONFIG,
  getJourneyMapItemKey,
  getJourneyMapItemType,
} from "../components/JourneyMapListItems";
import type { useJourneyMapController } from "./useJourneyMapController";

export interface JourneyMapListViewModel {
  courseId: string;
  isLoaded: boolean;
  flashListData: JourneyFlashListItem[];
  listKey: string;
  activeNodeInitialScrollIndex: ReturnType<typeof useJourneyMapController>["activeNodeInitialScrollIndex"];
  contentContainerStyle: { paddingTop: number };
  estimatedItemSize: number;
  viewabilityConfig: typeof JOURNEY_VIEWABILITY_CONFIG;
  getJourneyMapItemKey: typeof getJourneyMapItemKey;
  getJourneyMapItemType: typeof getJourneyMapItemType;
  renderItem: ({ item }: { item: JourneyFlashListItem }) => React.JSX.Element;
  listFooterComponent: React.JSX.Element;
  scrollHint: ReturnType<typeof useJourneyMapController>["scrollHint"];
  isSectionSheetOpen: boolean;
  sectionOverviewItems: ReturnType<typeof useJourneyMapController>["sectionOverviewItems"];
  courseTitle: string;
  legendListRef: ReturnType<typeof useJourneyMapController>["legendListRef"];
}

export interface JourneyMapListActions {
  handleListLoad: () => void;
  handleViewableItemsChanged: ReturnType<typeof useJourneyMapController>["handleViewableItemsChanged"];
  handleScrollHintPress: () => void;
  setIsSectionSheetOpen: ReturnType<typeof useJourneyMapController>["setIsSectionSheetOpen"];
  handleSelectSection: (sectionId: string) => void;
}

export function useJourneyMapListViewModel({
  courseId,
  controller,
}: {
  courseId: string;
  controller: ReturnType<typeof useJourneyMapController>;
}): {
  model: JourneyMapListViewModel;
  actions: JourneyMapListActions;
} {
  const insets = useSafeAreaInsets();
  const {
    activeGlobalIndex,
    activeNodeInitialScrollIndex,
    bottomSpacerHeight,
    courseTitle,
    flashListData,
    handleListLoad,
    handleNodePress,
    handleScrollHintPress,
    handleSelectSection,
    handleViewableItemsChanged,
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
    [activeGlobalIndex, courseId, handleNodePress],
  );

  const listFooterComponent = useMemo(
    () => <JourneyMapListFooter height={bottomSpacerHeight} />,
    [bottomSpacerHeight],
  );

  const model: JourneyMapListViewModel = {
    courseId,
    isLoaded,
    flashListData,
    listKey,
    activeNodeInitialScrollIndex,
    contentContainerStyle: { paddingTop: insets.top + 100 },
    estimatedItemSize: ESTIMATED_ITEM_SIZE,
    viewabilityConfig: JOURNEY_VIEWABILITY_CONFIG,
    getJourneyMapItemKey,
    getJourneyMapItemType,
    renderItem,
    listFooterComponent,
    scrollHint,
    isSectionSheetOpen,
    sectionOverviewItems,
    courseTitle,
    legendListRef,
  };

  const actions: JourneyMapListActions = {
    handleListLoad,
    handleViewableItemsChanged,
    handleScrollHintPress,
    setIsSectionSheetOpen,
    handleSelectSection,
  };

  return { model, actions };
}
