import React, { useEffect } from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, {
  FadeInUp,
  FadeInDown,
  SlideInRight,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from "react-native-reanimated";
import MochiMascot from "../components/MochiMascot";
import { PLAN_STATS } from "../constants";

interface PlanRevealStepProps {
  planName: string;
}

const AnimatedStat: React.FC<{
  value: string;
  label: string;
  index: number;
}> = ({ value, label, index }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      400 + index * 150,
      withSpring(1, { damping: 12, stiffness: 200 }),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [20, 0]) },
      { scale: interpolate(progress.value, [0, 0.5, 1], [0.8, 1.05, 1]) },
    ],
  }));

  return (
    <Animated.View style={style} className="min-w-[60px]">
      <Text
        style={{ fontFamily: "CormorantSemiBold" }}
        className="text-2xl text-gold"
      >
        {value}
      </Text>
      <Text className="text-[11px] uppercase tracking-wide text-white/70">
        {label}
      </Text>
    </Animated.View>
  );
};

const PlanRevealStep: React.FC<PlanRevealStepProps> = ({ planName }) => {
  const circleScale = useSharedValue(0.6);
  const circleRotate = useSharedValue(0);

  useEffect(() => {
    circleScale.value = withDelay(
      300,
      withSpring(1, { damping: 15, stiffness: 100 }),
    );
    circleRotate.value = withRepeat(
      withSequence(
        withTiming(6, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(-6, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      ),
      0,
      true,
    );
  }, []);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: circleScale.value },
      { rotate: `${circleRotate.value}deg` },
    ],
  }));

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
      className="flex-1 px-6 pt-6"
    >
      <Animated.View entering={FadeInUp.delay(100).duration(600)}>
        <Text className="text-xs font-semibold uppercase tracking-widest text-gold">
          Your first journey
        </Text>
        <Text
          style={{ fontFamily: "CormorantSemiBold" }}
          className="mt-2 text-[28px] leading-[1.15] text-ink"
        >
          {planName}
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(300).duration(600)}
        className="mt-5 overflow-hidden rounded-3xl bg-sage-700 p-6"
      >
        <Animated.View
          style={[circleStyle, { position: "absolute", right: -48, top: -48 }]}
          className="h-36 w-36 rounded-full bg-gold/30"
        />
        <Text className="text-[11px] font-bold uppercase tracking-[0.15em] text-gold">
          Personalized Plan
        </Text>
        <Text
          style={{ fontFamily: "CormorantSemiBold" }}
          className="relative mt-2 text-[26px] leading-[1.15] text-white"
        >
          {planName}
        </Text>
        <View className="relative mt-4 flex-row flex-wrap gap-4">
          {PLAN_STATS.map((stat, index) => (
            <AnimatedStat
              key={stat.label}
              value={stat.value}
              label={stat.label}
              index={index}
            />
          ))}
        </View>
      </Animated.View>

      <Animated.View
        entering={SlideInRight.delay(600).duration(500)}
        className="mt-5 rounded-[20px] border-2 border-sage-200 bg-cream p-5"
      >
        <Text className="text-[11px] font-bold uppercase tracking-wider text-terracotta">
          📈 What people like you report
        </Text>
        <Text
          style={{ fontFamily: "CormorantMedium" }}
          className="mt-2 text-[17px] leading-[1.3] text-ink"
        >
          Mood clarity improves by{" "}
          <Text className="italic text-sage-600">+62%</Text> over 30 days
        </Text>
        <Text className="mt-3 text-[10px] italic text-ink-muted">
          Based on self-reported clarity scores from 3,847 Happy users over
          their first 30 days. Individual results vary.
        </Text>
      </Animated.View>

      <Animated.View
        entering={SlideInRight.delay(800).duration(500)}
        className="mt-5 flex-row items-center gap-3 rounded-2xl bg-sage-800 p-4"
      >
        <MochiMascot expression="happy" size={50} animate={false} />
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <View className="rounded-full bg-gold px-2 py-0.5">
              <Text className="text-[10px] font-extrabold uppercase text-sage-700">
                ✨ New · AI Companion
              </Text>
            </View>
          </View>
          <Text className="mt-1 text-xs text-white/85">
            After every entry, Mochi shares an AI-powered insight about your
            patterns.
          </Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(PlanRevealStep);
