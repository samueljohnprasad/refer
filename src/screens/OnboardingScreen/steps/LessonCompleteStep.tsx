import React, { useEffect } from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, {
  FadeInUp,
  FadeInDown,
  BounceIn,
  ZoomIn,
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
import ConfettiBurst from "../components/ConfettiBurst";

const LessonCompleteStep: React.FC = () => {
  const streakGlow = useSharedValue(0.8);

  useEffect(() => {
    streakGlow.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.8, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        ),
        0,
        true,
      ),
    );
  }, []);

  const streakStyle = useAnimatedStyle(() => ({
    opacity: streakGlow.value,
  }));

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
      className="flex-1 px-6"
    >
      <View className="flex-1 items-center justify-center">
        <View className="items-center justify-center">
          <ConfettiBurst />
          <MochiMascot expression="celebrating" size={140} delay={0} />
        </View>

        <Animated.View
          entering={FadeInUp.delay(200).duration(500)}
          className="mt-4 items-center"
        >
          <Text
            style={{ fontFamily: "CormorantSemiBold" }}
            className="text-[28px] text-ink"
          >
            Lesson complete!
          </Text>
          <Text className="mt-2 text-center text-sm text-ink-soft">
            You showed up. That's the whole thing.
          </Text>
        </Animated.View>

        <Animated.View
          entering={BounceIn.delay(500).duration(600)}
          className="mt-6"
        >
          <View className="rounded-full bg-gold px-5 py-2.5">
            <Text className="text-lg font-bold text-sage-700">+20 XP</Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(700).duration(500)}
          className="mt-8 w-full flex-row justify-center gap-4"
        >
          <Animated.View
            entering={ZoomIn.delay(800).duration(400)}
            style={streakStyle}
            className="items-center rounded-2xl border border-sage-100 bg-warm-white px-5 py-3"
          >
            <Text className="text-lg font-bold text-terracotta">🔥 1</Text>
            <Text className="text-[10px] uppercase text-ink-muted">
              Day streak
            </Text>
          </Animated.View>
          <Animated.View
            entering={ZoomIn.delay(900).duration(400)}
            className="items-center rounded-2xl border border-sage-100 bg-warm-white px-5 py-3"
          >
            <Text className="text-lg font-bold text-sage-600">7%</Text>
            <Text className="text-[10px] uppercase text-ink-muted">
              Journey
            </Text>
          </Animated.View>
          <Animated.View
            entering={ZoomIn.delay(1000).duration(400)}
            className="items-center rounded-2xl border border-sage-100 bg-warm-white px-5 py-3"
          >
            <Text className="text-lg font-bold text-sage-600">1/14</Text>
            <Text className="text-[10px] uppercase text-ink-muted">
              Lessons
            </Text>
          </Animated.View>
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.delay(1200).duration(400)}
          className="mt-6 text-center text-xs italic text-ink-muted"
        >
          Five minutes. Just like you said.
        </Animated.Text>
      </View>
    </ScrollView>
  );
};

export default React.memo(LessonCompleteStep);
