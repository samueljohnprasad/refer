import { useCallback } from "react";
import { useColorScheme } from "react-native";
import * as Haptics from "expo-haptics";
import type { JourneyNode, PathNodeData, NodePosition } from "@/src/types/journey";
import { NodeIcon, NodeStatus, NodeState, NodeType } from "@/src/types/journey";
import { useHighContrast } from "@/src/hooks/useHighContrast";

import { useJourneySettings } from "@/src/context/JourneyConfigContext";

export const NODE_VERTICAL_POSITION_RATIO = 0.85;
export const HUGEICON_SIZE_RATIO = 0.6;

export interface JourneyNodeCellProps {
  item: JourneyNode;
  courseId: string;
  screenWidth: number;
  activeGlobalIndex: number;
  onNodePress: (node: PathNodeData, event?: any, color?: string) => void;
}

export function toPathNodeData(item: JourneyNode): PathNodeData {
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

export function useJourneyNodeCellViewModel({
  item,
  courseId,
  screenWidth,
  activeGlobalIndex,
  onNodePress,
}: JourneyNodeCellProps) {
  const { pathColors, pathStrokeWidth } = useHighContrast();
  const settings = useJourneySettings();
  const isDark = useColorScheme() === "dark";
  const isProgressSegment =
    item.status === NodeStatus.COMPLETED ||
    (activeGlobalIndex >= 0 && item.globalIndex <= activeGlobalIndex);
  const segmentColor = isProgressSegment
    ? pathColors.active
    : pathColors.inactive;
  const nodePosition: NodePosition = {
    x: item.x,
    y: item.cellHeight * NODE_VERTICAL_POSITION_RATIO,
  };
  const pathNodeData = toPathNodeData(item);

  // Map existing NodeStatus to NodeState
  let nodeState = NodeState.LOCKED;
  if (item.status === NodeStatus.ACTIVE) {
    nodeState = NodeState.CURRENT;
  } else if (item.status === NodeStatus.COMPLETED) {
    if (item.type === NodeType.CHEST) {
      nodeState = NodeState.CLAIMED;
    } else {
      nodeState = NodeState.COMPLETED;
    }
  }

  const handlePress = useCallback(
    (event?: any) => {
      // Pass faceColor as undefined, letting the new system handle it
      onNodePress(pathNodeData, event, undefined);
    },
    [onNodePress, pathNodeData]
  );

  return {
    item,
    courseId,
    nodeState,
    pathNodeData,
    nodePosition,
    segmentColor,
    handlePress,
    pathStrokeWidth,
    showConnector: item.globalIndex > 0,
  };
}
