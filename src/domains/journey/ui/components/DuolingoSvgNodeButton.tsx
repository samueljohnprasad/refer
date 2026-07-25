import React from "react";
import { Pressable } from "react-native";
import Animated from "react-native-reanimated";
import Svg, { ClipPath, Defs, Ellipse, G, Rect } from "react-native-svg";
import {
  useDuolingoSvgNodeButtonViewModel,
  type DuolingoSvgNodeButtonProps,
  BUTTON_CENTER_X,
  FACE_BASE_CY,
  RIM_CY,
  RX,
  RY,
  CLIP_INSET,
  SVG_VIEWBOX,
  GLOSS_X,
  GLOSS_W,
  GLOSS_TOP_Y,
  GLOSS_TOP_H,
  GLOSS_BOTTOM_Y,
  GLOSS_BOTTOM_H,
} from "../hooks/useDuolingoSvgNodeButtonViewModel";

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedGroup = Animated.createAnimatedComponent(G);

export interface DuolingoSvgNodeButtonViewProps
  extends ReturnType<typeof useDuolingoSvgNodeButtonViewModel> {}

/**
 * Presentational View component for DuolingoSvgNodeButton.
 * Consists strictly of JSX code without internal hooks.
 */
export const DuolingoSvgNodeButtonView = React.memo(
  function DuolingoSvgNodeButtonView({
    clipId,
    resolvedIconSize,
    centeredIconOffset,
    outerCircleAnimatedProps,
    glossAnimatedProps,
    iconFollowFaceProps,
    iconAnimatedStyle,
    containerStyle,
    handlePressIn,
    handlePressOut,
    onPress,
    disabled,
    faceColor,
    rimColor,
    icon,
    accessibilityLabel,
  }: DuolingoSvgNodeButtonViewProps): React.JSX.Element {
    return (
      <Pressable
        disabled={disabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
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
        </Svg>
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: "16%", // Nudge it up slightly to match the 3D face center
              justifyContent: "center",
              alignItems: "center",
            },
            iconAnimatedStyle,
          ]}
        >
          {icon}
        </Animated.View>
      </Pressable>
    );
  },
);

/**
 * Container component for DuolingoSvgNodeButton.
 */
export function DuolingoSvgNodeButtonInner(
  props: DuolingoSvgNodeButtonProps,
): React.JSX.Element {
  const viewModel = useDuolingoSvgNodeButtonViewModel(props);
  return <DuolingoSvgNodeButtonView {...viewModel} />;
}

export const DuolingoSvgNodeButton = React.memo(DuolingoSvgNodeButtonInner);
export default DuolingoSvgNodeButton;
export type { DuolingoSvgNodeButtonProps };
