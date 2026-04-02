/**
 * ScrollToActiveButton (Task 5.1.4)
 * Floating button that appears when the active node is scrolled off-screen.
 * Tapping it smoothly scrolls the journey map to center the active node.
 *
 * Uses react-native-reanimated for fade in/out transitions.
 */

import React, { useEffect } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { PressableScale } from "@/src/components/ui/PressableScale";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ScrollToActiveButtonProps {
  /** Whether the active node is currently off-screen */
  isVisible: boolean;
  /** Direction hint: is the active node above or below the viewport? */
  direction: "up" | "down";
  /** Callback to trigger scroll to the active node */
  onPress: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FADE_DURATION = 250;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function ScrollToActiveButton({
  isVisible,
  direction,
  onPress,
}: ScrollToActiveButtonProps): React.JSX.Element {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(direction === "down" ? 20 : -20);

  useEffect(() => {
    if (isVisible) {
      opacity.value = withTiming(1, {
        duration: FADE_DURATION,
        easing: Easing.out(Easing.ease),
      });
      translateY.value = withTiming(0, {
        duration: FADE_DURATION,
        easing: Easing.out(Easing.ease),
      });
    } else {
      opacity.value = withTiming(0, {
        duration: FADE_DURATION,
        easing: Easing.in(Easing.ease),
      });
      translateY.value = withTiming(direction === "down" ? 20 : -20, {
        duration: FADE_DURATION,
      });
    }
  }, [isVisible, direction, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: "absolute",
          bottom: 24,
          alignSelf: "center",
          zIndex: 100,
        },
      ]}
      pointerEvents={isVisible ? "auto" : "none"}
    >
      <PressableScale
        onPress={onPress}
        scale={0.92}
        hapticStyle="light"
        accessibilityRole="button"
        accessibilityLabel={`Scroll ${direction} to active lesson`}
      >
        <View
          className="flex-row items-center rounded-full px-5 py-3"
          style={{
            backgroundColor: "#58CC02",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Text className="text-sm font-extrabold text-white">
            {direction === "down" ? "↓" : "↑"} Go to current lesson
          </Text>
        </View>
      </PressableScale>
    </Animated.View>
  );
}

export default React.memo(ScrollToActiveButton);
