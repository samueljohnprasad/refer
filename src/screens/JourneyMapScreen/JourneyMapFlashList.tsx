import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, View, Text } from "react-native";
import Animated from "react-native-reanimated";
import {
  LegendList,
  type LegendListRef,
  type ViewToken,
} from "@legendapp/list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";

import type {
  JourneyFlashListItem,
  JourneyNode,
  JourneyDividerItem,
  PathNodeData,
} from "@/src/types/journey";

import { useVisibleUnit } from "@/src/hooks/useVisibleUnit";
import { useAppSelector, useAppDispatch } from "@/src/store/hooks";
import {
  setActiveNodeModal,
  setPreviewSection,
} from "@/src/features/journey/journeySlice";
import {
  selectCourse,
  selectCurrentSectionIdForCourse,
  selectIsCourseLoaded,
  selectPreviewSectionForCourse,
  selectPreviewSectionIdForCourse,
  selectRenderedJourneyViewForCourse,
  selectRenderedSectionIdForCourse,
  selectSectionOverviewItemsForCourse,
} from "@/src/features/journey/journeySelectors";

import { JourneyNodeCell } from "@/src/components/journey/JourneyNodeCell";
import { DividerCell } from "@/src/components/journey/DividerCell";
import { UNIT_GRADIENTS } from "@/src/data/journey/constants";
import BottomSheetWithRNContent from "@/src/components/BottomSheetWithRNContent";
import { HomeMainButton } from "@/src/components/journey/home-main-button";
import { SectionOverviewSheet } from "@/src/components/journey/SectionOverviewSheet";
import ScrollToActiveButton from "@/src/components/journey/ScrollToActiveButton";
import { NodeContentModal } from "./NodeContentModal";
import { useCurrentNodeScrollHint } from "@/hooks/journey/useCurrentNodeScrollHint";
import { useJourneyFlashListData } from "@/hooks/journey/useJourneyFlashListData";

const AnimatedLegendList = Animated.createAnimatedComponent(
  LegendList,
) as typeof LegendList;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ESTIMATED_ITEM_SIZE = 120;
const LIST_BOTTOM_SPACER_HEIGHT = 132;
const DEFAULT_UNIT_GRADIENT = ["#4CAF50", "#388E3C"] as const;

export interface JourneyMapFlashListProps {
  courseId: string;
}

