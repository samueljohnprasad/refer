import React, { useCallback, useState, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const RippleEffect = ({ x, y, onComplete }: Ripple & { onComplete: () => void }) => {
  const scale = useSharedValue(0.1);
  const opacity = useSharedValue(0.2);

  React.useEffect(() => {
    scale.value = withTiming(1.5, { duration: 400, easing: Easing.out(Easing.quad) });
    opacity.value = withTiming(0, { duration: 400 }, (finished) => {
      if (finished) {
        runOnJS(onComplete)();
      }
    });
  }, [opacity, scale, onComplete]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: x - 25, // center the 50x50 circle
          top: y - 25,
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: "rgba(0, 0, 0, 0.25)",
        },
        style,
      ]}
      pointerEvents="none"
    />
  );
};

export const AmbientTapDust = ({ children }: { children: React.ReactNode }) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleIdCounter = useRef(0);

  const handleTap = useCallback((x: number, y: number) => {
    const id = rippleIdCounter.current++;
    setRipples((prev) => [...prev, { id, x, y }]);
  }, []);

  const removeRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const tapGesture = Gesture.Tap()
    .onBegin((e) => {
      // Use absolute coordinates to prevent offset issues inside nested views
      runOnJS(handleTap)(e.absoluteX, e.absoluteY);
    })
    .shouldCancelWhenOutside(false)
    .cancelsTouchesInView(false);

  return (
    <GestureDetector gesture={tapGesture}>
      <View style={{ flex: 1 }}>
        {children}
        <View style={[StyleSheet.absoluteFill, { zIndex: 9999, elevation: 9999 }]} pointerEvents="none">
          {ripples.map((r) => (
            <RippleEffect key={r.id} {...r} onComplete={() => removeRipple(r.id)} />
          ))}
        </View>
      </View>
    </GestureDetector>
  );
};
