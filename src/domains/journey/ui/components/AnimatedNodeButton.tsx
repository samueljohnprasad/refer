import React from "react";
import { View, Pressable, Platform } from "react-native";
import Animated from "react-native-reanimated";
import {
  useAnimatedNodeButtonViewModel,
  type AnimatedNodeButtonProps,
  type NodeHapticStyle,
} from "../hooks/useAnimatedNodeButtonViewModel";

export interface AnimatedNodeButtonViewProps
  extends ReturnType<typeof useAnimatedNodeButtonViewModel> {}

/**
 * Presentational View component for AnimatedNodeButton.
 * Consists strictly of JSX code without internal hooks.
 */
export const AnimatedNodeButtonView = React.memo(
  function AnimatedNodeButtonView({
    size,
    backgroundColor,
    shadowColor,
    disabled,
    shadowDepth,
    radius,
    children,
    accessibilityLabel,
    accessibilityState,
    className,
    pressStyle,
    handlePressIn,
    handlePressOut,
    handlePress,
  }: AnimatedNodeButtonViewProps): React.JSX.Element {
    return (
      <View
        className={className}
        style={{
          width: size,
          height: size + shadowDepth,
          position: "relative",
        }}
      >
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor: shadowColor,
          }}
        />

        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityState={accessibilityState}
          {...(Platform.OS === "android"
            ? { android_ripple: { borderless: true, radius: radius } }
            : {})}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <Animated.View
            style={[
              pressStyle,
              {
                width: size,
                height: size,
                borderRadius: radius,
                backgroundColor,
                alignItems: "center",
                justifyContent: "center",
                ...(Platform.OS === "ios"
                  ? {
                      shadowColor: "#FFFFFF",
                      shadowOffset: { width: 0, height: -1 },
                      shadowOpacity: 0.15,
                      shadowRadius: 1,
                    }
                  : {}),
              },
            ]}
          >
            {children}
          </Animated.View>
        </Pressable>
      </View>
    );
  },
);

/**
 * Container component for AnimatedNodeButton.
 */
function AnimatedNodeButtonInner(
  props: AnimatedNodeButtonProps,
): React.JSX.Element {
  const viewModel = useAnimatedNodeButtonViewModel(props);
  return <AnimatedNodeButtonView {...viewModel} />;
}

AnimatedNodeButtonInner.displayName = "AnimatedNodeButton";

const AnimatedNodeButton = React.memo(AnimatedNodeButtonInner);

export default AnimatedNodeButton;
export type { AnimatedNodeButtonProps, NodeHapticStyle };
