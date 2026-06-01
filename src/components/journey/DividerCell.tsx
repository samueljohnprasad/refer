import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { JourneyDividerItem } from "@/src/types/journey";
import { useHighContrast } from "@/src/hooks/useHighContrast";
import UnitDivider from "./UnitDivider";
import Animated, { useSharedValue, useAnimatedProps, withRepeat, withTiming, Easing } from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

export interface DividerCellProps {
  item: JourneyDividerItem;
  screenWidth: number;
  activeGlobalIndex: number;
}

/**
 * Returns whether the divider's connector belongs to the completed/active path.
 * Divider rows inherit their highlight state from the node that came before them.
 */
function isActiveDividerSegment(
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

function resolveDividerSegmentColor(
  isConnectorActive: boolean | undefined,
  previousNodeGlobalIndex: number | undefined,
  activeGlobalIndex: number,
  pathColors: { active: string; inactive: string },
): string {
  const shouldHighlightDivider =
    isConnectorActive ??
    isActiveDividerSegment(previousNodeGlobalIndex, activeGlobalIndex);

  return shouldHighlightDivider
    ? pathColors.active
    : pathColors.inactive;
}

/** Renders the path segment that runs through a unit-divider row. */
export function DividerCell({
  item,
  screenWidth,
  activeGlobalIndex,
}: DividerCellProps): React.JSX.Element {
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
  const dashOffset = useSharedValue(0);

  React.useEffect(() => {
    if (isConnectorActive) {
      dashOffset.value = withRepeat(
        withTiming(-dashLength, { duration: 1000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      dashOffset.value = 0;
    }
  }, [isConnectorActive, dashOffset]);

  const animatedPathProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
  }));

  return (
    <View style={{ height: item.cellHeight }}>
      {item.segmentD ? (
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
          />
          {isConnectorActive && (
            <AnimatedPath
              d={item.segmentD}
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth={pathStrokeWidth * 0.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="12 16"
              animatedProps={animatedPathProps}
            />
          )}
        </Svg>
      ) : null}
      <View
        style={{

          position: "absolute",
          top: item.cellHeight * 0.85,
          left: 0,
          right: 0,
          transform: [{ translateY: -14 }], // Center the pill itself vertically on the 85% mark
        }}
      >
        <UnitDivider
          title={item.title}
          screenWidth={screenWidth}
          accentColor={item.accentColor}
        />
      </View>
    </View>
  );
}
