/**
 * JourneyMapFlashList
 * FlashList-based presentation component for the segment-per-cell architecture.
 *
 * Replaces MultiUnitPresentation for the scrollable content area.
 * Each cell owns its own SVG path segment — no single giant SVG.
 *
 * Features:
 * - FlashList with overrideItemLayout for variable cell heights
 * - Heterogeneous items: nodes, dividers, mascot bubbles
 * - StickyUnitHeader preserved from existing code
 * - OfflineBanner + ScrollToActiveButton
 * - getItemType for cell recycling optimization
 *
 * Pure presentational — all data via props.
 */

import React, { useCallback, useRef, useState } from "react";
import {
  View,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  useWindowDimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useHighContrast } from "@/src/hooks/useHighContrast";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  runOnJS,
} from "react-native-reanimated";
import { LegendList } from "@legendapp/list";
import type { ViewToken } from "react-native";
import { Pressable, Text as RNText } from "react-native";

const AnimatedLegendList = Animated.createAnimatedComponent(
  LegendList,
) as typeof LegendList;

import type {
  JourneyFlashListItem,
  JourneyNode,
  JourneyDividerItem,
  JourneyMascotItem,
  JourneyStats,
  PathNodeData,
  JourneyState,
  UnitData,
  JourneyConfig,
  UnitConfig,
} from "@/src/types/journey";
import { MascotSide } from "@/src/types/journey";
import { useSectionSwitch } from "@/src/hooks/useSectionSwitch";
import {
  useJourneyDerivedState,
  useJourneyScroll,
} from "@/src/hooks/journeyMap";
import { useVisibleUnit } from "@/src/hooks/useVisibleUnit";
import { useScrollHandler } from "@/src/hooks/useScrollHandler";
import { useGetSectionMapQuery } from "@/src/store/api/sectionMapApi";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  setSectionMap,
  setCurrentSectionNumber,
} from "@/src/store/slices/sectionMapSlice";
import { setJourneyState } from "@/src/store/slices/journeySlice";
import { sectionMapToJourneyState } from "@/src/utils/journey/sectionMapBridge";

import { JourneyNodeCell } from "@/src/components/journey/JourneyNodeCell";
import {
  ScrollToActiveButton,
  UnitDivider,
  MascotBubble,
} from "@/src/components/journey";
import { DuolingoHeader } from "@/src/components/journey/DuolingoHeader";
import { SectionList } from "@/src/components/journey/SectionList";
import type { UnitHeaderData } from "@/src/hooks/useJourneyFlashList";
import { MASCOT_SIZE, UNIT_GRADIENTS } from "@/src/data/journey/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeMainButton } from "@/src/components/journey/home-main-button";
import BasicBottomSheetExample from "@/src/components/BasicBottomSheetExample";
import BottomSheetWithRNContent from "@/src/components/BottomSheetWithRNContent";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Average cell height hint for FlashList's internal estimation */
const ESTIMATED_ITEM_SIZE: number = 120;

/** Extra pixels above/below viewport to pre-render for smooth scrolling */
const DRAW_DISTANCE: number = 600;

/** Bottom inset so the final node can scroll above the tab bar */
const LIST_BOTTOM_PADDING: number = 180;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface JourneyMapFlashListProps {
  /** Dependencies for derived state computation */
  journeyState?: JourneyState;
  config: JourneyConfig;
  unitConfigMap: Map<string, UnitConfig>;
  /** Journey slug for section switching */
  slugOverride?: string;
}

// ---------------------------------------------------------------------------
// Type guards
// ---------------------------------------------------------------------------

function isJourneyNode(item: JourneyFlashListItem): item is JourneyNode {
  return item.itemType === "node";
}

function isJourneyDivider(
  item: JourneyFlashListItem,
): item is JourneyDividerItem {
  return item.itemType === "divider";
}

// ---------------------------------------------------------------------------
// Sub-components for heterogeneous cell types
// ---------------------------------------------------------------------------

interface DividerCellProps {
  item: JourneyDividerItem;
  screenWidth: number;
  activeGlobalIndex: number;
}

