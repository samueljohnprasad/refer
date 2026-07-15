/**
 * TimelineStemLine
 *
 * Renders the vertical dotted line using SVG for perfect rendering
 * across platforms (CSS dashed borders are often buggy).
 */

import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Svg, { Line } from "react-native-svg";

interface TimelineStemLineProps {
  /** If true, the line occupies space but is invisible */
  readonly hidden?: boolean;
  /** If true, uses flex: 1 to fill available vertical space. Otherwise uses a fixed min-height. */
  readonly flex?: boolean;
  /** Optional style for layout adjustments like margins */
  readonly style?: StyleProp<ViewStyle>;
}

const STEM_LINE_COLOR = "rgba(0, 0, 0, 0.10)";

const TimelineStemLine: React.FC<TimelineStemLineProps> = React.memo(
  ({ hidden = false, flex = false, style }) => {
    const [height, setHeight] = React.useState<number>(0);
    return (
      <View 
        style={[styles.container, flex ? styles.flex : styles.fixed, style]}
        onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
      >
        {!hidden && height > 0 && (
          <View style={StyleSheet.absoluteFill}>
            <Svg width="2" height={height} style={{ flex: 1 }}>
              <Line
                x1="1"
                y1="0"
                x2="1"
                y2={height}
                stroke={STEM_LINE_COLOR}
                strokeWidth="2"
                strokeDasharray="3, 5"
              />
            </Svg>
          </View>
        )}
      </View>
    );
  },
);

TimelineStemLine.displayName = "TimelineStemLine";
export { TimelineStemLine };

const styles = StyleSheet.create({
  container: {
    width: 2,
    alignItems: "center",
    // We need overflow: hidden to ensure the SVG doesn't bleed if the container is small
    overflow: "hidden",
  },
  flex: {
    flex: 1,
  },
  fixed: {
    minHeight: 12,
  },
});
