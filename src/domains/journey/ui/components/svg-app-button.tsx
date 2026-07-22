import React from "react";
import {
  type DimensionValue,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import Svg, { ClipPath, Defs, Path } from "react-native-svg";
import {
  useSvgAppButtonViewModel,
  DEFAULT_PRESS_DEPTH,
  type SvgAppButtonProps,
} from "../hooks/useSvgAppButtonViewModel";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export interface SvgAppButtonViewProps
  extends ReturnType<typeof useSvgAppButtonViewModel> {}

/**
 * Presentational View component for SvgAppButton.
 * Strictly contains JSX code without internal hooks.
 */
export const SvgAppButtonView = React.memo(function SvgAppButtonView({
  onPress,
  width,
  height,
  color,
  backgroundColor,
  faceStrokeColor,
  faceStrokeWidth,
  strokeLeftWidth,
  strokeLeftColor,
  strokeRightWidth,
  strokeRightColor,
  pressDepth,
  disabled,
  children,
  style,
  contentContainerStyle,
  clipId,
  resolvedWidth,
  onContainerLayout,
  facePath,
  rimPath,
  animatedStyle,
  leftStrokeTarget,
  rightStrokeTarget,
  leftStrokeAnimatedProps,
  rightStrokeAnimatedProps,
  handlePressIn,
  handlePressOut,
}: SvgAppButtonViewProps): React.JSX.Element {
  return (
    <View
      onLayout={onContainerLayout}
      style={[
        { width: width as DimensionValue, height: height + pressDepth },
        style,
      ]}
    >
      {resolvedWidth > 0 ? (
        <>
          <Svg
            width={resolvedWidth}
            height={height + pressDepth}
            viewBox={`0 0 ${resolvedWidth} ${height + pressDepth}`}
            style={StyleSheet.absoluteFill}
          >
            <Path d={rimPath} fill={backgroundColor} />
          </Svg>

          <AnimatedPressable
            disabled={disabled}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
              {
                position: "absolute",
                width: resolvedWidth,
                height,
                overflow: "hidden",
              },
              animatedStyle,
            ]}
          >
            <Svg
              width={resolvedWidth}
              height={height}
              viewBox={`0 0 ${resolvedWidth} ${height}`}
              style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
            >
              <Defs>
                <ClipPath id={clipId}>
                  <Path d={facePath} />
                </ClipPath>
              </Defs>

              <Path
                d={facePath}
                fill={color}
                stroke={faceStrokeColor}
                strokeWidth={faceStrokeWidth}
              />

              {Math.max(strokeLeftWidth, leftStrokeTarget) > 0 ? (
                <AnimatedPath
                  animatedProps={leftStrokeAnimatedProps}
                  d={`M ${strokeLeftWidth / 2} 0 V ${height}`}
                  stroke={strokeLeftColor}
                  strokeWidth={strokeLeftWidth}
                  clipPath={`url(#${clipId})`}
                />
              ) : null}

              {Math.max(strokeRightWidth, rightStrokeTarget) > 0 ? (
                <AnimatedPath
                  animatedProps={rightStrokeAnimatedProps}
                  d={`M ${resolvedWidth - strokeRightWidth / 2} 0 V ${height}`}
                  stroke={strokeRightColor}
                  strokeWidth={strokeRightWidth}
                  clipPath={`url(#${clipId})`}
                />
              ) : null}
            </Svg>

            <View
              style={[
                { flex: 1, zIndex: 10, elevation: 10 },
                contentContainerStyle,
              ]}
              pointerEvents="box-none"
            >
              {children}
            </View>
          </AnimatedPressable>
        </>
      ) : null}
    </View>
  );
});

/**
 * Container component for SvgAppButton.
 */
export const SvgAppButton = (props: SvgAppButtonProps) => {
  const viewModel = useSvgAppButtonViewModel(props);
  return <SvgAppButtonView {...viewModel} />;
};

export default SvgAppButton;
export type { SvgAppButtonProps };
