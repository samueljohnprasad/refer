import React, { useMemo } from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import MochiMascot from "../components/MochiMascot";
import { DailyGoalMinutes, StressTiming } from "../types";

interface LetterFromFutureStepProps {
  dailyGoal: DailyGoalMinutes;
  timing?: StressTiming;
}

const TIMING_LABELS: Record<StressTiming, string> = {
  morning: "mornings",
  afternoon: "afternoons",
  evening: "evenings",
  night: "late nights",
};

const LetterFromFutureStep: React.FC<LetterFromFutureStepProps> = ({
  dailyGoal,
  timing,
}) => {
  const futureDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  const timingLabel = timing ? TIMING_LABELS[timing] : "evenings";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6 pt-6"
    >
      <Animated.View
        entering={FadeIn.duration(180).delay(80)}
        className="items-center"
      >
        <View className="rounded-full bg-gold px-3 py-1.5">
          <Text className="text-[11px] font-extrabold uppercase tracking-widest text-sage-700">
            ✉️ A letter to you
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(180).delay(160)}
        className="relative mt-5 overflow-hidden rounded-2xl border border-sage-200 bg-warm-white p-6 shadow-sm"
      >
        <View className="absolute left-0 right-0 top-0 h-[3px] bg-sage-100/60" />

        <View className="absolute right-5 top-5 h-[38px] w-[38px] -rotate-[8deg] items-center justify-center rounded-full bg-terracotta shadow-sm">
          <Text
            style={{ fontFamily: "CormorantBold" }}
            className="text-base italic text-white"
          >
            H
          </Text>
        </View>

        <Text className="pr-12 text-[11px] font-medium tracking-wide text-ink-muted">
          {futureDate}
        </Text>

        <Text
          style={{ fontFamily: "CormorantMedium" }}
          className="mt-3.5 text-[17px] text-ink"
        >
          Dear you,
        </Text>

        <View className="mt-3.5">
          <Text
            style={{ fontFamily: "CormorantMedium" }}
            className="text-sm italic leading-[1.65] text-ink-soft"
          >
            You did it. You actually showed up — not once, but every single day
            for 30 days.
          </Text>
          <Text
            style={{ fontFamily: "CormorantMedium" }}
            className="mt-3 text-sm italic leading-[1.65] text-ink-soft"
          >
            Remember how heavy things felt when you started? The{" "}
            <Text className="font-semibold not-italic text-sage-600">
              {timingLabel}
            </Text>{" "}
            were the hardest. But you kept coming back.{" "}
            <Text className="font-semibold not-italic text-sage-600">
              {dailyGoal} minutes
            </Text>{" "}
            at a time.
          </Text>
          <Text
            style={{ fontFamily: "CormorantMedium" }}
            className="mt-3 text-sm italic leading-[1.65] text-ink-soft"
          >
            You're not the same person who opened this app a month ago. You're
            calmer. You notice your thoughts before they spiral. You have tools
            now.
          </Text>
          <Text
            style={{ fontFamily: "CormorantMedium" }}
            className="mt-3 text-sm italic leading-[1.65] text-ink-soft"
          >
            I'm proud of you.
          </Text>
        </View>

        <View className="my-4 h-[1px] bg-sage-200" />

        <View className="items-end">
          <Text
            style={{ fontFamily: "CormorantSemiBold" }}
            className="text-lg italic text-terracotta"
          >
            — You, in 30 days
          </Text>
          <Text className="mt-0.5 text-[11px] tracking-wide text-ink-muted">
            {futureDate}
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(180).delay(260)}
        className="mt-5 flex-row items-center gap-2.5"
      >
        <MochiMascot expression="peaceful" size={60} animate={false} />
        <Text
          style={{ fontFamily: "CormorantMedium" }}
          className="flex-1 text-[13px] italic leading-[1.4] text-ink-soft"
        >
          "Hold onto this. Some days you'll need to remember who you're
          becoming."
        </Text>
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(LetterFromFutureStep);
