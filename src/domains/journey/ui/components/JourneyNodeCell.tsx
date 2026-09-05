import React from "react";
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

export const JourneyNodeCellView = React.memo(function JourneyNodeCellView({
  item,
  nodeState,
  nodePosition,
  segmentColor,
  pathStrokeWidth,
  handlePress,
  screenWidth,
  courseId,
}: JourneyNodeCellViewProps): React.JSX.Element {
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
          <Path
            d={item.segmentD}
            stroke={segmentColor}
            strokeWidth={pathStrokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="0 28"
          />
        </Svg>
      ) : null}

      {(item.type === "lesson" || item.type === "milestone") && (nodeState === "current" || nodeState === "completed" || nodeState === "available") ? (
        <Link
          href={{
            pathname: "/tabs/screens/journey-flow",
            params: { courseId: courseId, nodeId: item.id },
          }}
          asChild
        >
          <Link.Trigger>
            <Link.AppleZoom>
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
            </Link.AppleZoom>
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
