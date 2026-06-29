import React, { useCallback, useId, useMemo } from "react";
import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { ClipPath, Defs, Ellipse, G, Rect } from "react-native-svg";

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

const BUTTON_CENTER_X = 50;
const FACE_BASE_CY = 40;
const RIM_CY = 53;
const FACE_PRESSED_CY = 52;
const RX = 55;
const RY = 45;
const CLIP_INSET = 8;
const SVG_VIEWBOX = "-10 -10 120 130";
const GLOSS_X = -10;
const GLOSS_W = 120;
const GLOSS_TOP_Y = -2;
const GLOSS_TOP_H = 30;
const GLOSS_BOTTOM_Y = 50;
const GLOSS_BOTTOM_H = 26;
const ICON_DROP_DISTANCE = 12;

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedGroup = Animated.createAnimatedComponent(G);

function DuolingoSvgNodeButtonInner({
  size,
  onPress,
  disabled = false,
  faceColor,
  rimColor,
  icon,
  iconSize,
  accessibilityLabel,
}: DuolingoSvgNodeButtonProps): React.JSX.Element {
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

  const containerStyle = useMemo(
    () => ({
      width: size,
      height: size,
      opacity: 1, // Rely on config locked colors instead of cheap transparency
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
      borderRadius: size / 2,
    }),
    [size],
  );

  /** Spring config for the node press-release — quick rebound */
  const PRESS_SPRING = useMemo(() => ({ damping: 14, stiffness: 400 }), []);

  const handlePressIn = useCallback(() => {
    if (disabled) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    cy.value = withTiming(FACE_PRESSED_CY, { duration: 80 });
  }, [cy, disabled]);

  const handlePressOut = useCallback(() => {
    cy.value = withSpring(FACE_BASE_CY, PRESS_SPRING);
  }, [cy, PRESS_SPRING]);

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={containerStyle}
    >
      <Svg width="100%" height="100%" viewBox={SVG_VIEWBOX}>
        <Defs>
          <ClipPath id={clipId}>
            <Ellipse
              cx={BUTTON_CENTER_X}
              cy={FACE_BASE_CY}
              rx={RX - CLIP_INSET}
              ry={RY - CLIP_INSET}
            />
          </ClipPath>
        </Defs>

        <Ellipse
          cx={BUTTON_CENTER_X}
          cy={RIM_CY}
          rx={RX}
          ry={RY}
          fill={rimColor}
        />

        <AnimatedEllipse
          animatedProps={outerCircleAnimatedProps}
          cx={BUTTON_CENTER_X}
          cy={FACE_BASE_CY}
          rx={RX}
          ry={RY}
          fill={faceColor}
        />

        <AnimatedGroup
          animatedProps={glossAnimatedProps}
          clipPath={`url(#${clipId})`}
        >
          <Rect
            x={GLOSS_X}
            y={GLOSS_TOP_Y}
            width={GLOSS_W}
            height={GLOSS_TOP_H}
            fill="rgba(255, 255, 255, 0.3)"
            transform={`rotate(-45 ${BUTTON_CENTER_X} ${FACE_BASE_CY})`}
          />
          <Rect
            x={GLOSS_X}
            y={GLOSS_BOTTOM_Y}
            width={GLOSS_W}
            height={GLOSS_BOTTOM_H}
            fill="rgba(255, 255, 255, 0.3)"
            transform={`rotate(-45 ${BUTTON_CENTER_X} ${FACE_BASE_CY})`}
          />
        </AnimatedGroup>

        <AnimatedGroup animatedProps={iconFollowFaceProps}>
          <G transform={`translate(${BUTTON_CENTER_X} ${FACE_BASE_CY})`}>
            <G
              transform={`translate(${-centeredIconOffset} ${-centeredIconOffset})`}
            >
              {icon}
            </G>
          </G>
        </AnimatedGroup>
      </Svg>
    </Pressable>
  );
}

DuolingoSvgNodeButtonInner.displayName = "DuolingoSvgNodeButton";

export const DuolingoSvgNodeButton = React.memo(DuolingoSvgNodeButtonInner);
