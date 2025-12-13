import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

/**
 * Animated header section with motivational text
 */
export const NotificationHeader: React.FC = () => {
  const headerOpacity = useSharedValue(0);

  React.useEffect(() => {
    headerOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  return (
    <>
      {/* Header Text */}
      <Animated.View style={headerAnimatedStyle} className="mt-4">
        <Text className="text-center text-4xl font-cormorantSemiBold text-[#1f2937] leading-tight mb-3">
          Daily Reminders
        </Text>
        <Text className="text-center text-gray-600 text-lg leading-7 font-medium px-4">
          Set up gentle nudges to help you{"\n"}build a consistent journaling
          habit
        </Text>
      </Animated.View>

      {/* Stats Badge */}
      <Animated.View
        entering={FadeIn.duration(400).delay(400)}
        className="self-center mt-6 mb-2"
      >
        <View className="flex-row items-center px-6 py-3 bg-purple-50 rounded-full border border-purple-100">
          <Text className="text-2xl mr-2">⏰</Text>
          <Text className="text-base font-bold text-purple-700">
            3x more consistency
          </Text>
        </View>
      </Animated.View>

      {/* Usage Info */}
      <Animated.View
        entering={FadeIn.duration(400).delay(600)}
        className="px-8 mt-4 mb-6"
      >
        <Text className="text-center text-gray-500 text-sm leading-6 font-medium">
          Choose the times that work best for you. You can enable or disable
          reminders anytime.
        </Text>
      </Animated.View>
    </>
  );
};
