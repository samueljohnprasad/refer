import { type ReactElement } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { BlurView } from "expo-blur";
import { GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";

import { Mascot } from "@/src/components/ui/Mascot";
import type { HappyAssistantPosition } from "@/src/store/slices/happyAssistantSlice";
import {
  ASSISTANT_BUTTON_INNER_SIZE,
  ASSISTANT_BUTTON_SIZE,
} from "./constants";
import { useFloatingAssistantButtonMotion } from "./useFloatingAssistantButtonMotion";

interface FloatingAssistantButtonProps {
  isDimmed: boolean;
  position: HappyAssistantPosition | null;
  onOpen: () => void;
  onPositionChange: (position: HappyAssistantPosition) => void;
}

export function FloatingAssistantButton({
  isDimmed,
  position,
  onOpen,
  onPositionChange,
}: FloatingAssistantButtonProps): ReactElement {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { assistantGesture, animatedStyle } = useFloatingAssistantButtonMotion({
    isDimmed,
    position,
    windowWidth: width,
    windowHeight: height,
    safeAreaTop: insets.top,
    safeAreaBottom: insets.bottom,
    onOpen,
    onPositionChange,
  });

  return (
    <GestureDetector gesture={assistantGesture}>
      <Animated.View
        accessible
        accessibilityRole="button"
        accessibilityLabel="Open Happy Assistant"
        accessibilityHint="Drag to move. Tap for quick actions."
        onAccessibilityTap={onOpen}
        pointerEvents="box-only"
        style={[styles.container, animatedStyle]}
      >
        <AssistantButtonChrome />
      </Animated.View>
    </GestureDetector>
  );
}

function AssistantButtonChrome(): ReactElement {
  return (
    <View style={styles.outerRing}>
      <BlurView intensity={36} tint="light" style={styles.button}>
        <View style={styles.mascotShell}>
          <Mascot state="panda-happy" size={46} />
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: ASSISTANT_BUTTON_SIZE,
    height: ASSISTANT_BUTTON_SIZE,
    zIndex: 9999,
    elevation: 9999,
  },
  outerRing: {
    width: ASSISTANT_BUTTON_SIZE,
    height: ASSISTANT_BUTTON_SIZE,
    borderRadius: ASSISTANT_BUTTON_SIZE / 2,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(172, 172, 172, 0.35)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.22)",
  },
  button: {
    width: ASSISTANT_BUTTON_INNER_SIZE,
    height: ASSISTANT_BUTTON_INNER_SIZE,
    borderRadius: ASSISTANT_BUTTON_INNER_SIZE / 2,
    borderCurve: "continuous",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(145, 145, 145, 0.58)",
  },
  mascotShell: {
    width: ASSISTANT_BUTTON_INNER_SIZE,
    height: ASSISTANT_BUTTON_INNER_SIZE,
    borderRadius: ASSISTANT_BUTTON_INNER_SIZE / 2,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
});
