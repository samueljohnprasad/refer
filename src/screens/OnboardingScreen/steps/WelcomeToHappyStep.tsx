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
      <View className="flex-1 items-center justify-center py-4">
        <MochiMascot expression="peaceful" size={160} delay={40} />

        <Animated.View
          entering={FadeIn.duration(200).delay(120)}
          className="mt-6 items-center"
        >
          <Text
            style={{ fontFamily: "CormorantSemiBold" }}
            className="text-center text-[30px] leading-tight text-ink"
          >
            Welcome to the Grove
          </Text>
          <Text className="mt-2.5 text-center text-sm leading-relaxed text-ink-soft">
            Your sanctuary begins now. {dailyGoal} minutes a day.{"\n"}
            Mochi will be here with you every step.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(200).delay(220)}
          className="mt-7 w-full rounded-2xl border border-sage-200/80 bg-sage-50/50 p-5 shadow-sm shadow-sage-900/5"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1.5">
              <HugeiconsIcon icon={WellnessIcon} size={16} color="#5F7F58" />
              <Text className="text-xs font-semibold tracking-wide text-sage-700">
                Today&apos;s session
              </Text>
            </View>
            <View className="rounded-full bg-sage-100/80 px-2.5 py-0.5">
              <Text className="text-[11px] font-medium text-sage-700">
                Day 1
              </Text>
            </View>
          </View>

          <Text className="mt-2.5 text-base font-semibold text-ink">
            Entering the Grove
          </Text>
          <Text className="mt-1 text-xs font-medium text-ink-soft">
            {planName} · {dailyGoal} min
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(200).delay(320)}
          className="mt-6 w-full rounded-xl border border-sage-100/70 bg-warm-white/90 px-4 py-3.5"
        >
          <Text className="text-center text-xs font-medium leading-relaxed text-ink-soft">
            &ldquo;Consistency matters more than perfection. Even a brief pause
            changes your trajectory.&rdquo;
          </Text>
          <Text className="mt-1.5 text-center text-[11px] font-semibold tracking-wide text-sage-600">
            MOCHI
          </Text>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default React.memo(WelcomeToHappyStep);
