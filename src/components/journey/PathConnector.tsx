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

import React, { useEffect, useMemo, useRef } from "react";
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

  const prevLengthRef = useRef(estimatedLength);

  useEffect(() => {
    // True crawl animation: only animate the NEW delta sequence
    if (estimatedLength > prevLengthRef.current) {
        const delta = estimatedLength - prevLengthRef.current;
        // Instantly offset the dash by delta. Because the SVG stroke drawing starts from 0,
        // leaving the last delta pixels un-stroked, this hides ONLY the newly unlocked segment!
        dashOffset.value = delta;
        // Crawl down the path
        dashOffset.value = withTiming(0, {
          duration: ANIMATION_TIMING.pathDraw || 1000,
          easing: Easing.out(Easing.ease),
        });
    } else if (estimatedLength < prevLengthRef.current) {
        // Handled backward steps (e.g. debugging/resetting progress)
        dashOffset.value = 0;
    } else {
        // Initial render mounts it fully drawn
        dashOffset.value = 0;
    }
    prevLengthRef.current = estimatedLength;
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
