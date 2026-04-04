/**
 * PathConnector
 * SVG layer rendering the journey path with two tracks:
 * 1. Grey background track (full path)
 * 2. Green progress track (completed portion) — animated stroke draw
 *
 * Animation (Task 3.3.1): When completedCount changes the progress
 * track animates its strokeDashoffset → 0 over ANIMATION_TIMING.pathDraw ms,
 * producing a draw-on effect via react-native-reanimated + react-native-svg.
 */

import React, { useEffect, useMemo } from "react";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { NodePosition } from "@/src/types/journey/node";
import { PathDimensions } from "@/src/utils/journey/dimensions";
import { useHighContrast } from "@/src/hooks/useHighContrast";
import { buildPartialPathD, buildPathD } from "@/src/utils/journey/pathBuilder";
import { ANIMATION_TIMING } from "@/src/data/journey/constants";



// Wrap SVG Path with reanimated so we can animate native SVG props
const AnimatedPath = Animated.createAnimatedComponent(Path);

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface PathConnectorProps {
  nodePositions: NodePosition[];
  pathDimensions: PathDimensions;
  screenWidth: number;
  /** Number of completed nodes (progress track drawn up to this index) */
  completedCount: number;
}

// ---------------------------------------------------------------------------
// Approximate path length for strokeDash animation
// ---------------------------------------------------------------------------

function approximatePathLength(
  positions: NodePosition[],
  endIndex: number,
): number {
  let length = 0;
  const end: number = Math.min(endIndex + 1, positions.length);
  for (let i = 1; i < end; i++) {
    const dx: number = positions[i].x - positions[i - 1].x;
    const dy: number = positions[i].y - positions[i - 1].y;
    // Bézier is ~1.2× the chord length on average
    length += Math.sqrt(dx * dx + dy * dy) * 1.2;
  }
  return Math.max(length, 1);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function PathConnector({
  nodePositions,
  pathDimensions,
  screenWidth,
  completedCount,
}: PathConnectorProps): React.JSX.Element {
  const { pathColors, pathStrokeWidth } = useHighContrast();
  const fullPathD: string = buildPathD(nodePositions);
  const progressPathD: string =
    completedCount > 0
      ? buildPartialPathD(nodePositions, completedCount)
      : "";

  // Estimate total length of the progress sub-path for dash animation
  const estimatedLength: number = useMemo(
    () =>
      completedCount > 0
        ? approximatePathLength(nodePositions, completedCount)
        : 0,
    [nodePositions, completedCount],
  );

  // Shared value drives strokeDashoffset: starts at full length, animates to 0
  const dashOffset = useSharedValue(estimatedLength);

  useEffect(() => {
    // Reset to full length instantly, then animate to 0 (draw on)
    dashOffset.value = estimatedLength;
    dashOffset.value = withTiming(0, {
      duration: ANIMATION_TIMING.pathDraw,
      easing: Easing.out(Easing.ease),
    });
  }, [estimatedLength, dashOffset]);

  const animatedProgressProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
  }));

  return (
    <Svg
      width={screenWidth}
      height={pathDimensions.height}
      style={{ position: "absolute", top: 0, left: 0 }}
      pointerEvents="none"
    >
      {/* Grey background track */}
      <Path
        d={fullPathD}
        stroke={pathColors.inactive}
        strokeWidth={pathStrokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Animated green progress overlay */}
      {progressPathD.length > 0 && (
        <AnimatedPath
          d={progressPathD}
          stroke={pathColors.active}
          strokeWidth={pathStrokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={estimatedLength}
          animatedProps={animatedProgressProps}
        />
      )}
    </Svg>
  );
}

export default React.memo(PathConnector);
