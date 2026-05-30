import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { ArrowDown01Icon, ArrowUp01Icon, FocusPointIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Text } from "@/components/ui/text";
import { PressableScale } from "@/src/components/ui/PressableScale";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export type ScrollToActiveButtonDirection = "up" | "down";
export type ScrollToActiveButtonMode = "direction" | "focus";

export interface ScrollToActiveButtonProps {
  isVisible: boolean;
  direction?: ScrollToActiveButtonDirection;
  mode?: ScrollToActiveButtonMode;
  onPress: () => void;
}

const FADE_DURATION = 150;
const BUTTON_COLOR = "#5F7F58"; // Sage-500 — on-brand, premium
const BUTTON_SPRING = { damping: 20, stiffness: 280 } as const; // Snappy entrance
const FOCUS_BUTTON_SIZE = 52;
const FOCUS_ICON_SIZE = 22;
const FLOATING_BUTTON_BOTTOM_OFFSET = 104;
const FLOATING_BUTTON_RIGHT_OFFSET = 24;

const getHiddenOffset = (
  mode: ScrollToActiveButtonMode,
  direction: ScrollToActiveButtonDirection,
): number => {
  if (mode === "focus") {
    return 20;
  }

  return direction === "down" ? 20 : -20;
};

const getAccessibilityLabel = (
  mode: ScrollToActiveButtonMode,
  direction: ScrollToActiveButtonDirection,
): string => {
  if (mode === "focus") {
    return "Return to current lesson";
  }

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
    if (isVisible) {
      opacity.value = withSpring(1, BUTTON_SPRING);
      translateY.value = withSpring(0, BUTTON_SPRING);
    } else {
      opacity.value = withTiming(0, { duration: FADE_DURATION });
      translateY.value = withSpring(hiddenOffset, BUTTON_SPRING);
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
        <View
          style={[
            styles.button,
            mode === "focus" ? styles.focusButton : styles.directionButton,
          ]}
        >
          {mode === "focus" ? (
            <HugeiconsIcon
              icon={FocusPointIcon}
              size={FOCUS_ICON_SIZE}
              color="#FFFFFF"
              strokeWidth={2.4}
            />
          ) : (
            <HugeiconsIcon
              icon={direction === "down" ? ArrowDown01Icon : ArrowUp01Icon}
              size={18}
              color="#FFFFFF"
              strokeWidth={2.5}
            />
          )}
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
  },
  button: {
    alignItems: "center",
    backgroundColor: BUTTON_COLOR,
    borderRadius: 999,
    elevation: 6,
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  directionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  focusButton: {
    height: FOCUS_BUTTON_SIZE,
    width: FOCUS_BUTTON_SIZE,
  },
});

export default React.memo(ScrollToActiveButton);
