/**
 * MultiUnitPresentation (Task 9)
 * Renders ALL units in a single scrollable path with:
 * - Config-driven nodes (ConfigDrivenNode)
 * - Unit dividers between units
 * - Sticky unit header
 * - Mascot bubbles
 * - Path connectors per unit
 * - Offline banner + scroll-to-active button
 *
 * Pure presentational — all data via props.
 */

import React, { useMemo, useCallback } from "react";
import { View, ScrollView } from "react-native";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useViewportCulling } from "@/src/hooks/useViewportCulling";

import type {
    UnitData,
    PathNodeData,
    NodePosition,
    JourneyStats,
} from "@/src/types/journey";
import { NodeStatus } from "@/src/types/journey";

import {
    PathConnector,
    MascotBubble,
    OfflineBanner,
    ScrollToActiveButton,
    ConfigDrivenNode,
    UnitDivider,
    StickyUnitHeader,
} from "@/src/components/journey";
import type { MascotPositionData } from "@/src/hooks/useMascotPositions";
import type { UnitLayoutSegment } from "@/src/hooks/useMultiUnitLayout";
import type { PathDimensions } from "@/src/utils/journey";
import type { UnitConfig } from "@/src/types/journey/config";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Per-unit rendering data combining runtime state with layout */
export interface UnitRenderData {
    /** Runtime unit data (nodes with statuses) */
    unit: UnitData;
    /** Config for this unit (for divider, color theme, node variant keys) */
    unitConfig: UnitConfig;
    /** Layout segment with absolute positions */
    layout: UnitLayoutSegment;
    /** Mascot positions for this unit */
    mascotPositions: MascotPositionData[];
    /** Section number this unit belongs to */
    sectionNumber: number;
}

export interface MultiUnitPresentationProps {
    /** All units to render in order */
    unitRenderData: UnitRenderData[];
    /** User stats for the header */
    stats: JourneyStats;
    /** Currently visible unit index (for sticky header) */
    currentVisibleUnitIndex: number;
    /** Total scrollable dimensions */
    totalDimensions: PathDimensions;
    /** Screen width */
    screenWidth: number;
    /** Node press handler */
    onNodePress: (node: PathNodeData) => void;
    /** ScrollView ref */
    scrollViewRef: React.RefObject<ScrollView | null>;
    /** Whether offline */
    isOffline: boolean;
    /** Whether active node is off-screen */
    isActiveOffScreen: boolean;
    /** Scroll direction to reach active */
    scrollDirection: "up" | "down";
    /** Scroll-to-active callback */
    onScrollToActive: () => void;
    /** Scroll event handler */
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    /** Guide-book button handler */
    onGuidePress?: () => void;
    /** Jump-here handler for unit dividers */
    onJumpToUnit?: (unitId: string) => void;
}

// ---------------------------------------------------------------------------
// UnitSection sub-component — renders one unit's nodes + mascots
// ---------------------------------------------------------------------------

interface UnitSectionProps {
    renderData: UnitRenderData;
    onNodePress: (node: PathNodeData) => void;
    /** Viewport check — returns true if Y is near the visible area */
    isInViewport: (y: number) => boolean;
}

function UnitSection({
    renderData,
    onNodePress,
    isInViewport,
}: UnitSectionProps): React.JSX.Element {
    const { unit, unitConfig, layout, mascotPositions } = renderData;

    return (
        <>
            {/* Config-driven nodes — skip off-screen for perf */}
            {unit.nodes.map((node: PathNodeData, index: number) => {
                const position: NodePosition | undefined = layout.nodePositions[index];
                if (!position) return null;

                // Viewport culling: skip mounting nodes far from screen
                if (!isInViewport(position.y)) return null;

                const nodeConfig = unitConfig.nodes[index];
                const variantKey: string = nodeConfig?.variantKey ?? "star";

                return (
                    <ConfigDrivenNode
                        key={`${unit.id}_${node.id}`}
                        node={node}
                        position={position}
                        variantKey={variantKey}
                        onPress={onNodePress}
                    />
                );
            })}

            {/* Mascot bubbles — also culled */}
            {mascotPositions.map((mascot: MascotPositionData) => {
                if (!isInViewport(mascot.y)) return null;
                return (
                    <MascotBubble
                        key={mascot.key}
                        x={mascot.x}
                        y={mascot.y}
                        side={mascot.side}
                        initialMessage={mascot.message}
                    />
                );
            })}
        </>
    );
}

// ---------------------------------------------------------------------------
// MultiUnitPresentation
// ---------------------------------------------------------------------------

