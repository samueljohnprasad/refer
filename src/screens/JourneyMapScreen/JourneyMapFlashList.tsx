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

import React, { useCallback, useRef } from "react";
import {
  View,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useHighContrast } from "@/src/hooks/useHighContrast";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  runOnJS,
} from "react-native-reanimated";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import type { ViewToken } from "react-native";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

import type {
  JourneyFlashListItem,
  JourneyNode,
  JourneyDividerItem,
  JourneyMascotItem,
  JourneyStats,
  PathNodeData,
} from "@/src/types/journey";
import { MascotSide } from "@/src/types/journey";

import { JourneyNodeCell } from "@/src/components/journey/JourneyNodeCell";
import {
  OfflineBanner,
  ScrollToActiveButton,
  UnitDivider,
  MascotBubble,
  StickyUnitHeader,
} from "@/src/components/journey";
import { DuolingoHeader } from "@/src/components/journey/DuolingoHeader";
import type { UnitHeaderData } from "@/src/hooks/useJourneyFlashList";
import { MASCOT_SIZE, UNIT_GRADIENTS } from "@/src/data/journey/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeMainButton } from "@/src/components/journey/home-main-button";

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
  /** Pre-computed flat data array */
  data: JourneyFlashListItem[];
  /** User stats for sticky header */
  stats: JourneyStats;
  /** Screen width */
  screenWidth: number;
  /** Index of the active node in the flat list */
  activeGlobalIndex: number;
  /** Node press handler */
  onNodePress: (node: PathNodeData) => void;
  /** Whether device is offline */
  isOffline: boolean;
  /** Whether the active node is off-screen */
  isActiveOffScreen: boolean;
  /** Direction to scroll to reach active node */
  scrollDirection: "up" | "down";
  /** Scroll-to-active callback */
  onScrollToActive: () => void;
  /** Jump-to-unit handler for dividers */
  onJumpToUnit?: (unitId: string) => void;
  /** FlashList ref for external scroll control */
  listRef?: React.RefObject<FlashListRef<JourneyFlashListItem>>;
  /** Scroll event handler for tracking scroll visibility */
  onScroll?: (y: number) => void;
  /** Unit headers data */
  unitHeaders: UnitHeaderData[];
  /** Guide-book handler */
  onGuidePress?: () => void;
  /** Flag icon handler (opens journey switcher) */
  onFlagPress?: () => void;
}

// ---------------------------------------------------------------------------
// Sub-components for heterogeneous cell types
// ---------------------------------------------------------------------------

interface DividerCellProps {
  item: JourneyDividerItem;
  screenWidth: number;
  activeGlobalIndex: number;
  onJumpToUnit?: (unitId: string) => void;
}

