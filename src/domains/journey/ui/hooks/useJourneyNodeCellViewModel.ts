import { useCallback } from "react";
import { useColorScheme } from "react-native";
import * as Haptics from "expo-haptics";
import { SAGE } from "@/src/theme/palette";
import { RADIUS } from "@/src/theme/radius";
import type { JourneyNode, PathNodeData, NodePosition } from "@/src/types/journey";
import { NodeIcon, NodeStatus } from "@/src/types/journey";
import { useHighContrast } from "@/src/hooks/useHighContrast";

import { useJourneySettings } from "@/src/context/JourneyConfigContext";

export const NODE_VERTICAL_POSITION_RATIO = 0.85;
export const HUGEICON_SIZE_RATIO = 0.6;

export interface JourneyNodeCellProps {
  item: JourneyNode;
  courseId: string;
  screenWidth: number;
  activeGlobalIndex: number;
  onNodePress: (node: PathNodeData, event?: any, color?: string | import("react-native").OpaqueColorValue) => void;
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

  let faceColor: string = isDark ? SAGE[300] : SAGE[100];
  let rimColor: string = isDark ? SAGE[400] : SAGE[600];
  let iconColor: string = isDark ? SAGE[500] : SAGE[600];
  let iconName = item.icon || "star";
  let isInteractive = false;
  let showProgressRing = false;
  let showTooltip = false;

  if (item.status === NodeStatus.COMPLETED) {
    faceColor = isDark ? SAGE[300] : SAGE[700];
    rimColor = isDark ? SAGE[400] : SAGE[600];
    iconColor = isDark ? "#142414" : SAGE[700];
    iconName = NodeIcon.CHECKPOINT;
    isInteractive = true;
  } else if (item.status === NodeStatus.ACTIVE) {
    faceColor = isDark ? SAGE[400] : SAGE[500];
    rimColor = isDark ? SAGE[500] : SAGE[600];
    iconColor = "#FFFFFF";
    isInteractive = true;
    showProgressRing = true;
    showTooltip = true;
  }
  const size = settings.defaultNodeSize;
  const hugeiconSize = size * HUGEICON_SIZE_RATIO;
  const halfSize = size / 2;
  const handlePress = useCallback(
    (event?: any) => {
      if (!isInteractive) return;
      void Haptics.selectionAsync().catch(() => {});
      onNodePress(pathNodeData, event, faceColor);
    },
    [faceColor, isInteractive, onNodePress, pathNodeData],
  );
  const ringSize =
    size + settings.progressRingGap * 2 + settings.progressRingStroke * 2;
  const ringOffset = -(ringSize - size) / 2;
  const ringRadius = (ringSize - settings.progressRingStroke) / 2;
  const circumference = 2 * Math.PI * ringRadius;
  const segmentsCount = 8;
  const dashGap = 8 + settings.progressRingStroke;
  const dashWidth = (circumference - dashGap * segmentsCount) / segmentsCount;

  return {
    item,
    courseId,
    screenWidth,
    pathStrokeWidth,
    settings,
    segmentColor,
    nodePosition,
    faceColor,
    rimColor,
    iconColor,
    iconName,
    size,
    hugeiconSize,
    halfSize,
    isInteractive,
    showProgressRing,
    showTooltip,
    handlePress,
    ringSize,
    ringOffset,
    dashedConfig: { width: dashWidth, gap: dashGap },
    progressPercent: (item.progress ?? 0) * 100,
    ringBackgroundColor: isDark ? SAGE[300] : SAGE[700],
    pathNodeData,
  };
}
