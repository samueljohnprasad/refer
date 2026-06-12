import React, { useCallback, useId, useMemo, useState } from "react";
import {
  type DimensionValue,
  LayoutChangeEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  ReduceMotion,
  type SharedValue,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { ClipPath, Defs, Path } from "react-native-svg";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const DEFAULT_PRESS_DEPTH = 6;

type SvgAppButtonProps = {
  onPress: () => void;
  width: number | `${number}%`;
  height: number;
  color?: string;
  backgroundColor?: string;
  leftRadius?: number;
  rightRadius?: number;
  strokeLeftWidth?: number;
  strokeLeftPressedWidth?: number;
  strokeLeftColor?: string;
  strokeRightWidth?: number;
  strokeRightPressedWidth?: number;
  strokeRightColor?: string;
  pressDepth?: number;
  sharedPressY?: SharedValue<number>;
  disabled?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onPressIn?: () => void;
  onPressOut?: () => void;
};

const clampRadius = (value: number, width: number, height: number) =>
  Math.max(0, Math.min(value, width / 2, height / 2));

function roundedRectPath(
  x: number,
  y: number,
  width: number,
  height: number,
  leftRadius: number,
  rightRadius: number,
) {
  const l = clampRadius(leftRadius, width, height);
  const r = clampRadius(rightRadius, width, height);

  return [
    `M ${x + l} ${y}`,
    `H ${x + width - r}`,
    `Q ${x + width} ${y} ${x + width} ${y + r}`,
    `V ${y + height - r}`,
    `Q ${x + width} ${y + height} ${x + width - r} ${y + height}`,
    `H ${x + l}`,
    `Q ${x} ${y + height} ${x} ${y + height - l}`,
    `V ${y + l}`,
    `Q ${x} ${y} ${x + l} ${y}`,
    "Z",
  ].join(" ");
}

export const SvgAppButton = ({
  onPress,
  width,
  height,
  color = "#CE82FF",
  backgroundColor = "#A568CC",
  leftRadius = 13,
  rightRadius = 13,
  strokeLeftWidth = 0,
  strokeLeftPressedWidth,
  strokeLeftColor = "transparent",
  strokeRightWidth = 0,
  strokeRightPressedWidth,
  strokeRightColor = "transparent",
  pressDepth = DEFAULT_PRESS_DEPTH,
  sharedPressY,
  disabled = false,
  children,
  style,
  contentContainerStyle,
  onPressIn,
  onPressOut,
}: SvgAppButtonProps) => {
  const internalPressY = useSharedValue(0);
  const pressY = sharedPressY ?? internalPressY;
  const clipId = useId().replace(/[:]/g, "");
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const hasPercentageWidth = typeof width === "string";
  const resolvedWidth = hasPercentageWidth ? measuredWidth : width;

  const onContainerLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (!hasPercentageWidth) {
        return;
      }
      const nextWidth = event.nativeEvent.layout.width;
      if (nextWidth > 0 && Math.abs(nextWidth - measuredWidth) > 0.5) {
        setMeasuredWidth(nextWidth);
      }
    },
    [hasPercentageWidth, measuredWidth],
  );

  const facePath = useMemo(
    () => roundedRectPath(0, 0, resolvedWidth, height, leftRadius, rightRadius),
    [height, leftRadius, resolvedWidth, rightRadius],
  );

  const rimPath = useMemo(
    () =>
      roundedRectPath(
        0,
        pressDepth,
        resolvedWidth,
        height,
        leftRadius,
        rightRadius,
      ),
    [height, leftRadius, pressDepth, resolvedWidth, rightRadius],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressY.value }],
  }));
  const safePressDepth = Math.max(1, pressDepth);
  const leftStrokeTarget = strokeLeftPressedWidth ?? strokeLeftWidth;
  const rightStrokeTarget = strokeRightPressedWidth ?? strokeRightWidth;

  const leftStrokeAnimatedProps = useAnimatedProps(() => ({
    strokeWidth: interpolate(
      pressY.value,
      [0, safePressDepth],
      [strokeLeftWidth, leftStrokeTarget],
    ),
  }));

  const rightStrokeAnimatedProps = useAnimatedProps(() => ({
    strokeWidth: interpolate(
      pressY.value,
      [0, safePressDepth],
      [strokeRightWidth, rightStrokeTarget],
    ),
  }));

  const handlePressIn = () => {
    onPressIn?.();
    // Quick, clean settle (no jitter).
    pressY.value = withTiming(pressDepth, { duration: 20 });
  };

  const handlePressOut = () => {
    onPressOut?.();
    pressY.value = withSpring(0, { damping: 20, stiffness: 100, overshootClamping: true });
  };

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

              <Path d={facePath} fill={color} />

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
};

const styles = StyleSheet.create({});
