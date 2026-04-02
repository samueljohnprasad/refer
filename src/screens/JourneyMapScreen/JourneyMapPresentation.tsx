/**
 * JourneyMapPresentation
 * Pure presentational component — composes journey sub-components.
 * Receives all data and callbacks via props. No state, no side effects.
 */

import React, { useMemo } from "react";
import { View, ScrollView } from "react-native";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

import type {
  UnitData,
  PathNodeData,
  NodePosition,
  JourneyStats,
} from "@/src/types/journey";
import { NodeStatus } from "@/src/types/journey";

import {
  PathNode,
  PathConnector,
  JourneyHeader,
  MascotBubble,
  ChestNode,
  OfflineBanner,
  ScrollToActiveButton,
} from "@/src/components/journey";
import { NodeType } from "@/src/types/journey";
import type { MascotPositionData } from "@/src/hooks/useMascotPositions";
import { PathDimensions } from "@/src/utils/journey";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface JourneyMapPresentationProps {
  unit: UnitData;
  stats: JourneyStats;
  nodePositions: NodePosition[];
  pathDimensions: PathDimensions;
  screenWidth: number;
  mascotPositions: MascotPositionData[];
  onNodePress: (node: PathNodeData) => void;
  scrollViewRef: React.RefObject<ScrollView | null>;
  /** Task 5.1.1: Whether the device is offline */
  isOffline: boolean;
  /** Task 5.1.4: Whether the active node is scrolled off-screen */
  isActiveOffScreen: boolean;
  /** Task 5.1.4: Direction to scroll to reach active node */
  scrollDirection: "up" | "down";
  /** Task 5.1.4: Callback to scroll to active node */
  onScrollToActive: () => void;
  /** Task 5.1.4: onScroll handler for tracking viewport position */
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

// ---------------------------------------------------------------------------
// Presentation
// ---------------------------------------------------------------------------

function JourneyMapPresentation({
  unit,
  stats,
  nodePositions,
  pathDimensions,
  screenWidth,
  mascotPositions,
  onNodePress,
  scrollViewRef,
  isOffline,
  isActiveOffScreen,
  scrollDirection,
  onScrollToActive,
  onScroll,
}: JourneyMapPresentationProps): React.JSX.Element {
  const completedCount: number = useMemo(
    () =>
      unit?.nodes
        ? unit.nodes.filter((n: PathNodeData) => n.status === NodeStatus.COMPLETED).length
        : 0,
    [unit?.nodes],
  );



  return (
    <View className="flex-1 bg-gray-50 mb-28">
      {/* Header — fixed above scroll */}
      {/* <JourneyHeader unit={unit} stats={stats} /> */}

      {/* Task 5.1.1: Offline banner */}
      <OfflineBanner isOffline={isOffline} />

      {/* Scrollable journey path */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerStyle={{
          height: pathDimensions.height,
          width: screenWidth,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {/* SVG path layer (behind nodes) */}
        <PathConnector
          nodePositions={nodePositions}
          pathDimensions={pathDimensions}
          screenWidth={screenWidth}
          completedCount={completedCount}
        />

        {/* Node layer (above path) — ChestNode for chests, PathNode for all others */}
        {(unit?.nodes || []).map((node: PathNodeData, index: number) =>
          node.type === NodeType.CHEST ? (
            <ChestNode
              key={node.id}
              node={node}
              position={nodePositions[index]}
              onPress={onNodePress}
            />
          ) : (
            <PathNode
              key={node.id}
              node={node}
              position={nodePositions[index]}
              onPress={onNodePress}
            />
          ),
        )}

        {/* Mascot layer (above nodes) */}
        {mascotPositions.map((mascot: MascotPositionData) => (
          <MascotBubble
            key={mascot.key}
            x={mascot.x}
            y={mascot.y}
            side={mascot.side}
            initialMessage={mascot.message}
          />
        ))}
      </ScrollView>

      {/* Task 5.1.4: Scroll-to-active floating button */}
      <ScrollToActiveButton
        isVisible={isActiveOffScreen}
        direction={scrollDirection}
        onPress={onScrollToActive}
      />
    </View>
  );
}

export default React.memo(JourneyMapPresentation);
