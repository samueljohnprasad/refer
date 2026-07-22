import { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

export interface SpotlightTarget {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SpotlightTooltipProps {
  visible: boolean;
  message: string;
  target: SpotlightTarget | null;
  onDismiss: () => void;
}

export const TOOLTIP_MAX_WIDTH: number = 280;
export const SPOTLIGHT_PADDING: number = 12;
export const TOOLTIP_OFFSET: number = 16;

export function useSpotlightTooltipViewModel({
  visible,
  message,
  target,
  onDismiss,
}: SpotlightTooltipProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const overlayOpacity = useSharedValue<number>(0);
  const tooltipScale = useSharedValue<number>(0.8);
  const tooltipOpacity = useSharedValue<number>(0);

  useEffect(() => {
    if (visible) {
      overlayOpacity.value = withTiming(1, { duration: 300 });
      tooltipScale.value = withDelay(
        200,
        withSpring(1, {
          damping: 20,
          stiffness: 100,
          overshootClamping: true,
        }),
      );
      tooltipOpacity.value = withDelay(
        200,
        withTiming(1, { duration: 250 }),
      );
      Haptics.selectionAsync();
    } else {
      overlayOpacity.value = withTiming(0, { duration: 200 });
      tooltipScale.value = 0.8;
      tooltipOpacity.value = 0;
    }
  }, [visible, overlayOpacity, tooltipScale, tooltipOpacity]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const tooltipAnimStyle = useAnimatedStyle(() => ({
    opacity: tooltipOpacity.value,
    transform: [{ scale: tooltipScale.value }],
  }));

  const hasTarget: boolean = target !== null;
  const targetCenterY: number = target ? target.y : screenHeight / 2;
  const showBelow: boolean = targetCenterY < screenHeight / 2;

  const tooltipTop: number = hasTarget
    ? showBelow
      ? target!.y + target!.height / 2 + SPOTLIGHT_PADDING + TOOLTIP_OFFSET
      : target!.y -
        target!.height / 2 -
        SPOTLIGHT_PADDING -
        TOOLTIP_OFFSET -
        120
    : screenHeight / 2 - 60;

  const tooltipLeft: number = Math.max(
    16,
    Math.min(
      hasTarget
        ? target!.x - TOOLTIP_MAX_WIDTH / 2
        : (screenWidth - TOOLTIP_MAX_WIDTH) / 2,
      screenWidth - TOOLTIP_MAX_WIDTH - 16,
    ),
  );

  return {
    overlayStyle,
    tooltipAnimStyle,
    hasTarget,
    showBelow,
    tooltipTop,
    tooltipLeft,
    visible,
    message,
    target,
    onDismiss,
  };
}
