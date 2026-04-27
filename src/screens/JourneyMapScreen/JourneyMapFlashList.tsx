/**
 * JourneyMapFlashList
 * FlashList-based presentation component for the segment-per-cell architecture.
 *
 * Replaces MultiUnitPresentation for the scrollable content area.
 * Each cell owns its own SVG path segment — no single giant SVG.
 *
 * Features:
 * - LegendList (Animated) with overrideItemLayout for variable cell heights
 * - Heterogeneous items: nodes, dividers, mascot bubbles
 * - StickyUnitHeader preserved from existing code
 * - HomeMainButton header + BottomSheetWithRNContent section picker
 * - NodeCompleteModal for the "Done" CTA
 *
 * Architecture:
 *  - Presentational rendering: DividerCell, MascotCell, renderItem
 *  - Container logic: useJourneyNodeDone (completion), useVisibleUnit (header)
 *  - State: selectedNode, isPresented, pendingFocusNodeId
 */

import React, { useCallback, useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import { Text as RNText } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated from "react-native-reanimated";
import { LegendList } from "@legendapp/list";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type {
  JourneyFlashListItem,
  JourneyNode,
  JourneyDividerItem,
  JourneyMascotItem,
  PathNodeData,
} from "@/src/types/journey";
import { MascotSide, NodeStatus } from "@/src/types/journey";

import { useHighContrast } from "@/src/hooks/useHighContrast";
import { useJourneyDerivedState } from "@/src/hooks/journeyMap";
import { useVisibleUnit } from "@/src/hooks/useVisibleUnit";
import { useJourneyNodeDone } from "@/src/hooks/journeyMap/useJourneyNodeDone";
import { useJourneyAutoScroll } from "@/src/hooks/journeyMap/useJourneyAutoScroll";
import { useAppSelector, useAppDispatch } from "@/src/store/hooks";
import { fetchSectionUnits } from "@/src/store/api/sectionMapApi";
import { setCurrentSectionNumber } from "@/src/store/slices/enrolledCoursesSlice";
import {
  selectActiveCourse,
  selectCurrentSectionNumber,
  selectSectionList,
} from "@/src/store/selectors/enrolledCoursesSelectors";

import { JourneyNodeCell } from "@/src/components/journey/JourneyNodeCell";
import { UnitDivider, MascotBubble, ScrollToActiveButton } from "@/src/components/journey";
import { SectionList } from "@/src/components/journey/SectionList";
import { MASCOT_SIZE, UNIT_GRADIENTS } from "@/src/data/journey/constants";
import { HomeMainButton } from "@/src/components/journey/home-main-button";
import BottomSheetWithRNContent from "@/src/components/BottomSheetWithRNContent";
import { NodeCompleteModal } from "./NodeCompleteModal";
import { DividerCell } from "@/src/components/journey/DividerCell";
import { MascotCell } from "@/src/components/journey/MascotCell";

// ---------------------------------------------------------------------------
// Module-level constants
// ---------------------------------------------------------------------------

const AnimatedLegendList = Animated.createAnimatedComponent(
  LegendList,
) as typeof LegendList;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/** Average cell height hint for LegendList's internal estimation */
const ESTIMATED_ITEM_SIZE: number = 120;

/** Bottom inset so the final node can scroll above the tab bar */
const LIST_BOTTOM_PADDING: number = 180;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface JourneyMapFlashListProps {
  /** Journey slug for section switching */
  slugOverride?: string;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function JourneyMapFlashListInner({
  slugOverride,
}: JourneyMapFlashListProps): React.JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const legendListRef = useRef<any>(null);
  const dispatch = useAppDispatch();
  const toast = useToast();

  // ── Selectors ──────────────────────────────────────────────────────────────
  const activeCourse = useAppSelector(selectActiveCourse);
  const currentSectionNumber = useAppSelector(selectCurrentSectionNumber);
  const sectionList = useAppSelector(selectSectionList);
  const isSectionLoading = useAppSelector(
    (state) => state.sectionMap.isLoading,
  );
  const sectionError = useAppSelector((state) => state.sectionMap.error);

  // ── UI state ───────────────────────────────────────────────────────────────
  const [isPresented, setIsPresented] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<PathNodeData | null>(null);
  const [pendingFocusNodeId, setPendingFocusNodeId] = useState<string | null>(
    null,
  );

  // ── Derived journey data ───────────────────────────────────────────────────
  const { flashListData, activeGlobalIndex, units } = useJourneyDerivedState();
  const { visibleUnit, onViewableItemsChanged } = useVisibleUnit({ units });

  // ── Auto-scroll to the next node after a completion and track visibility ──
  const {
    isActiveOffScreen,
    scrollDirection,
    handleFlashListScrollToActive,
    onViewableItemsChangedWrapper,
  } = useJourneyAutoScroll({
    flashListData,
    pendingFocusNodeId,
    setPendingFocusNodeId,
    legendListRef,
    onVisibleUnitChanged: onViewableItemsChanged,
  });
  React.useEffect(() => {
    if (!slugOverride) return;
    void dispatch(
      fetchSectionUnits({
        slug: slugOverride,
        sectionNumber: currentSectionNumber,
      }),
    );
  }, [currentSectionNumber, dispatch, slugOverride]);



  // ── Completion logic (extracted to hook) ──────────────────────────────────
  const { isCompletingNode, handleDonePress } = useJourneyNodeDone({
    slugOverride,
    activeCourse,
    selectedNode,
    onSuccess: useCallback((nextNodeId: string | null): void => {
      setSelectedNode(null);
      setPendingFocusNodeId(nextNodeId);
    }, []),
  });

  // ── Node press — show modal for active nodes, toast for others ────────────
  const handleNodePress = useCallback(
    (node: PathNodeData): void => {
      if (node.status !== NodeStatus.ACTIVE) {
        toast.show({
          id: `node-state-${node.id}`,
          placement: "bottom",
          render: () => (
            <Toast action="warning">
              <ToastTitle>
                {node.status === NodeStatus.COMPLETED
                  ? "This node is already completed."
                  : "This node is locked."}
              </ToastTitle>
            </Toast>
          ),
        });
        return;
      }
      setSelectedNode(node);
    },
    [toast],
  );

  // ── renderItem — dispatches to the correct cell type ─────────────────────
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

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Sticky header — shows current section + unit info */}
      <HomeMainButton
        onPress={() => setIsPresented(true)}
        unitLabel={`Section ${currentSectionNumber ?? 1}, Unit ${visibleUnit.unitNumber}`}
        unitTitle={visibleUnit.unitTitle}
        faceColor={UNIT_GRADIENTS[visibleUnit.colorThemeKey]?.[0] || "#4CAF50"}
        rimColor={UNIT_GRADIENTS[visibleUnit.colorThemeKey]?.[1] || "#388E3C"}
      />

      {/* Scrollable list */}
      {isSectionLoading ? (
        <View className="flex-1 items-center justify-center">
          <RNText className="text-gray-500">Loading section...</RNText>
        </View>
      ) : flashListData && flashListData.length > 0 ? (
        <AnimatedLegendList<JourneyFlashListItem>
          ref={legendListRef}
          data={flashListData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={ESTIMATED_ITEM_SIZE}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: LIST_BOTTOM_PADDING }}
          onViewableItemsChanged={onViewableItemsChangedWrapper}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 10,
            minimumViewTime: 100,
          }}
        />
      ) : (
        <View className="flex-1 items-center justify-center p-4">
          <RNText className="text-gray-500 text-center">
            {sectionError ? "Failed to load section" : "No data available"}
          </RNText>
        </View>
      )}

      {/* Scroll-to-active button (shown when active node is off-screen) */}
      {isActiveOffScreen && (
            <ScrollToActiveButton
              direction={scrollDirection}
              onPress={handleFlashListScrollToActive}
              isVisible={isActiveOffScreen}
            />
          )}

      <BottomSheetWithRNContent
        isPresented={isPresented}
        setIsPresented={setIsPresented}
      >
        <SectionList
          sectionList={sectionList}
          currentSectionNumber={currentSectionNumber}
          onSectionPress={(unitNumber) => {
            setIsPresented(false);
            dispatch(setCurrentSectionNumber(unitNumber));
          }}
        />
      </BottomSheetWithRNContent>

      <NodeCompleteModal
        visible={selectedNode !== null}
        isCompletingNode={isCompletingNode}
        onClose={() => {
          if (!isCompletingNode) setSelectedNode(null);
        }}
        onDone={() => void handleDonePress()}
      />
    </>
  );
}

export const JourneyMapFlashList = React.memo(JourneyMapFlashListInner);

export default JourneyMapFlashList;