function DividerCell({
  item,
  screenWidth,
  activeGlobalIndex,
  onJumpToUnit,
}: DividerCellProps): React.JSX.Element {
  const { pathColors, pathStrokeWidth } = useHighContrast();
  const handleJump = useCallback((): void => {
    onJumpToUnit?.(item.targetUnitId);
  }, [onJumpToUnit, item.targetUnitId]);

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
      <UnitDivider
        title={item.title}
        showJumpHere={item.showJumpHere}
        accentColor={item.accentColor ?? "#58CC02"}
        onJumpPress={item.showJumpHere ? handleJump : undefined}
      />
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

function JourneyMapFlashListInner({
  data,
  stats,
  screenWidth,
  activeGlobalIndex,
  onNodePress,
  isOffline,
  isActiveOffScreen,
  scrollDirection,
  onScrollToActive,
  onJumpToUnit,
  listRef,
  onScroll,
  unitHeaders,
  onGuidePress,
  onFlagPress,
}: JourneyMapFlashListProps): React.JSX.Element {
  const internalRef = useRef<FlashListRef<JourneyFlashListItem>>(null);
  const flashListRef = listRef ?? internalRef;
  const insets = useSafeAreaInsets();

  const scrollY = useSharedValue(0);
  const [visibleUnitIndex, setVisibleUnitIndex] = React.useState(0);

  const onScrollTick = useCallback(
    (y: number) => {
      onScroll?.(y);

      // Determine visible unit based on scroll position
      const currentUnitIndex = unitHeaders.findIndex((uh, index) => {
        const nextUnit = unitHeaders[index + 1];
        if (nextUnit) {
          return y >= uh.yOffset && y < nextUnit.yOffset;
        }
        return y >= uh.yOffset;
      });

      if (currentUnitIndex !== -1 && currentUnitIndex !== visibleUnitIndex) {
        setVisibleUnitIndex(currentUnitIndex);
      }
    },
    [onScroll, unitHeaders, visibleUnitIndex],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      "worklet";
      scrollY.value = event.contentOffset.y;
      runOnJS(onScrollTick)(event.contentOffset.y);
    },
  });

  const visibleUnit = unitHeaders[visibleUnitIndex] || unitHeaders[0];

  // ── renderItem — dispatches to the correct cell type ──
  const renderItem = useCallback(
    ({ item }: { item: JourneyFlashListItem }): React.JSX.Element => {
      switch (item.itemType) {
        case "node":
          return (
            <JourneyNodeCell
              item={item as JourneyNode}
              screenWidth={screenWidth}
              activeGlobalIndex={activeGlobalIndex}
              onNodePress={onNodePress}
            />
          );

        case "divider":
          return (
            <DividerCell
              item={item as JourneyDividerItem}
              screenWidth={screenWidth}
              activeGlobalIndex={activeGlobalIndex}
              onJumpToUnit={onJumpToUnit}
            />
          );

        case "mascot":
          return <MascotCell item={item as JourneyMascotItem} />;

        default:
          return <View />;
      }
    },
    [screenWidth, activeGlobalIndex, onNodePress, onJumpToUnit],
  );

  // ── keyExtractor — stable unique ID per item ──
  const keyExtractor = useCallback(
    (item: JourneyFlashListItem): string => item.id,
    [],
  );

  // ── getItemType — enables FlashList cell recycling optimization ──
  const getItemType = useCallback(
    (item: JourneyFlashListItem): string => item.itemType,
    [],
  );

  // ── overrideItemLayout — provides exact cell height per item ──
  // FlashList uses this instead of measuring, eliminating layout thrashing
  const overrideItemLayout = useCallback(
    (
      layout: { span?: number; size?: number },
      item: JourneyFlashListItem,
    ): void => {
      layout.size = item.cellHeight;
    },
    [],
  );

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      {/* Duolingo-style header */}
      <DuolingoHeader />
      <HomeMainButton
        unitLabel={`Unit ${visibleUnit.unitNumber}`}
        sectionTitle={visibleUnit.unitTitle}
        faceColor={UNIT_GRADIENTS[visibleUnit.colorThemeKey]?.[0] || "#4CAF50"}
        rimColor={UNIT_GRADIENTS[visibleUnit.colorThemeKey]?.[1] || "#388E3C"}
      />

      {/* Sticky unit header */}
      {/* {visibleUnit && (
        <View style={{ zIndex: 10 }}>
          <StickyUnitHeader
            sectionNumber={visibleUnit.sectionNumber}
            unitNumber={visibleUnit.unitNumber}
            unitTitle={visibleUnit.unitTitle}
            colorThemeKey={visibleUnit.colorThemeKey}
            stats={stats}
            onGuidePress={onGuidePress}
            onFlagPress={onFlagPress}
            scrollY={scrollY}
            unitBreakpoints={unitHeaders}
          />
        </View>
      )} */}

      {/* Offline banner */}
      <OfflineBanner isOffline={isOffline} />

      {/* FlashList — cell recycling with segment-per-cell SVG rendering */}
      <AnimatedFlashList
        data={data as any}
        renderItem={renderItem as any}
        keyExtractor={keyExtractor as any}
        getItemType={getItemType as any}
        overrideItemLayout={overrideItemLayout as any}
        //@ts-ignore
        estimatedItemSize={ESTIMATED_ITEM_SIZE}
        drawDistance={DRAW_DISTANCE}
        showsVerticalScrollIndicator={false}
        disableAutoLayout={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        snapToInterval={80} // item height
        decelerationRate="normal"
        ref={flashListRef as any}
        contentContainerStyle={{ paddingBottom: LIST_BOTTOM_PADDING }}
      />

      {/* Scroll-to-active floating button */}
      <ScrollToActiveButton
        isVisible={isActiveOffScreen}
        direction={scrollDirection}
        onPress={onScrollToActive}
      />
    </View>
  );
}

export const JourneyMapFlashList = React.memo(JourneyMapFlashListInner);

export default JourneyMapFlashList;
