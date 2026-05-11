import React, { useEffect } from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, {
  FadeInUp,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import MochiMascot from "../components/MochiMascot";

const WelcomeStep: React.FC = () => {
  const titleScale = useSharedValue(0.8);
  const titleOpacity = useSharedValue(0);
  const badgeSlide = useSharedValue(20);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    titleScale.value = withDelay(
      300,
      withSpring(1, { damping: 12, stiffness: 150 }),
    );
    titleOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    badgeSlide.value = withDelay(
      500,
      withSpring(0, { damping: 15, stiffness: 200 }),
    );

    shimmer.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        ),
        0,
        true,
      ),
    );
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
    opacity: titleOpacity.value,
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: badgeSlide.value }],
    opacity: withTiming(badgeSlide.value === 0 ? 1 : 0, { duration: 300 }),
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: 0.3 + shimmer.value * 0.4,
  }));

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
      className="flex-1 px-6"
    >
      <View className="flex-1 items-center justify-center pt-12">
        <MochiMascot expression="happy" size={180} delay={0} />

        <Animated.View style={titleStyle} className="items-center">
          <Text
            style={{ fontFamily: "CormorantBold" }}
            className="mt-6 text-5xl tracking-tight text-sage-700"
          >
            Happy
          </Text>
          <Text
            style={{ fontFamily: "CormorantMedium" }}
            className="mt-2 text-lg italic text-sage-500"
          >
            AI Journal & CBT
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(500).duration(500)}
          className="mt-8 items-center"
        >
          <Animated.View
            style={shimmerStyle}
            className="flex-row items-center gap-1.5 rounded-full border border-sage-200 bg-sage-50 px-3 py-1.5"
          >
            <Text className="text-[11px] font-semibold text-sage-700">
              🛡️ CBT-informed · End-to-end encrypted
            </Text>
          </Animated.View>

          <Animated.Text
            entering={FadeInDown.delay(700).duration(400)}
            className="mt-4 text-center text-xs italic text-ink-muted"
          >
            Built for the days you don't want to open it.
          </Animated.Text>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default React.memo(WelcomeStep);
