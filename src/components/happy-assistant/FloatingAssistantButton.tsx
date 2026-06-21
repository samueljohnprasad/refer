import { type ReactElement } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { BlurView } from "expo-blur";
import { GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { Mascot } from "@/src/components/ui/Mascot";
import { Text } from "@/src/components/ui/Text";
import type { HappyAssistantPosition } from "@/src/store/slices/happyAssistantSlice";
import {
  ASSISTANT_BUTTON_INNER_SIZE,
  ASSISTANT_BUTTON_SIZE,
} from "./constants";
import { useFloatingAssistantButtonMotion } from "./useFloatingAssistantButtonMotion";

interface FloatingAssistantButtonProps {
  isDimmed: boolean;
  position: HappyAssistantPosition | null;
  message?: string | null;
  onOpen: () => void;
  onPositionChange: (position: HappyAssistantPosition) => void;
}

export function FloatingAssistantButton({
  isDimmed,
  position,
  message,
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

  const isLeft = (position?.x ?? width) < width / 2;

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
        {!!message && (
          <Animated.View 
            entering={FadeIn.duration(400)} 
            exiting={FadeOut.duration(400)}
            style={[styles.bubbleContainer, isLeft ? { left: 0 } : { right: 0 }]}
          >
            <View style={[styles.bubbleArrow, isLeft ? { left: 18 } : { right: 18 }]} />
            <Text style={styles.bubbleText}>{message}</Text>
          </Animated.View>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

function AssistantButtonChrome(): ReactElement {
  return (
    <View style={styles.outerRing}>
      <BlurView intensity={36} tint="light" style={styles.button}>
        <View style={styles.mascotShell}>
          <Mascot state="panda-happy" size={36} />
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
  bubbleContainer: {
    position: "absolute",
    top: ASSISTANT_BUTTON_SIZE + 8,
    backgroundColor: "#FDFDFD",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 120,
    maxWidth: 220,
    shadowColor: "#2B3A22",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(43, 58, 34, 0.08)",
  },
  bubbleArrow: {
    position: "absolute",
    top: -5,
    width: 10,
    height: 10,
    backgroundColor: "#FDFDFD",
    transform: [{ rotate: "45deg" }],
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: "rgba(43, 58, 34, 0.08)",
  },
  bubbleText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2C3E2D",
    lineHeight: 18,
  },
});
