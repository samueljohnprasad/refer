import React, { useEffect } from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { NODE_SIZE } from "@/src/data/journey/constants";
import { Link } from "expo-router";
import { Node } from "./Node";
import { nodeA11yLabel } from "../utils/nodeA11yLabel";
import {
  useJourneyNodeCellViewModel,
  type JourneyNodeCellProps,
} from "../hooks/useJourneyNodeCellViewModel";

const NODE_DISPLAY_SIZE = NODE_SIZE.regular;

export interface JourneyNodeCellViewProps
  extends ReturnType<typeof useJourneyNodeCellViewModel> {
  screenWidth: number;
}

import Animated, { useAnimatedProps, withDelay, withTiming, useSharedValue } from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const JourneyNodeCellView = React.memo(function JourneyNodeCellView({
  item,
  nodeState,
  isProGated,
  nodePosition,
  segmentColor,
  pathStrokeWidth,
  handlePress,
  screenWidth,
  courseId,
  completedNodeId,
}: JourneyNodeCellViewProps): React.JSX.Element {
  const isModalNodeType =
    item.type === "chest" ||
    item.type === "checkpoint" ||
    item.type === "trophy";
  const isAccessible =
    !isProGated &&
    (nodeState === "current" ||
      nodeState === "completed" ||
      nodeState === "available");
  const shouldRouteToFlow = !isModalNodeType && isAccessible;

  return (
    <View
      style={{
        height: item.cellHeight,
        width: screenWidth,
        zIndex: 1000 - item.globalIndex,
      }}
    >
      {item.segmentD.length > 0 ? (
        <Svg
          width={screenWidth}
          height={item.cellHeight}
          style={{ position: "absolute", top: 0, left: 0 }}
          pointerEvents="none"
        >
          <AnimatedPath
            d={item.segmentD}
            stroke={segmentColor}
            strokeWidth={pathStrokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="0 28"
            strokeDashoffset={14}
          />
        </Svg>
      ) : null}

      {shouldRouteToFlow ? (
        <Link
          href={{
            pathname: "/tabs/screens/journey-flow",
            params: { courseId: courseId, nodeId: item.id },
          }}
          asChild
        >
          <Link.Trigger withAppleZoom>
            <Node
              type={item.type}
              state={nodeState}
              id={item.id}
              index={item.globalIndex}
              position={nodePosition}
              size={NODE_DISPLAY_SIZE}
              label={item.label}
              iconName={item.icon}
              onPress={handlePress}
              accessibilityLabel={nodeA11yLabel(item.type, nodeState)}
            />
          </Link.Trigger>
        </Link>
      ) : (
        <Node
          type={item.type}
          state={nodeState}
          id={item.id}
          index={item.globalIndex}
          position={nodePosition}
          size={NODE_DISPLAY_SIZE}
          label={item.label}
          iconName={item.icon}
          onPress={handlePress}
          accessibilityLabel={nodeA11yLabel(item.type, nodeState)}
        />
      )}
    </View>
  );
});

function JourneyNodeCellInner(props: JourneyNodeCellProps): React.JSX.Element {
  const viewModel = useJourneyNodeCellViewModel(props);
  return <JourneyNodeCellView {...viewModel} screenWidth={props.screenWidth} />;
}

export const JourneyNodeCell = React.memo(
  JourneyNodeCellInner,
  (previous: JourneyNodeCellProps, next: JourneyNodeCellProps): boolean =>
    previous.item.id === next.item.id &&
    previous.item.status === next.item.status &&
    previous.item.progress === next.item.progress &&
    previous.activeGlobalIndex === next.activeGlobalIndex &&
    previous.screenWidth === next.screenWidth,
);

export default JourneyNodeCell;
export type { JourneyNodeCellProps };
