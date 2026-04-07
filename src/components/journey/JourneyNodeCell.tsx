/**
 * JourneyNodeCell
 * FlashList cell component for the segment-per-cell architecture.
 *
 * Each cell renders:
 * 1. Its own <Svg height={cellHeight}> with the pre-built bezier segment
 * 2. A <ConfigDrivenNode> absolutely positioned at the path endpoint
 *
 * Key properties:
 * - React.memo with custom comparator — only re-renders on status change
 * - Zero internal state — all data flows from props
 * - SVG path uses LOCAL cell coordinates (0 → cellHeight), not global
 * - Touch via existing ConfigDrivenNode pattern
 */

import React, { useCallback } from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

import type { JourneyNode } from "@/src/types/journey";
import { NodeStatus } from "@/src/types/journey";
import ConfigDrivenNode from "@/src/components/journey/ConfigDrivenNode";
import type { PathNodeData, NodePosition } from "@/src/types/journey";
import { useHighContrast } from "@/src/hooks/useHighContrast";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Vertical offset within the cell where the node circle is rendered */
const NODE_VERTICAL_POSITION_RATIO: number = 0.85;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface JourneyNodeCellProps {
    /** Pre-computed node data from buildJourneyNodes */
    item: JourneyNode;
    /** Screen width for SVG container */
    screenWidth: number;
    /** Index of the currently active node (for path coloring) */
    activeGlobalIndex: number;
    /** Node press handler */
    onNodePress: (node: PathNodeData) => void;
}

// ---------------------------------------------------------------------------
// Helper: convert JourneyNode → PathNodeData for ConfigDrivenNode
// ---------------------------------------------------------------------------

function toPathNodeData(item: JourneyNode): PathNodeData {
    return {
        id: item.id,
        index: item.globalIndex,
        type: item.type,
        status: item.status,
        icon: item.icon,
        progress: item.progress,
        label: item.status === NodeStatus.ACTIVE ? item.label : undefined,
        taskId: item.taskId,
        rewards: item.rewards,
    };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function JourneyNodeCellInner({
    item,
    screenWidth,
    activeGlobalIndex,
    onNodePress,
}: JourneyNodeCellProps): React.JSX.Element {
    const { pathColors, pathStrokeWidth } = useHighContrast();

    // Determine segment color: green if this node is at or before the active node
    const isProgressSegment: boolean = item.globalIndex <= activeGlobalIndex;
    const segmentColor: string = isProgressSegment
        ? pathColors.active
        : pathColors.inactive;

    // Node position within the cell (centered at bottom of segment)
    const nodePosition: NodePosition = {
        x: item.x,
        y: item.cellHeight * NODE_VERTICAL_POSITION_RATIO,
    };

    // Stable press handler
    const handlePress = useCallback(
        (node: PathNodeData): void => {
            onNodePress(node);
        },
        [onNodePress],
    );

    const pathNodeData: PathNodeData = toPathNodeData(item);

    return (
        <View style={{ height: item.cellHeight, width: screenWidth, zIndex: 1000 - item.globalIndex }}>
            {/* SVG path segment — local coordinates (0 → cellHeight) */}
            {item.segmentD.length > 0 && (
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
            )}

            {/* Node circle — absolutely positioned over the path endpoint */}
            <ConfigDrivenNode
                node={pathNodeData}
                position={nodePosition}
                variantKey={item.variantKey}
                colorThemeKey={item.colorThemeKey}
                onPress={handlePress}
            />
        </View>
    );
}

/**
 * Highly aggressive memoization — only re-renders when:
 * - Node status changes
 * - Progress ticks (active node ring)
 * - Active global index changes (path coloring boundary)
 *
 * X, Y, cellHeight, segmentD are pre-computed and NEVER change at runtime.
 */
export const JourneyNodeCell = React.memo(
    JourneyNodeCellInner,
    (prev: JourneyNodeCellProps, next: JourneyNodeCellProps): boolean => {
        return (
            prev.item.id === next.item.id &&
            prev.item.status === next.item.status &&
            prev.item.progress === next.item.progress &&
            prev.activeGlobalIndex === next.activeGlobalIndex &&
            prev.screenWidth === next.screenWidth
        );
    },
);

export default JourneyNodeCell;
