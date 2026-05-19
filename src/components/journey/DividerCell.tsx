import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { JourneyDividerItem } from "@/src/types/journey";
import { useHighContrast } from "@/src/hooks/useHighContrast";
import UnitDivider from "./UnitDivider";

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
  previousNodeGlobalIndex: number | undefined,
  activeGlobalIndex: number,
  pathColors: { active: string; inactive: string },
): string {
  return isActiveDividerSegment(previousNodeGlobalIndex, activeGlobalIndex)
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
    item.prevNodeGlobalIndex,
    activeGlobalIndex,
    pathColors,
  );

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
        </Svg>
      ) : null}
      <UnitDivider
        title={item.title}
        connectorLaneX={item.connectorLaneX}
        screenWidth={screenWidth}
      />
    </View>
  );
}
