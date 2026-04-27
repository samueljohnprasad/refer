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

/** Renders the path segment that runs through a unit-divider row. */
export function DividerCell({
  item,
  screenWidth,
  activeGlobalIndex,
}: DividerCellProps): React.JSX.Element {
  const { pathColors, pathStrokeWidth } = useHighContrast();

  // Color the segment if:
  // - All nodes are completed (activeGlobalIndex = -1 means journey is done)
  // - There's an active node and the previous node was completed (index < activeGlobalIndex)
  const isProgressSegment: boolean =
    item.prevNodeGlobalIndex !== undefined &&
    (activeGlobalIndex === -1 ||
      (activeGlobalIndex >= 0 &&
        item.prevNodeGlobalIndex < activeGlobalIndex));

  const segmentColor: string = isProgressSegment
    ? pathColors.active
    : pathColors.inactive;

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
      <UnitDivider title={item.title} />
    </View>
  );
}
