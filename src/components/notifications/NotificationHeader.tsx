import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Clock04Icon } from "@hugeicons/core-free-icons";
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
    // FIX #10: Reset to 0 first so animation replays on remount
    headerOpacity.value = 0;
    headerOpacity.value = withDelay(100, withTiming(1, { duration: 600 }));
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  return (
    <>
      {/* Header Text */}
      <Animated.View style={headerAnimatedStyle} className="mt-6">
        {/* FIX #4: Replaced cormorantSemiBold with system font-black for consistency */}
        <Text className="text-center text-3xl font-black text-gray-900 leading-tight mb-2">
          Daily Reminders
        </Text>
        {/* FIX #5: text-[15px] instead of text-lg — supporting copy should be smaller */}
        {/* FIX #6: Removed hard \"\\n\" — let text reflow naturally */}
        <Text className="text-center text-gray-500 text-[15px] leading-6 font-medium px-6">
          Set up gentle nudges to help you build a consistent journaling habit
        </Text>
      </Animated.View>

      {/* Stats Badge */}
      {/* FIX #7: Replaced emoji ⏰ with HugeiconsIcon for consistent rendering */}
      {/* FIX #8: Balanced icon size (16) and text size (text-sm) */}
      <Animated.View
        entering={FadeIn.duration(400).delay(300)}
        className="self-center mt-5 mb-1"
      >
        <View className="flex-row items-center gap-2 px-5 py-2.5 bg-violet-50 rounded-full border border-violet-100">
          <HugeiconsIcon
            icon={Clock04Icon}
            size={16}
            color="#7C3AED"
            strokeWidth={1.8}
          />
          <Text className="text-sm font-bold text-violet-700">
            3x more consistency
          </Text>
        </View>
      </Animated.View>

      {/* Usage Info */}
      {/* FIX #9: Reduced bottom margin from mb-6 to mb-4 — less wasted space before cards */}
      <Animated.View
        entering={FadeIn.duration(400).delay(450)}
        className="px-8 mt-4 mb-4"
      >
        <Text className="text-center text-gray-400 text-[13px] leading-5">
          Choose the times that work best for you. You can enable or disable
          reminders anytime.
        </Text>
      </Animated.View>
    </>
  );
};
