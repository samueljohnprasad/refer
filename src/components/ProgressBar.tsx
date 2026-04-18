import React, { useId } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Svg, { ClipPath, Defs, Rect } from "react-native-svg";

type ProgressBarProps = {
  progress: number; // 0..1
  width?: number;
  height?: number;
  trackColor?: string;
  fillColor?: string;
  glossColor?: string;
  showGloss?: boolean;
  style?: StyleProp<ViewStyle>;
  value?: string;
  valueColor?: string;
  valueFontSize?: number;
  valueFontFamily?: string;
  valueFontWeight?: TextStyle["fontWeight"];
  valueStyle?: StyleProp<TextStyle>;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const ProgressBar = ({
  progress,
  width = 320,
  height = 18,
  trackColor = "#E5E5E5",
  fillColor = "#F6C20A",
  glossColor = "#FCD34D",
  showGloss = true,
  style,
  value,
  valueColor = "#FFFFFF",
  valueFontSize = 12,
  valueFontFamily,
  valueFontWeight = "700",
  valueStyle,
}: ProgressBarProps) => {
  const p = clamp01(progress);
  const fillWidth = width * p;
  const radius = height / 2;
  const clipId = useId().replace(/[:]/g, "");

  const glossInsetX = height * 0.42;
  const glossY = height * 0.27;
  const glossHeight = height * 0.28;
  const glossWidth = Math.max(0, fillWidth - glossInsetX * 1.6);

  return (
    <View style={[{ width, height }, style]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={radius}
          fill={trackColor}
        />

        <Rect
          x={0}
          y={0}
          width={fillWidth}
          height={height}
          rx={radius}
          fill={fillColor}
        />

        {showGloss && fillWidth > 0 ? (
          <>
            <Defs>
              <ClipPath id={clipId}>
                <Rect
                  x={0}
                  y={0}
                  width={fillWidth}
                  height={height}
                  rx={radius}
                />
              </ClipPath>
            </Defs>
            <Rect
              x={glossInsetX}
              y={glossY}
              width={glossWidth}
              height={glossHeight}
              rx={glossHeight / 2}
              fill={glossColor}
              clipPath={`url(#${clipId})`}
            />
          </>
        ) : null}
      </Svg>

      {value ? (
        <View pointerEvents="none" style={styles.valueContainer}>
          <Text
            style={[
              {
                color: valueColor,
                fontSize: valueFontSize,
                fontFamily: valueFontFamily,
                fontWeight: valueFontWeight,
              },
              valueStyle,
            ]}
          >
            {value}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  valueContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProgressBar;
