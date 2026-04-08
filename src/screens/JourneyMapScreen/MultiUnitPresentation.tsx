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
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    runOnJS,
    type AnimatedRef,
} from "react-native-reanimated";
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
import type { PathDimensions } from "@/src/utils/journey";
import type { UnitConfig } from "@/src/types/journey/config";
import type { UnitLayoutSegment } from "@/src/hooks/useMultiUnitLayout";
import { useJourneyConfig } from "@/src/context/JourneyConfigContext";

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
    scrollViewRef: AnimatedRef<Animated.ScrollView>;
    /** Whether offline */
    isOffline: boolean;
    /** Whether active node is off-screen */
    isActiveOffScreen: boolean;
    /** Scroll direction to reach active */
    scrollDirection: "up" | "down";
    /** Scroll-to-active callback */
    onScrollToActive: () => void;
    /** Callback to update scroll-to-active visibility (called via runOnJS) */
    updateScrollVisibility: (scrollY: number) => void;
    /** Guide-book button handler */
    onGuidePress?: () => void;
    /** Flag icon handler (opens journey switcher) */
    onFlagPress?: () => void;
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
                        colorThemeKey={unitConfig.colorThemeKey}
                        onPress={onNodePress}
                    />
                );
            })}

            {/* Mascot bubbles — kept mounted to avoid animation churn on scroll.
          Off-screen mascots are hidden with opacity + pointerEvents instead
          of unmounting, so their shared values stay alive on the native side. */}
            {mascotPositions.map((mascot: MascotPositionData) => {
                const visible: boolean = isInViewport(mascot.y);
                return (
                    <View
                        key={mascot.key}
                        style={{ opacity: visible ? 1 : 0 }}
                        pointerEvents={visible ? "auto" : "none"}
                    >
                        <MascotBubble
                            x={mascot.x}
                            y={mascot.y}
                            side={mascot.side}
                            initialMessage={mascot.message}
                        />
                    </View>
                );
            })}
        </>
    );
}

// ---------------------------------------------------------------------------
// MultiUnitPresentation
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Binary search helper — finds the last unit whose transition Y <= scrollY.
// Runs on the UI thread inside worklets so it must be a plain function.
// O(log n) instead of the previous O(n) linear scan per frame.
// ---------------------------------------------------------------------------

