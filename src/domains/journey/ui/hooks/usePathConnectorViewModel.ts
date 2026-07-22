import { useEffect, useMemo, useRef } from "react";
import {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";
import type { NodePosition } from "@/src/types/journey/node";
import type { PathDimensions } from "@/src/utils/journey/dimensions";
import { useHighContrast } from "@/src/hooks/useHighContrast";
import {
  buildPartialPathD,
  buildPathD,
  approximatePathLength,
} from "@/src/utils/journey/pathBuilder";
import { ANIMATION_TIMING } from "@/src/data/journey/constants";

export interface PathConnectorProps {
  nodePositions: NodePosition[];
  pathDimensions: PathDimensions;
  screenWidth: number;
  completedCount: number;
}

export function usePathConnectorViewModel({
  nodePositions,
  pathDimensions,
  screenWidth,
  completedCount,
}: PathConnectorProps) {
  const { pathColors, pathStrokeWidth } = useHighContrast();

  const fullPathD: string = useMemo(
    () => buildPathD(nodePositions),
    [nodePositions],
  );

  const progressPathD: string = useMemo(
    () =>
      completedCount > 0
        ? buildPartialPathD(nodePositions, completedCount)
        : "",
    [nodePositions, completedCount],
  );

  const estimatedLength: number = useMemo(
    () =>
      completedCount > 0
        ? approximatePathLength(
            nodePositions.slice(
              0,
              Math.min(completedCount + 1, nodePositions.length),
            ),
          )
        : 0,
    [nodePositions, completedCount],
  );

  const dashOffset = useSharedValue(estimatedLength);
  const prevLengthRef = useRef(estimatedLength);

  useEffect(() => {
    if (estimatedLength > prevLengthRef.current) {
      const delta = estimatedLength - prevLengthRef.current;
      dashOffset.value = delta;
      dashOffset.value = withTiming(0, {
        duration: ANIMATION_TIMING.pathDraw || 1000,
        easing: Easing.out(Easing.ease),
      });
    } else if (estimatedLength < prevLengthRef.current) {
      dashOffset.value = 0;
    } else {
      dashOffset.value = 0;
    }
    prevLengthRef.current = estimatedLength;
  }, [estimatedLength, dashOffset]);

  const animatedProgressProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
  }));

  return {
    pathColors,
    pathStrokeWidth,
    fullPathD,
    progressPathD,
    estimatedLength,
    animatedProgressProps,
    screenWidth,
    pathDimensions,
  };
}
