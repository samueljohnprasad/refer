import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export const TimelineShimmer = () => {
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

  // Premium, shadow-none, flat editorial aesthetic
  return (
    <Animated.View style={animatedStyle} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-none">
      <View className="flex-row items-center mb-5">
        <View className="h-7 w-28 bg-gray-200 rounded-full" />
        <View className="h-7 w-16 bg-gray-200 rounded-full ml-auto" />
      </View>
      <View className="flex-col gap-3">
        <View className="h-4 w-full bg-gray-100 rounded-md" />
        <View className="h-4 w-11/12 bg-gray-100 rounded-md" />
        <View className="h-4 w-4/5 bg-gray-100 rounded-md" />
      </View>
    </Animated.View>
  );
};
