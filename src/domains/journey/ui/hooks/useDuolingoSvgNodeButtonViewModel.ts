import React, { useCallback, useId, useMemo } from "react";
import * as Haptics from "expo-haptics";
import {
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export type DuolingoSvgNodeButtonProps = {
  size: number;
  onPress: (e?: any) => void;
  disabled?: boolean;
  faceColor: string;
  rimColor: string;
  icon: React.ReactNode;
  iconSize: number;
  accessibilityLabel?: string;
};

export const BUTTON_CENTER_X = 50;
export const FACE_BASE_CY = 40;
export const RIM_CY = 53;
export const FACE_PRESSED_CY = 52;
export const RX = 55;
export const RY = 45;
export const CLIP_INSET = 8;
export const SVG_VIEWBOX = "-10 -10 120 130";
export const GLOSS_X = -10;
export const GLOSS_W = 120;
export const GLOSS_TOP_Y = -2;
export const GLOSS_TOP_H = 30;
export const GLOSS_BOTTOM_Y = 50;
export const GLOSS_BOTTOM_H = 26;
export const ICON_DROP_DISTANCE = 12;

export function useDuolingoSvgNodeButtonViewModel({
  size,
  onPress,
  disabled = false,
  faceColor,
  rimColor,
  icon,
  iconSize,
  accessibilityLabel,
}: DuolingoSvgNodeButtonProps) {
  const clipId = useId().replace(/[:]/g, "");
  const cy = useSharedValue(FACE_BASE_CY);
  const resolvedIconSize = Number.isFinite(iconSize) && iconSize > 0 ? iconSize : 32;
  const centeredIconOffset = resolvedIconSize / 2;

  const outerCircleAnimatedProps = useAnimatedProps(() => ({
    cy: cy.value,
  }));

  const glossAnimatedProps = useAnimatedProps(() => {
    const y = interpolate(
      cy.value,
      [FACE_BASE_CY, RIM_CY],
      [0, ICON_DROP_DISTANCE],
    );
    return { transform: [{ translateY: y }] };
  });

  const iconFollowFaceProps = useAnimatedProps(() => ({
    transform: [{ translateY: cy.value - FACE_BASE_CY }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cy.value - FACE_BASE_CY }],
  }));

  const containerStyle = useMemo(
    () => ({
      width: size,
      height: size,
      opacity: 1,
      shadowColor: faceColor,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 4,
      borderRadius: size / 2,
    }),
    [size, faceColor],
  );

  const PRESS_SPRING = useMemo(() => ({ damping: 14, stiffness: 400 }), []);

  const handlePressIn = useCallback(() => {
    if (disabled) return;
    void Haptics.selectionAsync();
    cy.value = withTiming(FACE_PRESSED_CY, { duration: 80 });
  }, [cy, disabled]);

  const handlePressOut = useCallback(() => {
    cy.value = withSpring(FACE_BASE_CY, PRESS_SPRING);
  }, [cy, PRESS_SPRING]);

  return {
    clipId,
    cy,
    resolvedIconSize,
    centeredIconOffset,
    outerCircleAnimatedProps,
    glossAnimatedProps,
    iconFollowFaceProps,
    iconAnimatedStyle,
    containerStyle,
    handlePressIn,
    handlePressOut,
    size,
    onPress,
    disabled,
    faceColor,
    rimColor,
    icon,
    accessibilityLabel,
  };
}
