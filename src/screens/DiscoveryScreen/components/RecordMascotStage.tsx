import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Mascot } from "@/src/components/ui/Mascot";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";

// ponytail: calm mascot stage with gentle 3pt idle breathing float, disabled when reducedMotion
export const RecordMascotStage = React.memo(() => {
  const reducedMotion = useReducedMotion();
  const floatY = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) {
      floatY.value = 0;
      return;
    }
    // ponytail: subtle 3pt sine breathe over 2.4s gives calm organic life without distraction
    floatY.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 2400, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2400, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
  }, [floatY, reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <View className="items-center justify-center" pointerEvents="none">
      <Animated.View style={animatedStyle} className="items-center">
        <Mascot state="panda-notes" size={135} />
        {/* ponytail: grounding contact shadow gives Mochi physical presence on canvas */}
        <View className="w-20 h-2.5 rounded-full bg-black/[0.06] mt-0.5" />
      </Animated.View>
    </View>
  );
});

RecordMascotStage.displayName = "RecordMascotStage";
