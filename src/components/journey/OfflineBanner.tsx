/**
 * OfflineBanner (Task 5.1.1)
 * Animated banner that slides down from the top when the device is offline.
 * Slides back up and disappears when connectivity is restored.
 *
 * Uses react-native-reanimated for smooth enter/exit transitions.
 */

import React, { useEffect } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface OfflineBannerProps {
  /** Whether the device is currently offline */
  isOffline: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BANNER_HEIGHT = 40;
const SLIDE_DURATION = 300;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function OfflineBanner({
  isOffline,
}: OfflineBannerProps): React.JSX.Element | null {
  const translateY = useSharedValue(-BANNER_HEIGHT);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isOffline) {
      translateY.value = withTiming(0, {
        duration: SLIDE_DURATION,
        easing: Easing.out(Easing.ease),
      });
      opacity.value = withTiming(1, { duration: SLIDE_DURATION });
    } else {
      translateY.value = withTiming(-BANNER_HEIGHT, {
        duration: SLIDE_DURATION,
        easing: Easing.in(Easing.ease),
      });
      opacity.value = withTiming(0, { duration: SLIDE_DURATION });
    }
  }, [isOffline, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          height: BANNER_HEIGHT,
        },
      ]}
      pointerEvents={isOffline ? "auto" : "none"}
      accessibilityRole="alert"
      accessibilityLabel="You are offline. Changes will sync when you reconnect."
      accessibilityLiveRegion="assertive"
    >
      <View
        className="flex-1 flex-row items-center justify-center px-4"
        style={{ backgroundColor: "#E53E3E" }}
      >
        <Text className="text-xs font-bold text-white">
          ⚠️ No internet connection — progress will sync when you're back online
        </Text>
      </View>
    </Animated.View>
  );
}

export default React.memo(OfflineBanner);
