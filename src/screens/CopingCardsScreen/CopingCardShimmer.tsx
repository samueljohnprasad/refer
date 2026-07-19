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

export const CopingCardShimmer = () => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Matches CopingCardItem spacing
  return (
    <Animated.View style={animatedStyle} className="py-5 px-5">
      {/* Quiet metadata header */}
      <View className="flex-row items-center justify-between mb-3.5">
        <View className="flex-row items-center gap-1.5">
          <View className="h-[15px] w-[15px] bg-gray-200 rounded-[4px]" />
          <View className="h-[12px] w-[80px] bg-gray-200 rounded-[4px]" />
        </View>
        <View className="h-[12px] w-[40px] bg-gray-200 rounded-[4px]" />
      </View>

      {/* Reframe text hero (simulating ~3 lines of text) */}
      <View className="flex-col gap-2.5 mt-1">
        <View className="h-[16px] w-full bg-gray-100 rounded-[4px]" />
        <View className="h-[16px] w-11/12 bg-gray-100 rounded-[4px]" />
        <View className="h-[16px] w-4/5 bg-gray-100 rounded-[4px]" />
      </View>
    </Animated.View>
  );
};
