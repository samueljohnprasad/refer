import { useCallback } from "react";
import type {
  JourneyNode,
  PathNodeData,
  NodePosition,
} from "@/src/types/journey";
import { NodeStatus, NodeState } from "@/src/types/journey";
import { useHighContrast } from "@/src/hooks/useHighContrast";
import { useFreemiumGate } from "@/src/hooks/useFreemiumGate";

export const NODE_VERTICAL_POSITION_RATIO = 0.85;
export const HUGEICON_SIZE_RATIO = 0.6;

export interface JourneyNodeCellProps {
  item: JourneyNode;
  courseId: string;
  screenWidth: number;
  activeGlobalIndex: number;
  onNodePress: (node: PathNodeData, event?: any, color?: string) => void;
  completedNodeId?: string;
}

export function toPathNodeData(item: JourneyNode): PathNodeData {
  return {
    id: item.id,
    index: item.globalIndex,
    type: item.type,
    status: item.status,
    icon: item.icon,
    progress: item.progress,
    label: item.label,
    taskId: item.taskId,
    rewards: item.rewards,
    rewardContent: item.rewardContent,
  };
}

export function useJourneyNodeCellViewModel({
  item,
  courseId,
  screenWidth: _screenWidth,
  activeGlobalIndex,
  onNodePress,
  completedNodeId,
}: JourneyNodeCellProps) {
  const { hasPro, requirePro } = useFreemiumGate();
  // ponytail: Model A - Unit 1 (index 0) free, Unit 2+ requires Pro
  const isProGated = (item.unitIndex ?? 0) > 0 && !hasPro;

  const { pathColors, pathStrokeWidth } = useHighContrast();
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
  // ponytail: preserve natural progress visual states (CURRENT/AVAILABLE) so users invest before paywall
  let nodeState = NodeState.LOCKED;
  if (item.status === NodeStatus.ACTIVE) {
    nodeState = NodeState.CURRENT;
  } else if (item.status === NodeStatus.AVAILABLE) {
    nodeState = NodeState.AVAILABLE;
  } else if (item.status === NodeStatus.COMPLETED) {
    nodeState = NodeState.COMPLETED;
  } else if (item.status === NodeStatus.CLAIMED) {
    nodeState = NodeState.CLAIMED;
  }

  const handlePress = useCallback(
    async (event?: any) => {
      // ponytail: locked progression nodes show normal progression warning
      if (item.status === NodeStatus.LOCKED) {
        onNodePress(pathNodeData, event, undefined);
        return;
      }

      // ponytail: reached/active pro-gated nodes open paywall on tap
      if (isProGated) {
        await requirePro("journey_unit");
        return;
      }

      // Pass faceColor as undefined, letting the new system handle it
      onNodePress(pathNodeData, event, undefined);
    },
    [item.status, isProGated, requirePro, onNodePress, pathNodeData],
  );

  return {
    item,
    courseId,
    nodeState,
    isProGated,
    pathNodeData,
    nodePosition,
    segmentColor,
    handlePress,
    pathStrokeWidth,
    showConnector: item.globalIndex > 0,
    completedNodeId,
  };
}
