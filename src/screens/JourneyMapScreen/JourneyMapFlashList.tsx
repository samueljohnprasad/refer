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
import { View, type NativeSyntheticEvent, type NativeScrollEvent } from "react-native";
import Animated, { useSharedValue, useAnimatedScrollHandler, runOnJS } from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
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
import type { UnitHeaderData } from "@/src/hooks/useJourneyFlashList";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Average cell height hint for FlashList's internal estimation */
const ESTIMATED_ITEM_SIZE: number = 120;

/** Extra pixels above/below viewport to pre-render for smooth scrolling */
const DRAW_DISTANCE: number = 600;

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
    listRef?: React.RefObject<FlashList<JourneyFlashListItem>>;
    /** Scroll event handler for tracking scroll visibility */
    onScroll?: (y: number) => void;
    /** Unit headers data */
    unitHeaders: UnitHeaderData[];
    /** Guide-book handler */
    onGuidePress?: () => void;
}

// ---------------------------------------------------------------------------
// Sub-components for heterogeneous cell types
// ---------------------------------------------------------------------------

interface DividerCellProps {
    item: JourneyDividerItem;
    onJumpToUnit?: (unitId: string) => void;
}

function DividerCell({
    item,
    onJumpToUnit,
}: DividerCellProps): React.JSX.Element {
    const handleJump = useCallback((): void => {
        onJumpToUnit?.(item.targetUnitId);
    }, [onJumpToUnit, item.targetUnitId]);

    return (
        <View style={{ height: item.cellHeight }}>
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
    return (
        <View style={{ height: item.cellHeight, backgroundColor: "transparent" }}>
            <MascotBubble
                x={item.x}
                y={item.cellHeight / 2}
                side={item.side as MascotSide}
                initialMessage={item.message}
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
}: JourneyMapFlashListProps): React.JSX.Element {
    const internalRef = useRef<FlashList<JourneyFlashListItem>>(null);
    const flashListRef = listRef ?? internalRef;

    const scrollY = useSharedValue(0);
    const [visibleUnitIndex, setVisibleUnitIndex] = React.useState(0);

    const onScrollTick = useCallback((y: number) => {
        onScroll?.(y);
    }, [onScroll]);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            "worklet";
            scrollY.value = event.contentOffset.y;
            runOnJS(onScrollTick)(event.contentOffset.y);
        },
    });

    // Determine visible unit from viewable items
    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            // Find the first visible node or divider to determine the current unit
            const firstItem = viewableItems.find(vi => vi.item.itemType === 'node' || vi.item.itemType === 'divider');
            if (firstItem) {
                const targetUnitId = firstItem.item.itemType === 'node' 
                    ? (firstItem.item as JourneyNode).unitId 
                    : (firstItem.item as JourneyDividerItem).targetUnitId;
                
                const unitIndex = unitHeaders.findIndex(uh => uh.unitId === targetUnitId);
                if (unitIndex !== -1 && unitIndex !== visibleUnitIndex) {
                    setVisibleUnitIndex(unitIndex);
                }
            }
        }
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
                            onJumpToUnit={onJumpToUnit}
                        />
                    );

                // case "mascot":
                //     return <MascotCell item={item as JourneyMascotItem} />;

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
        <View className="flex-1 bg-gray-50">
            {/* Sticky unit header */}
            {visibleUnit && (
                <View style={{ zIndex: 10 }}>
                    <StickyUnitHeader
                        sectionNumber={visibleUnit.sectionNumber}
                        unitNumber={visibleUnit.unitNumber}
                        unitTitle={visibleUnit.unitTitle}
                        colorThemeKey={visibleUnit.colorThemeKey}
                        stats={stats}
                        onGuidePress={onGuidePress}
                        scrollY={scrollY}
                        unitBreakpoints={unitHeaders}
                    />
                </View>
            )}

            {/* Offline banner */}
            <OfflineBanner isOffline={isOffline} />

            {/* FlashList — cell recycling with segment-per-cell SVG rendering */}
            <AnimatedFlashList
                data={data as any}
                renderItem={renderItem as any}
                keyExtractor={keyExtractor as any}
                getItemType={getItemType as any}
                overrideItemLayout={overrideItemLayout as any}
                estimatedItemSize={ESTIMATED_ITEM_SIZE}
                drawDistance={DRAW_DISTANCE}
                showsVerticalScrollIndicator={false}
                disableAutoLayout={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                snapToInterval={80} // item height
                decelerationRate="normal"
                ref={flashListRef as any}
                onViewableItemsChanged={onViewableItemsChanged.current}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 10,
                    minimumViewTime: 100,
                }}
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
