import { useCallback, useId, useMemo, useState } from "react";
import type { DimensionValue, LayoutChangeEvent, StyleProp, ViewStyle } from "react-native";
import {
  type SharedValue,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export const DEFAULT_PRESS_DEPTH = 6;

export type SvgAppButtonProps = {
  onPress: () => void;
  width: number | `${number}%`;
  height: number;
  color?: string;
  backgroundColor?: string;
  leftRadius?: number;
  rightRadius?: number;
  faceStrokeColor?: string;
  faceStrokeWidth?: number;
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
  accessibilityRole?: import("react-native").AccessibilityRole;
  accessibilityLabel?: string;
};

const clampRadius = (value: number, width: number, height: number): number =>
  Math.max(0, Math.min(value, width / 2, height / 2));

export function roundedRectPath(
  x: number,
  y: number,
  width: number,
  height: number,
  leftRadius: number,
  rightRadius: number,
): string {
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

export function useSvgAppButtonViewModel({
  onPress,
  width,
  height,
  color = "#CE82FF",
  backgroundColor = "#A568CC",
  leftRadius = 13,
  rightRadius = 13,
  faceStrokeColor = "transparent",
  faceStrokeWidth = 0,
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
  accessibilityRole,
  accessibilityLabel,
}: SvgAppButtonProps) {
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
    pressY.value = withTiming(pressDepth, { duration: 20 });
  };

  const handlePressOut = () => {
    onPressOut?.();
    pressY.value = withSpring(0, {
      damping: 20,
      stiffness: 100,
      overshootClamping: true,
    });
  };

  return {
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
    accessibilityRole,
    accessibilityLabel,
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
  };
}
