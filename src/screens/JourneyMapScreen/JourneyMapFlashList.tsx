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
import { FlashList } from "@shopify/flash-list";

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
} from "@/src/components/journey";

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
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
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
}: JourneyMapFlashListProps): React.JSX.Element {
    const internalRef = useRef<FlashList<JourneyFlashListItem>>(null);
    const flashListRef = listRef ?? internalRef;

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
            {/* Offline banner */}
            <OfflineBanner isOffline={isOffline} />

            {/* FlashList — cell recycling with segment-per-cell SVG rendering */}
            {/* @ts-ignore */}
            <FlashList
                snapToInterval={80} // item height
                decelerationRate="normal"
                ref={flashListRef as any}
                data={data}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                getItemType={getItemType}
                overrideItemLayout={overrideItemLayout}
                estimatedItemSize={ESTIMATED_ITEM_SIZE}
                drawDistance={DRAW_DISTANCE}
                showsVerticalScrollIndicator={false}
                disableAutoLayout={false}
                onScroll={onScroll as any}
                scrollEventThrottle={16}
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
