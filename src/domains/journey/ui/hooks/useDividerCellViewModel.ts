import { useEffect } from "react";
import {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import type { JourneyDividerItem } from "@/src/types/journey";
import { useHighContrast } from "@/src/hooks/useHighContrast";

export interface DividerCellProps {
  item: JourneyDividerItem;
  screenWidth: number;
  activeGlobalIndex: number;
}

export function isActiveDividerSegment(
  previousNodeGlobalIndex: number | undefined,
  activeGlobalIndex: number,
): boolean {
  if (previousNodeGlobalIndex === undefined) {
    return false;
  }

  if (activeGlobalIndex === -1) {
    return true;
  }

  return activeGlobalIndex >= 0 && previousNodeGlobalIndex < activeGlobalIndex;
}

export function resolveDividerSegmentColor(
  isConnectorActive: boolean | undefined,
  previousNodeGlobalIndex: number | undefined,
  activeGlobalIndex: number,
  pathColors: { active: string; inactive: string },
): string {
  const shouldHighlightDivider =
    isConnectorActive ??
    isActiveDividerSegment(previousNodeGlobalIndex, activeGlobalIndex);

  return shouldHighlightDivider ? pathColors.active : pathColors.inactive;
}

export function useDividerCellViewModel({
  item,
  screenWidth,
  activeGlobalIndex,
}: DividerCellProps) {
  const { pathColors, pathStrokeWidth } = useHighContrast();

  const segmentColor = resolveDividerSegmentColor(
    item.isConnectorActive,
    item.prevNodeGlobalIndex,
    activeGlobalIndex,
    pathColors,
  );

  const isConnectorActive =
    item.isConnectorActive ??
    isActiveDividerSegment(item.prevNodeGlobalIndex, activeGlobalIndex);

  const dashLength = 20;
  const dashOffset = useSharedValue(14);

  const animatedPathProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
  }));

  return {
    item,
    screenWidth,
    pathStrokeWidth,
    segmentColor,
    animatedPathProps,
  };
}
