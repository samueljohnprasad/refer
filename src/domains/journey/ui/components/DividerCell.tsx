import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated from "react-native-reanimated";
import UnitDivider from "./UnitDivider";
import {
  useDividerCellViewModel,
  type DividerCellProps,
} from "../hooks/useDividerCellViewModel";

const AnimatedPath = Animated.createAnimatedComponent(Path);

export interface DividerCellViewProps
  extends ReturnType<typeof useDividerCellViewModel> {}

/**
 * Presentational View component for DividerCell.
 * Strictly contains JSX code without internal hooks.
 */
export const DividerCellView = React.memo(function DividerCellView({
  item,
  screenWidth,
  pathStrokeWidth,
  segmentColor,
  animatedPathProps,
}: DividerCellViewProps): React.JSX.Element {
  return (
    <View style={{ height: item.cellHeight }}>
      {item.segmentD ? (
        <Svg
          width={screenWidth}
          height={item.cellHeight}
          style={{ position: "absolute", top: 0, left: 0 }}
          pointerEvents="none"
        >
          <AnimatedPath
            animatedProps={animatedPathProps}
            d={item.segmentD}
            stroke={segmentColor}
            strokeWidth={pathStrokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="0 28"
          />
        </Svg>
      ) : null}
      <View
        style={{
          position: "absolute",
          top: item.cellHeight * 0.85,
          left: 0,
          right: 0,
          transform: [{ translateY: -14 }],
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
});

/**
 * Container component for DividerCell.
 */
export function DividerCell(props: DividerCellProps): React.JSX.Element {
  const viewModel = useDividerCellViewModel(props);
  return <DividerCellView {...viewModel} />;
}

export default React.memo(DividerCell);
export type { DividerCellProps };
