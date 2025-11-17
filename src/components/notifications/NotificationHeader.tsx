import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import LottieView from "lottie-react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { notification } from "@/assets/lottie";

/**
 * Animated header section with Lottie animation and motivational text
 */
export const NotificationHeader: React.FC = () => {
  const headerOpacity = useSharedValue(0);
  const lottieScale = useSharedValue(0.8);

  React.useEffect(() => {
    headerOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    lottieScale.value = withDelay(
      300,
      withSpring(1, { damping: 12, stiffness: 80 })
    );
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const lottieAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: lottieScale.value }],
  }));

  return (
    <>
      {/* Lottie Animation */}
      <Animated.View className="items-center mt-1" style={lottieAnimatedStyle}>
        {/* <LottieView
          autoPlay
          loop
          style={{
            width: 120,
            height: 120,
          }}
          source={notification}
        /> */}
      </Animated.View>

      {/* Header Text */}
      <Animated.View style={headerAnimatedStyle}>
        <Text className="text-3xl font-extrabold text-center mt-2 text-gray-900 leading-9">
          Stay Consistent 🎯
        </Text>
        <Text className="text-center text-gray-600 text-base mt-3 leading-6 font-medium">
          Users who set reminders journal{`\n`}
          <Text className="text-purple-600 font-extrabold">
            3x more consistently
          </Text>
        </Text>
      </Animated.View>

      {/* Stats Badge */}
      <Animated.View
        entering={FadeIn.duration(400).delay(400)}
        className="self-center mt-4 mb-3"
      >
        <View className="flex-row items-center px-5 py-3 bg-purple-100 rounded-2xl">
          <Text className="text-xl mr-2">📈</Text>
          <Text className="text-sm font-bold text-purple-700">
            87% success rate
          </Text>
        </View>
      </Animated.View>
    </>
  );
};
