import React, { useEffect } from "react";
import { StyleSheet, View, Platform, PlatformColor } from "react-native";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  FocusPointIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { GlassView } from "expo-glass-effect";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";

export type ScrollToActiveButtonDirection = "up" | "down";
export type ScrollToActiveButtonMode = "direction" | "focus";

export interface ScrollToActiveButtonProps {
  isVisible: boolean;
  direction?: ScrollToActiveButtonDirection;
  mode?: ScrollToActiveButtonMode;
  onPress: () => void;
}

const FADE_DURATION = 150;
const SLIDE_DURATION = 300;
const FLOATING_BUTTON_BOTTOM_OFFSET = 104;
const FLOATING_BUTTON_RIGHT_OFFSET = 24;

const getHiddenOffset = (
  mode: ScrollToActiveButtonMode,
  direction: ScrollToActiveButtonDirection,
): number => {
  return direction === "down" ? 20 : -20;
};

const getButtonText = (
  mode: ScrollToActiveButtonMode,
  direction: ScrollToActiveButtonDirection,
): string => {
  if (mode === "focus") return "Current lesson";
  return direction === "down" ? "Scroll down" : "Back to top";
};

const getAccessibilityLabel = (
  mode: ScrollToActiveButtonMode,
  direction: ScrollToActiveButtonDirection,
): string => {
  if (mode === "focus") return "Return to current lesson";
  return `Scroll ${direction} to active lesson`;
};

function ScrollToActiveButton({
  isVisible,
  direction = "down",
  mode = "direction",
  onPress,
}: ScrollToActiveButtonProps): React.JSX.Element {
  const hiddenOffset = getHiddenOffset(mode, direction);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(hiddenOffset);

  useEffect(() => {
    const timingConfig = { duration: SLIDE_DURATION, easing: Easing.out(Easing.quad) };
    if (isVisible) {
      opacity.value = withTiming(1, timingConfig);
      translateY.value = withTiming(0, timingConfig);
    } else {
      opacity.value = withTiming(0, { duration: FADE_DURATION });
      translateY.value = withTiming(hiddenOffset, timingConfig);
    }
  }, [isVisible, hiddenOffset, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[animatedStyle, styles.container]}
      pointerEvents={isVisible ? "auto" : "none"}
    >
      <PressableScale
        onPress={onPress}
        scale={0.92}
        hapticStyle="light"
        accessibilityRole="button"
        accessibilityLabel={getAccessibilityLabel(mode, direction)}
      >
        <View style={styles.button}>
          {/* The glass blur layer */}
          <GlassView
            glassEffectStyle="regular"
            style={StyleSheet.absoluteFill}
          />

          {/* Light white frosted overlay to brighten the glass */}
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "#FFFFFF", opacity: 0.65 },
            ]}
          />

          <View style={styles.contentContainer}>
            {mode === "focus" ? (
              <HugeiconsIcon
                icon={FocusPointIcon}
                size={20}
                color="#1A1D1E"
                strokeWidth={2.5}
              />
            ) : (
              <HugeiconsIcon
                icon={direction === "down" ? ArrowDown01Icon : ArrowUp01Icon}
                size={20}
                color="#1A1D1E"
                strokeWidth={2.5}
              />
            )}
          </View>
        </View>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-end",
    bottom: FLOATING_BUTTON_BOTTOM_OFFSET,
    position: "absolute",
    right: FLOATING_BUTTON_RIGHT_OFFSET,
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 999,
  },
  button: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
    overflow: "hidden",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 8,
  },
  text: {
    fontFamily: "GeistBold",
    fontSize: 14,
    color: "#1A1D1E",
    letterSpacing: -0.2,
  },
});

export default React.memo(ScrollToActiveButton);