function MultiUnitPresentation({
    unitRenderData,
    stats,
    currentVisibleUnitIndex,
    totalDimensions,
    screenWidth,
    onNodePress,
    scrollViewRef,
    isOffline,
    isActiveOffScreen,
    scrollDirection,
    onScrollToActive,
    onScroll,
    onGuidePress,
    onJumpToUnit,
}: MultiUnitPresentationProps): React.JSX.Element {
    // Viewport culling for performance with many nodes
    const { isInViewport, onScroll: onCullingScroll } = useViewportCulling();

    // Setup scroll tracking for color interpolation
    const scrollY = useSharedValue(0);

    // Setup local state for tracking visible unit efficiently without re-rendering every frame
    const currentVisibleUnitIndexRef = React.useRef(currentVisibleUnitIndex || 0);
    const [visibleIndex, setVisibleIndex] = React.useState(currentVisibleUnitIndex || 0);

    // Compose both scroll handlers (parent + culling)
    const handleScroll = useCallback(
        (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
            const y = event.nativeEvent.contentOffset.y;
            scrollY.value = y;
            onScroll(event);
            onCullingScroll(event);

            // Determine visible unit when the UnitDivider text (at ~yOffset - 170) hits the header
            let newIndex = 0;
            for (let i = 0; i < unitRenderData.length; i++) {
                if (y >= unitRenderData[i].layout.yOffset - 170) {
                    newIndex = i;
                }
            }
            if (newIndex !== currentVisibleUnitIndexRef.current) {
                currentVisibleUnitIndexRef.current = newIndex;
                setVisibleIndex(newIndex);
            }
        },
        [onScroll, onCullingScroll, scrollY, unitRenderData],
    );

    // Determine current visible unit for the sticky header
    const visibleUnit: UnitRenderData | undefined =
        unitRenderData[visibleIndex] ?? unitRenderData[0];

    // Flatten all node positions to draw one continuous path across all units
    const allNodePositions: NodePosition[] = useMemo(() => {
        return unitRenderData.flatMap((rd) => rd.layout.nodePositions);
    }, [unitRenderData]);

    // Calculate global active node index so the green progress path reaches it exactly
    const activeNodeGlobalIndex: number = useMemo(() => {
        let globalIndex = 0;
        for (const rd of unitRenderData) {
            for (const node of rd.unit.nodes) {
                if (node.status === NodeStatus.ACTIVE) {
                    return globalIndex;
                }
                globalIndex++;
            }
        }
        return globalIndex; // If completely finished, path extends to the very end
    }, [unitRenderData]);

    return (
        <View className="flex-1 bg-gray-50 mb-28">
            {/* Sticky unit header — color automatically interpolates on scroll */}
            {visibleUnit && (
                <StickyUnitHeader
                    sectionNumber={visibleUnit.sectionNumber}
                    unitNumber={visibleUnit.unitConfig.unitNumber}
                    unitTitle={visibleUnit.unitConfig.title}
                    colorThemeKey={visibleUnit.unitConfig.colorThemeKey}
                    stats={stats}
                    onGuidePress={onGuidePress}
                    
                    // Added props for color interpolation
                    scrollY={scrollY}
                    unitRenderData={unitRenderData}
                />
            )}

            {/* Offline banner */}
            <OfflineBanner isOffline={isOffline} />

            {/* Single scrollable path with ALL units */}
            <ScrollView
                ref={scrollViewRef}
                className="flex-1"
                contentContainerStyle={{
                    height: totalDimensions.height,
                    width: screenWidth,
                }}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {/* Global continuous path behind everything */}
                {allNodePositions.length > 1 && (
                    <PathConnector
                        nodePositions={allNodePositions}
                        pathDimensions={totalDimensions}
                        screenWidth={screenWidth}
                        completedCount={activeNodeGlobalIndex}
                    />
                )}

                {unitRenderData.map((renderData: UnitRenderData, unitIndex: number) => (
                    <React.Fragment key={renderData.unit.id}>
                        {/* Unit divider (skip for the first unit) */}
                        {unitIndex > 0 && (
                            <View
                                style={{
                                    position: "absolute",
                                    top: renderData.layout.yOffset - 200,
                                    left: 0,
                                    right: 0,
                                }}
                            >
                                <UnitDivider
                                    title={renderData.unitConfig.divider.title}
                                    showJumpHere={renderData.unitConfig.divider.showJumpHere}
                                    accentColor={
                                        renderData.unitConfig.divider.jumpButtonColor ?? "#A855F7"
                                    }
                                    onJumpPress={
                                        onJumpToUnit
                                            ? () => onJumpToUnit(renderData.unit.id)
                                            : undefined
                                    }
                                />
                            </View>
                        )}

                        {/* Unit's nodes and mascots */}
                        <UnitSection
                            renderData={renderData}
                            onNodePress={onNodePress}
                            isInViewport={isInViewport}
                        />
                    </React.Fragment>
                ))}
            </ScrollView>

            {/* Scroll-to-active floating button */}
            <ScrollToActiveButton
                isVisible={isActiveOffScreen}
                direction={scrollDirection}
                onPress={onScrollToActive}
            />
        </View>
    );
}

export default React.memo(MultiUnitPresentation);