function binarySearchVisibleUnit(
    breakpoints: number[],
    scrollY: number,
): number {
    "worklet";
    let lo: number = 0;
    let hi: number = breakpoints.length - 1;
    let result: number = 0;
    while (lo <= hi) {
        const mid: number = (lo + hi) >>> 1;
        if (breakpoints[mid] <= scrollY) {
            result = mid;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return result;
}

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
    updateScrollVisibility,
    onGuidePress,
    onFlagPress,
    onJumpToUnit,
}: MultiUnitPresentationProps): React.JSX.Element {
    const journeyConfig = useJourneyConfig();

    // Viewport culling — no longer owns a scroll handler; we push updates via runOnJS
    const { isInViewport, updateScrollY } = useViewportCulling();

    // Canonical scroll position on the UI thread (drives header color interpolation)
    const scrollY = useSharedValue(0);

    // Visible unit index — only updated via runOnJS when the index actually changes
    const [visibleIndex, setVisibleIndex] = React.useState<number>(
        currentVisibleUnitIndex || 0,
    );

    // Pre-compute sorted breakpoints for binary search (yOffset - 170 = transition point)
    const unitBreakpoints: number[] = useMemo(
        () => unitRenderData.map((rd: UnitRenderData) => rd.layout.yOffset - 170),
        [unitRenderData],
    );

    // Shared value tracking the last pushed unit index (avoids redundant runOnJS calls)
    const lastVisibleIndexSV = useSharedValue(currentVisibleUnitIndex || 0);

    /**
     * JS-thread callback invoked via runOnJS when the visible unit changes.
     * Batches the React state update with the culling + visibility updates
     * so we get at most 1 re-render per threshold crossing, not 4.
     */
    const onUnitChanged = useCallback(
        (newIndex: number, y: number): void => {
            setVisibleIndex(newIndex);
            updateScrollY(y);
            updateScrollVisibility(y);
        },
        [updateScrollY, updateScrollVisibility],
    );

    /**
     * JS-thread callback for scroll positions where the unit didn't change.
     * Only called when the culling hysteresis threshold is likely crossed
     * (~every 300px). Much cheaper than calling per-frame.
     */
    const onScrollTick = useCallback(
        (y: number): void => {
            updateScrollY(y);
            updateScrollVisibility(y);
        },
        [updateScrollY, updateScrollVisibility],
    );

    // ── Single Reanimated scroll handler — runs entirely on the UI thread ──
    // All per-frame work (scrollY.value assignment, binary search) is worklet code.
    // JS thread is only touched via runOnJS when a discrete threshold is crossed.
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            "worklet";
            const y: number = event.contentOffset.y;
            scrollY.value = y;

            // Binary search for visible unit — O(log n) on the UI thread
            const newIndex: number = binarySearchVisibleUnit(unitBreakpoints, y);

            if (newIndex !== lastVisibleIndexSV.value) {
                lastVisibleIndexSV.value = newIndex;
                // Unit boundary crossed — push all JS updates in one batch
                runOnJS(onUnitChanged)(newIndex, y);
            } else {
                // Same unit — only push culling/visibility updates periodically.
                // The hysteresis inside updateScrollY ensures this is ~2-3x per fling.
                runOnJS(onScrollTick)(y);
            }
        },
    });

    // Determine current visible unit for the sticky header
    const visibleUnit: UnitRenderData | undefined =
        unitRenderData[visibleIndex] ?? unitRenderData[0];

    // Flatten all node positions to draw one continuous path across all units
    const allNodePositions: NodePosition[] = useMemo(() => {
        return unitRenderData.flatMap(
            (rd: UnitRenderData) => rd.layout.nodePositions,
        );
    }, [unitRenderData]);

    // Calculate global active node index so the green progress path reaches it exactly
    const activeNodeGlobalIndex: number = useMemo(() => {
        let globalIndex: number = 0;
        for (const rd of unitRenderData) {
            if (!rd.unit || !rd.unit.nodes) continue;
            for (const node of rd.unit.nodes) {
                if (node.status === NodeStatus.ACTIVE) {
                    return globalIndex;
                }
                globalIndex++;
            }
        }
        return globalIndex;
    }, [unitRenderData]);

    return (
        <View className="flex-1 bg-gray-50">
            {/* Sticky unit header — color automatically interpolates on scroll */}
            {visibleUnit && (
                <StickyUnitHeader
                    sectionNumber={visibleUnit.sectionNumber}
                    unitNumber={visibleUnit.unitConfig.unitNumber}
                    unitTitle={visibleUnit.unitConfig.title}
                    colorThemeKey={visibleUnit.unitConfig.colorThemeKey}
                    stats={stats}
                    onGuidePress={onGuidePress}
                    onFlagPress={onFlagPress}
                    scrollY={scrollY}
                    unitRenderData={unitRenderData}
                />
            )}

            {/* Offline banner */}
            <OfflineBanner isOffline={isOffline} />

            {/* Animated.ScrollView — native scroll events handled on UI thread */}
            <Animated.ScrollView
                ref={scrollViewRef}
                className="flex-1"
                contentContainerStyle={{
                    height: totalDimensions.height,
                    width: screenWidth,
                }}
                showsVerticalScrollIndicator={false}
                onScroll={scrollHandler}
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
                                        journeyConfig.colorThemes[
                                            renderData.unitConfig.colorThemeKey
                                        ]?.dividerColor
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
            </Animated.ScrollView>

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
