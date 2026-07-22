import React from "react";
import { StyleSheet, View } from "react-native";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  FocusPointIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { GlassView } from "expo-glass-effect";
import Animated from "react-native-reanimated";
import {
  useScrollToActiveButtonViewModel,
  type ScrollToActiveButtonProps,
  type ScrollToActiveButtonDirection,
  type ScrollToActiveButtonMode,
} from "../hooks/useScrollToActiveButtonViewModel";

const FLOATING_BUTTON_BOTTOM_OFFSET = 104;
const FLOATING_BUTTON_RIGHT_OFFSET = 24;

export interface ScrollToActiveButtonViewProps
  extends ReturnType<typeof useScrollToActiveButtonViewModel> {}

/**
 * Presentational View component for ScrollToActiveButton.
 * Strictly contains JSX code without internal hooks.
 */
export const ScrollToActiveButtonView = React.memo(
  function ScrollToActiveButtonView({
    animatedStyle,
    accessibilityLabel,
    isVisible,
    direction,
    mode,
    onPress,
  }: ScrollToActiveButtonViewProps): React.JSX.Element {
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
          accessibilityLabel={accessibilityLabel}
        >
          <View style={styles.button}>
            <GlassView
              glassEffectStyle="regular"
              style={StyleSheet.absoluteFill}
            />
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
  },
);

/**
 * Container component for ScrollToActiveButton.
 */
function ScrollToActiveButton(
  props: ScrollToActiveButtonProps,
): React.JSX.Element {
  const viewModel = useScrollToActiveButtonViewModel(props);
  return <ScrollToActiveButtonView {...viewModel} />;
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

export type {
  ScrollToActiveButtonDirection,
  ScrollToActiveButtonMode,
  ScrollToActiveButtonProps,
};
export default React.memo(ScrollToActiveButton);
