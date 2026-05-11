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
  interpolate,
} from "react-native-reanimated";
import MochiMascot from "../components/MochiMascot";
import { DailyGoalMinutes } from "../types";

interface WelcomeToHappyStepProps {
  planName: string;
  dailyGoal: DailyGoalMinutes;
}

const WelcomeToHappyStep: React.FC<WelcomeToHappyStepProps> = ({
  planName,
  dailyGoal,
}) => {
  const cardSlide = useSharedValue(30);
  const cardOpacity = useSharedValue(0);
  const leafFloat = useSharedValue(0);

  useEffect(() => {
    cardSlide.value = withDelay(
      500,
      withSpring(0, { damping: 15, stiffness: 180 }),
    );
    cardOpacity.value = withDelay(500, withTiming(1, { duration: 400 }));

    leafFloat.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        ),
        0,
        true,
      ),
    );
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardSlide.value }],
    opacity: cardOpacity.value,
  }));

  const leafStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(leafFloat.value, [0, 1], [-3, 3])}deg` },
      { translateY: interpolate(leafFloat.value, [0, 1], [0, -3]) },
    ],
  }));

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
      className="flex-1 px-6"
    >
      <View className="flex-1 items-center justify-center">
        <MochiMascot expression="peaceful" size={160} delay={0} />

        <Animated.View
          entering={FadeInUp.delay(200).duration(500)}
          className="mt-6 items-center"
        >
          <Animated.Text
            style={[{ fontFamily: "CormorantSemiBold" }, leafStyle]}
            className="text-[28px] text-ink"
          >
            Welcome to the Grove 🌿
          </Animated.Text>
          <Text className="mt-3 text-center text-sm leading-relaxed text-ink-soft">
            Your journey begins now. {dailyGoal} minutes a day.{"\n"}Mochi will
            be here every step.
          </Text>
        </Animated.View>

        <Animated.View
          style={cardStyle}
          className="mt-6 w-full rounded-2xl border border-sage-100 bg-warm-white p-5"
        >
          <Text className="text-xs font-bold uppercase tracking-wider text-sage-500">
            Up next · Tomorrow
          </Text>
          <Text
            style={{ fontFamily: "CormorantMedium" }}
            className="mt-2 text-lg text-ink"
          >
            Day 2: The Thought Spiral
          </Text>
          <Text className="mt-1 text-xs text-ink-muted">
            {planName} · {dailyGoal} min
          </Text>
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.delay(800).duration(400)}
          style={{ fontFamily: "CormorantMedium" }}
          className="mt-6 text-center text-sm italic text-ink-soft"
        >
          Until tomorrow, friend.{"\n"}
          <Text className="not-italic">— Mochi 🐼</Text>
        </Animated.Text>
      </View>
    </ScrollView>
  );
};

export default React.memo(WelcomeToHappyStep);
