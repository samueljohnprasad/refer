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

import React, { useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

import type {
    UnitData,
    PathNodeData,
    NodePosition,
    JourneyStats,
} from '@/src/types/journey';
import { NodeStatus } from '@/src/types/journey';

import {
    PathConnector,
    MascotBubble,
    OfflineBanner,
    ScrollToActiveButton,
    ConfigDrivenNode,
    UnitDivider,
    StickyUnitHeader,
} from '@/src/components/journey';
import type { MascotPositionData } from '@/src/hooks/useMascotPositions';
import type { UnitLayoutSegment } from '@/src/hooks/useMultiUnitLayout';
import type { PathDimensions } from '@/src/utils/journey';
import type { UnitConfig } from '@/src/types/journey/config';

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
    scrollDirection: 'up' | 'down';
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
    screenWidth: number;
}

function UnitSection({ renderData, onNodePress, screenWidth }: UnitSectionProps): React.JSX.Element {
    const { unit, unitConfig, layout, mascotPositions } = renderData;

    const completedCount: number = useMemo(
        () => unit.nodes.filter((n: PathNodeData) => n.status === NodeStatus.COMPLETED).length,
        [unit.nodes],
    );

    const pathDimensions = useMemo(() => ({
        width: screenWidth,
        height: layout.nodePositions.length > 1
            ? (layout.nodePositions[layout.nodePositions.length - 1]?.y ?? 0) -
              (layout.nodePositions[0]?.y ?? 0)
            : 0,
        totalLength: layout.nodePositions.length * 120,
    }), [screenWidth, layout.nodePositions]);

    return (
        <>
            {/* Path connector for this unit's nodes */}
            {layout.nodePositions.length >= 2 && (
                <PathConnector
                    nodePositions={layout.nodePositions}
                    pathDimensions={pathDimensions}
                    screenWidth={screenWidth}
                    completedCount={completedCount}
                />
            )}

            {/* Config-driven nodes */}
            {unit.nodes.map((node: PathNodeData, index: number) => {
                const position: NodePosition | undefined = layout.nodePositions[index];
                if (!position) return null;

                const nodeConfig = unitConfig.nodes[index];
                const variantKey: string = nodeConfig?.variantKey ?? 'star';

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

            {/* Mascot bubbles */}
            {mascotPositions.map((mascot: MascotPositionData) => (
                <MascotBubble
                    key={mascot.key}
                    x={mascot.x}
                    y={mascot.y}
                    side={mascot.side}
                    initialMessage={mascot.message}
                />
            ))}
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
    // Determine current visible unit for the sticky header
    const visibleUnit: UnitRenderData | undefined =
        unitRenderData[currentVisibleUnitIndex] ?? unitRenderData[0];

    return (
        <View className="flex-1 bg-gray-50 mb-28">
            {/* Sticky unit header — color from config */}
            {visibleUnit && (
                <StickyUnitHeader
                    sectionNumber={visibleUnit.sectionNumber}
                    unitNumber={visibleUnit.unitConfig.unitNumber}
                    unitTitle={visibleUnit.unitConfig.title}
                    colorThemeKey={visibleUnit.unitConfig.colorThemeKey}
                    stats={stats}
                    onGuidePress={onGuidePress}
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
                onScroll={onScroll}
                scrollEventThrottle={16}
            >
                {unitRenderData.map((renderData: UnitRenderData, unitIndex: number) => (
                    <React.Fragment key={renderData.unit.id}>
                        {/* Unit divider (skip for the first unit) */}
                        {unitIndex > 0 && (
                            <View
                                style={{
                                    position: 'absolute',
                                    top: renderData.layout.yOffset - 140,
                                    left: 0,
                                    right: 0,
                                }}
                            >
                                <UnitDivider
                                    title={renderData.unitConfig.divider.title}
                                    showJumpHere={renderData.unitConfig.divider.showJumpHere}
                                    accentColor={
                                        renderData.unitConfig.divider.jumpButtonColor ?? '#A855F7'
                                    }
                                    onJumpPress={
                                        onJumpToUnit
                                            ? () => onJumpToUnit(renderData.unit.id)
                                            : undefined
                                    }
                                />
                            </View>
                        )}

                        {/* Unit's nodes, paths, and mascots */}
                        <UnitSection renderData={renderData} onNodePress={onNodePress} screenWidth={screenWidth} />
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
