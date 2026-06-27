/**
 * TimelineStemLine
 *
 * Renders the vertical dotted line using SVG for perfect rendering
 * across platforms (CSS dashed borders are often buggy).
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Line } from "react-native-svg";

interface TimelineStemLineProps {
  /** If true, the line occupies space but is invisible */
  readonly hidden?: boolean;
  /** If true, uses flex: 1 to fill available vertical space. Otherwise uses a fixed min-height. */
  readonly flex?: boolean;
}

const STEM_LINE_COLOR = "rgba(0, 0, 0, 0.12)";

const TimelineStemLine: React.FC<TimelineStemLineProps> = React.memo(
  ({ hidden = false, flex = false }) => {
    return (
      <View style={[styles.container, flex ? styles.flex : styles.fixed]}>
        {!hidden && (
          <Svg width="2" height="100%" style={StyleSheet.absoluteFill}>
            <Line
              x1="1"
              y1="0"
              x2="1"
              y2="100%"
              stroke={STEM_LINE_COLOR}
              strokeWidth="2"
              strokeDasharray="3, 5"
            />
          </Svg>
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
