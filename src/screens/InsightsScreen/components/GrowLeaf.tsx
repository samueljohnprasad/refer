// A garden leaf. `order` null = settled; a number = new growth, scales in staggered 160 ms by order (EXPERIENCE: Garden growth).
// Settled by default; it shrinks and grows only once Reduce Motion is known to be off.
import React, { useEffect } from "react";
import { AccessibilityInfo } from "react-native";
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";

export function GrowLeaf({ order }: { order: number | null }) {
  const scale = useSharedValue(1);
  useEffect(() => {
    if (order === null) return;
    let live = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (!live || reduced) return;
      scale.value = 0.2;
      scale.value = withDelay(order * 160, withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.4)) }));
    });
    return () => { live = false; cancelAnimation(scale); scale.value = 1; };
  }, [order, scale]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={style}>
      <Feather name="feather" size={14} color="#44633f" />
    </Animated.View>
  );
}
