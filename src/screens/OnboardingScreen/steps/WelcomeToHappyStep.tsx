import React from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import MochiMascot from "../components/MochiMascot";
import { DailyGoalMinutes } from "../types";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { WellnessIcon } from "@hugeicons/core-free-icons";

interface WelcomeToHappyStepProps {
  planName: string;
  dailyGoal: DailyGoalMinutes;
}

const WelcomeToHappyStep: React.FC<WelcomeToHappyStepProps> = ({
  planName,
  dailyGoal,
}) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6"
    >
      <View className="flex-1 items-center justify-center">
        <MochiMascot expression="peaceful" size={160} delay={40} />

        <Animated.View
          entering={FadeIn.duration(180).delay(120)}
          className="mt-6 items-center"
        >
          <View className="flex-row items-center gap-1.5 justify-center">
            <Text
              style={{ fontFamily: "CormorantSemiBold" }}
              className="text-[28px] text-ink"
            >
              Welcome to the Grove
            </Text>
            <HugeiconsIcon icon={WellnessIcon} size={24} color="#5F7F58" />
          </View>
          <Text className="mt-3 text-center text-sm leading-relaxed text-ink-soft">
            Your journey begins now. {dailyGoal} minutes a day.{"\n"}Mochi will
            be here every step.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(180).delay(220)}
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
          entering={FadeIn.duration(180).delay(320)}
          style={{ fontFamily: "CormorantMedium" }}
          className="mt-6 text-center text-sm italic text-ink-soft"
        >
          Until tomorrow, friend.{"\n"}
          <Text className="not-italic">— Mochi</Text>
        </Animated.Text>
      </View>
    </ScrollView>
  );
};

export default React.memo(WelcomeToHappyStep);