function DividerCell({
  item,
  screenWidth,
  activeGlobalIndex,
}: DividerCellProps): React.JSX.Element {
  const { pathColors, pathStrokeWidth } = useHighContrast();

  // Mirror JourneyNodeCell logic: the divider's path is "progress-colored" if the
  // last node before this divider is completed or active.
  const isProgressSegment: boolean =
    item.prevNodeGlobalIndex !== undefined &&
    activeGlobalIndex >= 0 &&
    item.prevNodeGlobalIndex <= activeGlobalIndex;
  const segmentColor: string = isProgressSegment
    ? pathColors.active
    : pathColors.inactive;

  return (
    <View style={{ height: item.cellHeight }}>
      {/* Path segment running straight through the divider */}
      {item.segmentD ? (
        <Svg
          width={screenWidth}
          height={item.cellHeight}
          style={{ position: "absolute", top: 0, left: 0 }}
          pointerEvents="none"
        >
          <Path
            d={item.segmentD}
            stroke={segmentColor}
            strokeWidth={pathStrokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ) : null}
      <UnitDivider title={item.title} />
    </View>
  );
}

interface MascotCellProps {
  item: JourneyMascotItem;
}

function MascotCell({ item }: MascotCellProps): React.JSX.Element {
  // If cell height is 0 (so it doesn't break path logic), use verticalOffset so it sits below the previous node
  const calculatedY =
    item.cellHeight > 0 ? item.cellHeight / 2 : MASCOT_SIZE.verticalOffset;
  return (
    <View
      style={{
        height: item.cellHeight,
        backgroundColor: "transparent",
        overflow: "visible",
      }}
    >
      <MascotBubble
        x={item.x}
        y={calculatedY}
        side={item.side as MascotSide}
        initialMessage={item.message}
        imageKey={item.imageKey}
        avatarSize={item.avatarSize}
        offsetY={item.offsetY}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function JourneyMapFlashListInner({
  journeyState,
  config,
  unitConfigMap,
  slugOverride,
}: JourneyMapFlashListProps): React.JSX.Element {
  const { width: viewportWidth, height: viewportHeight } =
    useWindowDimensions();
  const internalRef = useRef<any>(null);
  const legendListRef = internalRef;
  const [isPresented, setIsPresented] = useState(false);

  const dispatch = useAppDispatch();
  const currentSectionNumber = useAppSelector(
    (state) => state.sectionMap.currentSectionNumber,
  );
  const handleSectionSwitch = useSectionSwitch();

  // Use RTK Query for section map data
  const {
    data: sectionMapData,
    isLoading: isSectionMapLoading,
    error: sectionMapError,
  } = useGetSectionMapQuery(
    { slug: slugOverride || "", unitNumber: currentSectionNumber ?? undefined },
    { skip: !slugOverride },
  );

  // Sync RTK Query data to Redux store
  React.useEffect(() => {
    if (sectionMapData) {
      dispatch(setSectionMap(sectionMapData));
      dispatch(setCurrentSectionNumber(sectionMapData.section.unitNumber));
      const bridgedState = sectionMapToJourneyState(sectionMapData, {
        streakDays: 0,
        wallet: { coins: 0, gems: 0 },
        hearts: 5,
        totalXP: 0,
      });
      dispatch(setJourneyState(bridgedState));
    }
  }, [sectionMapData, dispatch]);

  const {
    flashListData,
    flashActiveNodeIndex,
    activeGlobalIndex,
    flashScreenWidth,
    flashActiveNodeY,
    unitHeaders,
  } = useJourneyDerivedState(
    sectionMapData,
    journeyState,
    config,
    unitConfigMap,
  );

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
    USE_FLASH_LIST: true,
  });

  const { scrollY, scrollHandler } = useScrollHandler({ updateVisibility });

  const { visibleUnit, onViewableItemsChanged } = useVisibleUnit({
    unitHeaders,
  });

  // ── renderItem — dispatches to the correct cell type ──
  const renderItem = useCallback(
    ({ item }: { item: JourneyFlashListItem }): React.JSX.Element => {
      switch (item.itemType) {
        case "node":
          return (
            <JourneyNodeCell
              item={item as JourneyNode}
              screenWidth={flashScreenWidth}
              activeGlobalIndex={activeGlobalIndex}
              onNodePress={() => {}}
            />
          );

        case "divider":
          return (
            <DividerCell
              item={item as JourneyDividerItem}
              screenWidth={flashScreenWidth}
              activeGlobalIndex={activeGlobalIndex}
            />
          );

        case "mascot":
          return <MascotCell item={item as JourneyMascotItem} />;

        default:
          return <View />;
      }
    },
    [flashScreenWidth, activeGlobalIndex],
  );

  // ── keyExtractor — stable unique ID per item ──
  const keyExtractor = useCallback(
    (item: JourneyFlashListItem): string => item.id,
    [],
  );

  // Derive section list from sectionMapData
  const sectionList = sectionMapData?.sectionList || [];

  return (
    <>
      {isSectionMapLoading && <View className="flex-1 bg-gray-50" />}
      {!isSectionMapLoading && (sectionMapError || !sectionMapData) && (
        <View className="flex-1 bg-gray-50" />
      )}

      {!isSectionMapLoading && !sectionMapError && sectionMapData && (
        <>
          <HomeMainButton
            onPress={() => setIsPresented(true)}
            unitLabel={`Unit ${visibleUnit.unitNumber}`}
            sectionTitle={visibleUnit.unitTitle}
            faceColor={
              UNIT_GRADIENTS[visibleUnit.colorThemeKey]?.[0] || "#4CAF50"
            }
            rimColor={
              UNIT_GRADIENTS[visibleUnit.colorThemeKey]?.[1] || "#388E3C"
            }
          />

          {/* LegendList — cell recycling with segment-per-cell SVG rendering */}
          <AnimatedLegendList<JourneyFlashListItem>
            data={flashListData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            estimatedItemSize={ESTIMATED_ITEM_SIZE}
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            ref={legendListRef as any}
            contentContainerStyle={{ paddingBottom: LIST_BOTTOM_PADDING }}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 10,
              minimumViewTime: 100,
            }}
          />

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
                handleSectionSwitch(unitNumber);
              }}
            />
          </BottomSheetWithRNContent>
        </>
      )}
    </>
  );
}

export const JourneyMapFlashList = React.memo(JourneyMapFlashListInner);

export default JourneyMapFlashList;