function JourneyMapFlashListInner({
  courseId,
}: JourneyMapFlashListProps): React.JSX.Element {
  const legendListRef = useRef<LegendListRef | null>(null);
  const [isSectionSheetOpen, setIsSectionSheetOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const currentSectionId = useAppSelector((state) =>
    selectCurrentSectionIdForCourse(state, courseId),
  );
  const previewSectionId = useAppSelector((state) =>
    selectPreviewSectionIdForCourse(state, courseId),
  );
  const previewSection = useAppSelector((state) =>
    selectPreviewSectionForCourse(state, courseId),
  );
  const renderedSectionId = useAppSelector((state) =>
    selectRenderedSectionIdForCourse(state, courseId),
  );
  const listKey = renderedSectionId ?? courseId;
  const { flashListData, activeGlobalIndex, activeListIndex, units } =
    useJourneyFlashListData(courseId, renderedSectionId ?? undefined);
  const { visibleUnitId, onViewableItemsChanged } = useVisibleUnit({ units });
  const { renderedSection, renderedUnit } = useAppSelector((state) =>
    selectRenderedJourneyViewForCourse(state, courseId, visibleUnitId),
  );
  const course = useAppSelector((state) => selectCourse(state, courseId));
  const isLoaded = useAppSelector((state) =>
    selectIsCourseLoaded(state, courseId),
  );
  const sectionOverviewItems = useAppSelector((state) =>
    selectSectionOverviewItemsForCourse(state, courseId),
  );

  const canOpenSections = sectionOverviewItems.length > 0;
  const isViewingPreviewSection = previewSection !== null;

  useEffect(() => {
    if (previewSectionId === null || previewSection !== null) {
      return;
    }

    dispatch(setPreviewSection({ courseId, sectionId: null }));
  }, [courseId, dispatch, previewSection, previewSectionId]);

  const handleFocusCurrentProgress = useCallback((): void => {
    dispatch(setPreviewSection({ courseId, sectionId: null }));
  }, [courseId, dispatch]);

  const {
    activeNodeInitialScrollIndex,
    scrollHint: activeScrollHint,
    handleListLoad,
    handleScrollHintPress,
    updateScrollHintFromViewableItems,
  } = useCurrentNodeScrollHint({
    activeListIndex,
    isCourseLoaded: isLoaded,
    isViewingPreviewSection,
    listKey,
    listRef: legendListRef,
    onFocusCurrentProgress: handleFocusCurrentProgress,
  });

  const handleViewableItemsChanged = useCallback(
    (info: { viewableItems: ViewToken<JourneyFlashListItem>[] }) => {
      onViewableItemsChanged(info);
      updateScrollHintFromViewableItems(info.viewableItems);
    },
    [onViewableItemsChanged, updateScrollHintFromViewableItems],
  );

  const handleNodePress = useCallback(
    (node: PathNodeData): void => {
      if (node.status === "locked") {
        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toast nativeID={id} action="warning">
              <ToastTitle>Complete earlier activities first.</ToastTitle>
            </Toast>
          ),
        });
        return;
      }
      dispatch(setActiveNodeModal({ courseId, nodeId: node.id }));
    },
    [courseId, dispatch, toast],
  );

  const handleOpenSections = useCallback((): void => {
    if (!canOpenSections) return;
    setIsSectionSheetOpen(true);
  }, [canOpenSections]);

  const handleCloseSections = useCallback((): void => {
    setIsSectionSheetOpen(false);
  }, []);

  const handleSelectSection = useCallback(
    (sectionId: string): void => {
      if (!sectionId || sectionId === currentSectionId) {
        dispatch(setPreviewSection({ courseId, sectionId: null }));
        return;
      }

      dispatch(setPreviewSection({ courseId, sectionId }));
    },
    [courseId, currentSectionId, dispatch],
  );

  const renderItem = useCallback(
    ({ item }: { item: JourneyFlashListItem }): React.JSX.Element => {
      switch (item.itemType) {
        case "node":
          return (
            <JourneyNodeCell
              item={item as JourneyNode}
              screenWidth={SCREEN_WIDTH}
              activeGlobalIndex={activeGlobalIndex}
              onNodePress={handleNodePress}
            />
          );
        case "divider":
          return (
            <DividerCell
              item={item as JourneyDividerItem}
              screenWidth={SCREEN_WIDTH}
              activeGlobalIndex={activeGlobalIndex}
            />
          );
        default:
          return <View />;
      }
    },
    [activeGlobalIndex, handleNodePress],
  );

  const keyExtractor = useCallback(
    (item: JourneyFlashListItem): string => item.id,
    [],
  );

  const [headerFaceColor, headerRimColor] =
    UNIT_GRADIENTS[renderedUnit?.colorThemeKey ?? "green"] ??
    DEFAULT_UNIT_GRADIENT;
  const headerUnitLabel = renderedSection
    ? `Section ${renderedSection.orderIndex}${
        renderedUnit ? ` • Unit ${renderedUnit.unitNumber}` : ""
      }`
    : "Journey";
  const headerUnitTitle = renderedUnit?.title ?? "Select a section";
  const bottomSpacerHeight = LIST_BOTTOM_SPACER_HEIGHT + insets.bottom;

  return (
    <>
      <HomeMainButton
        onPress={handleOpenSections}
        unitLabel={headerUnitLabel}
        unitTitle={headerUnitTitle}
        faceColor={headerFaceColor}
        rimColor={headerRimColor}
        unitIconKey={renderedUnit?.iconKey ?? null}
      />

      {!isLoaded ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: "#6B7280" }}>Loading…</Text>
        </View>
      ) : flashListData.length > 0 ? (
        <AnimatedLegendList<JourneyFlashListItem>
          key={listKey}
          ref={legendListRef}
          data={flashListData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={ESTIMATED_ITEM_SIZE}
          initialScrollIndex={activeNodeInitialScrollIndex}
          waitForInitialLayout
          onLoad={handleListLoad}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          ListFooterComponent={
            <View pointerEvents="none" style={{ height: bottomSpacerHeight }} />
          }
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 10,
            minimumViewTime: 100,
          }}
        />
      ) : (
        <View>
          <Text>This course is being prepared. Check back shortly.</Text>
        </View>
      )}

      <ScrollToActiveButton
        isVisible={activeScrollHint.isVisible}
        direction={activeScrollHint.direction}
        mode={activeScrollHint.mode}
        onPress={handleScrollHintPress}
      />

      {isSectionSheetOpen ? (
        <BottomSheetWithRNContent
          isPresented={isSectionSheetOpen}
          setIsPresented={setIsSectionSheetOpen}
        >
          <SectionOverviewSheet
            onClose={handleCloseSections}
            sections={sectionOverviewItems}
            onPreviewSection={handleSelectSection}
            journeyTitle={course?.title ?? "Journey"}
          />
        </BottomSheetWithRNContent>
      ) : null}

      <NodeContentModal courseId={courseId} />
    </>
  );
}

export const JourneyMapFlashList = React.memo(JourneyMapFlashListInner);
export default JourneyMapFlashList;
