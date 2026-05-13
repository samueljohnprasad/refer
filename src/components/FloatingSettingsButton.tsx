import React, { useCallback, useEffect } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { usePathname, useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BUTTON_SIZE = 58;
const INNER_SIZE = 48;
const EDGE_MARGIN = 12;
const BOTTOM_CLEARANCE = 112;
const TAP_DISTANCE = 6;

export function FloatingSettingsButton(): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const maxX = Math.max(EDGE_MARGIN, width - BUTTON_SIZE - EDGE_MARGIN);
  const minY = insets.top + EDGE_MARGIN;
  const maxY = Math.max(
    minY,
    height - insets.bottom - BUTTON_SIZE - BOTTOM_CLEARANCE,
  );
  const defaultY = Math.min(Math.max(height * 0.42, minY), maxY);

  const x = useSharedValue(maxX);
  const y = useSharedValue(defaultY);
  const startX = useSharedValue(maxX);
  const startY = useSharedValue(defaultY);
  const scale = useSharedValue(1);

  const openSettings = useCallback(() => {
    if (pathname !== "/tabs/screens/settings") {
      router.push("/tabs/screens/settings" as never);
    }
  }, [pathname, router]);

  const snapToEdge = useCallback(
    (currentX: number, currentY: number) => {
      "worklet";

      const nextX = currentX + BUTTON_SIZE / 2 < width / 2 ? EDGE_MARGIN : maxX;
      const nextY = Math.min(Math.max(currentY, minY), maxY);

      x.value = withSpring(nextX, {
        damping: 18,
        stiffness: 170,
        mass: 0.8,
      });
      y.value = withSpring(nextY, {
        damping: 18,
        stiffness: 170,
        mass: 0.8,
      });
    },
    [maxX, maxY, minY, width, x, y],
  );

  useEffect(() => {
    x.value = withSpring(Math.min(Math.max(x.value, EDGE_MARGIN), maxX));
    y.value = withSpring(Math.min(Math.max(y.value, minY), maxY));
  }, [maxX, maxY, minY, x, y]);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      scale.value = withSpring(0.92, {
        damping: 18,
        stiffness: 220,
      });
      startX.value = x.value;
      startY.value = y.value;
    })
    .onUpdate((event) => {
      x.value = startX.value + event.translationX;
      y.value = startY.value + event.translationY;
    })
    .onEnd((event) => {
      scale.value = withSpring(1, {
        damping: 18,
        stiffness: 220,
      });

      const isTap =
        Math.abs(event.translationX) < TAP_DISTANCE &&
        Math.abs(event.translationY) < TAP_DISTANCE;

      if (isTap) {
        runOnJS(openSettings)();
        return;
      }

      snapToEdge(x.value, y.value);
    })
    .onFinalize(() => {
      scale.value = withSpring(1, {
        damping: 18,
        stiffness: 220,
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        accessible
        accessibilityRole="button"
        accessibilityLabel="Open settings"
        accessibilityHint="Drag to move. Tap to open app settings."
        onAccessibilityTap={openSettings}
        pointerEvents="box-only"
        style={[styles.container, animatedStyle]}
      >
        <View style={styles.outerRing}>
          <BlurView intensity={35} tint="light" style={styles.button}>
            <Ionicons name="settings-sharp" size={30} color="#FFFFFF" />
          </BlurView>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    zIndex: 9999,
    elevation: 9999,
  },
  outerRing: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(172, 172, 172, 0.35)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
  },
  button: {
    width: INNER_SIZE,
    height: INNER_SIZE,
    borderRadius: INNER_SIZE / 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(145, 145, 145, 0.66)",
  },
});
