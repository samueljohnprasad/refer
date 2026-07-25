import { useCallback, useEffect } from "react";
import {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import type { JourneyNode, PathNodeData, NodePosition } from "@/src/types/journey";
import { NodeStatus } from "@/src/types/journey";
import { useHighContrast } from "@/src/hooks/useHighContrast";
import { darkenHex } from "@/src/utils/colorUtils";
import { getHugeicon } from "@/src/data/journey/hugeiconsRegistry";
import {
  useJourneySettings,
  useColorTheme,
} from "@/src/context/JourneyConfigContext";

export const NODE_VERTICAL_POSITION_RATIO = 0.85;
export const HUGEICON_SIZE_RATIO = 0.6;

export interface JourneyNodeCellProps {
  item: JourneyNode;
  courseId: string;
  screenWidth: number;
  activeGlobalIndex: number;
  onNodePress: (node: PathNodeData, e?: any, color?: string) => void;
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
  const theme = useColorTheme(item.colorThemeKey);

  const isProgressSegment: boolean =
    item.status === NodeStatus.COMPLETED ||
    (activeGlobalIndex >= 0 && item.globalIndex <= activeGlobalIndex);

  const segmentColor: string = isProgressSegment
    ? pathColors.active
    : pathColors.inactive;

  const dashLength = 20;
  const dashOffset = useSharedValue(0);
  const isActiveSegment =
    activeGlobalIndex >= 0 && item.globalIndex === activeGlobalIndex;

  useEffect(() => {
    if (isActiveSegment) {
      dashOffset.value = withRepeat(
        withTiming(-dashLength, { duration: 1000, easing: Easing.linear }),
        -1,
        false,
      );
    } else {
      dashOffset.value = 0;
    }
  }, [isActiveSegment, dashOffset]);

  const animatedPathProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
  }));

  const nodePosition: NodePosition = {
    x: item.x,
    y: item.cellHeight * NODE_VERTICAL_POSITION_RATIO,
  };

  const pathNodeData = toPathNodeData(item);

  const ICON_COLORS: Record<NodeStatus, string> = {
    [NodeStatus.ACTIVE]: "#FFFFFF",
    [NodeStatus.COMPLETED]: "#FFFFFF",
    [NodeStatus.LOCKED]: "#94A3B8",
  };

  let faceColor = "#E2E8F0";
  let iconColor = ICON_COLORS[item.status] ?? "#94A3B8";
  let iconName = item.icon || "star";
  let isInteractive = false;
  let showProgressRing = false;
  let showTooltip = false;

  switch (item.status) {
    case NodeStatus.COMPLETED:
      faceColor = theme.headerGradient[1];
      iconName = item.icon || "checkpoint";
      isInteractive = true;
      break;
    case NodeStatus.ACTIVE:
      faceColor = theme.headerGradient[1];
      iconName = item.icon || "star";
      isInteractive = true;
      showTooltip = true;
      break;
    case NodeStatus.LOCKED:
    default:
      faceColor = "#CBD5E1";
      iconName = item.icon || "star";
      isInteractive = false;
      break;
  }

  const rimColor = darkenHex(faceColor, 0.22);
  const size = settings.defaultNodeSize;
  const hugeiconSize = size * HUGEICON_SIZE_RATIO;
  const halfSize = size / 2;

  const handlePress = useCallback(
    (e?: any) => {
      if (!isInteractive) return;
      void Haptics.selectionAsync().catch(() => {});
      onNodePress(pathNodeData, e, faceColor);
    },
    [isInteractive, onNodePress, pathNodeData, faceColor],
  );

  const animProgress = useSharedValue(0);
  useEffect(() => {
    if (item.status === NodeStatus.ACTIVE) {
      animProgress.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
    } else {
      animProgress.value = 0;
    }
  }, [item.status, animProgress]);

  const activeScaleStyle = useAnimatedStyle(() => {
    const scale = interpolate(animProgress.value, [0, 1], [1, 1.05]);
    return { transform: [{ scale }] };
  });

  const ringSize =
    size + settings.progressRingGap * 2 + settings.progressRingStroke * 2;
  const ringOffset = -(ringSize - size) / 2;
  const ringRadius = (ringSize - settings.progressRingStroke) / 2;
  const circumference = 2 * Math.PI * ringRadius;
  const segmentsCount = 8;
  const dashGap = 8 + settings.progressRingStroke;
  const dashWidth = (circumference - dashGap * segmentsCount) / segmentsCount;
  const dashedConfig = { width: dashWidth, gap: dashGap };
  const progressPercent = (item.progress ?? 0) * 100;

  const iconObj = getHugeicon(iconName);

  return {
    item,
    courseId,
    screenWidth,
    pathColors,
    pathStrokeWidth,
    settings,
    theme,
    segmentColor,
    animatedPathProps,
    nodePosition,
    faceColor,
    rimColor,
    iconColor,
    size,
    hugeiconSize,
    halfSize,
    isInteractive,
    showProgressRing,
    showTooltip,
    handlePress,
    activeScaleStyle,
    ringSize,
    ringOffset,
    dashedConfig,
    progressPercent,
    iconObj,
  };
}
