import React from "react";
import Svg, { Path } from "react-native-svg";
import Animated from "react-native-reanimated";
import {
  usePathConnectorViewModel,
  type PathConnectorProps,
} from "../hooks/usePathConnectorViewModel";

const AnimatedPath = Animated.createAnimatedComponent(Path);

export interface PathConnectorViewProps
  extends ReturnType<typeof usePathConnectorViewModel> {}

/**
 * Presentational View component for PathConnector.
 * Strictly contains JSX code without internal hooks.
 */
export const PathConnectorView = React.memo(function PathConnectorView({
  pathColors,
  pathStrokeWidth,
  fullPathD,
  progressPathD,
  estimatedLength,
  animatedProgressProps,
  screenWidth,
  pathDimensions,
}: PathConnectorViewProps): React.JSX.Element {
  return (
    <Svg
      width={screenWidth}
      height={pathDimensions.height}
      style={{ position: "absolute", top: 0, left: 0 }}
      pointerEvents="none"
    >
      <Path
        d={fullPathD}
        stroke={pathColors.inactive}
        strokeWidth={pathStrokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
});

/**
 * Container component for PathConnector.
 */
function PathConnector(props: PathConnectorProps): React.JSX.Element {
  const viewModel = usePathConnectorViewModel(props);
  return <PathConnectorView {...viewModel} />;
}

export default React.memo(PathConnector);
export type { PathConnectorProps };
