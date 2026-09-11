import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, ScrollView, Platform } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { MotivationAnswer, StressLevel } from "../types";

interface PlanRevealStepProps {
  planName: string;
  motivation?: MotivationAnswer;
  stressLevel?: StressLevel;
}

const PLAN_META: Record<
  MotivationAnswer,
  {
    subtitle: string;
    practiceItems: readonly string[];
  }
> = {
  anxiety: {
    subtitle: "From racing thoughts to steadier ground.",
    practiceItems: [
      "Understanding the anxiety loop",
      "Settling the body’s alert response",
      "Catching patterns earlier",
    ],
  },
  mood: {
    subtitle: "From heavy days to steadier light.",
    practiceItems: [
      "Identifying subtle mood triggers",
      "Practicing tiny daily anchors",
      "Finding steadier responses to hard moments",
    ],
  },
  stress: {
    subtitle: "From pressure to steadier ground.",
    practiceItems: [
      "Recognizing tension before it peaks",
      "Decompressing the nervous system",
      "Resetting when pressure mounts",
    ],
  },
  self_understanding: {
    subtitle: "From confusion to clearer patterns.",
    practiceItems: [
      "Uncovering repetitive thought loops",
      "Naming what you actually feel",
      "Aligning daily choices with your needs",
    ],
  },
  sleep: {
    subtitle: "From restless nights to gentler wind-downs.",
    practiceItems: [
      "Quieting late-night racing thoughts",
      "Releasing physical tension before bed",
      "Creating a predictable wind-down rhythm",
    ],
  },
};

function getWhyThisCourse(
  motivation: MotivationAnswer,
  stressLevel?: StressLevel,
): string {
  switch (motivation) {
    case "anxiety":
      if (stressLevel === "heavy") {
        return "You told us anxiety feels like a constant weight, so we’ll start with understanding what keeps the alert system switched on and making it easier to settle.";
      }
      if (stressLevel === "moderate") {
        return "You told us anxiety feels like regular tension, so we’ll start with understanding what keeps the alert system switched on and making it easier to settle.";
      }
      if (stressLevel === "overwhelming") {
        return "You told us anxiety feels like it takes over some days, so we’ll start with understanding the alert response and giving you tools to find space.";
      }
      return "Based on what you shared, we’ll start by helping you understand what keeps the alert system switched on and practice ways to settle it.";
    case "mood":
      return "Based on what you shared, we’ll start with small anchors that help you notice what lifts your day.";
    case "stress":
      return "Based on what you shared, we’ll focus on catching pressure before it builds up and giving your nervous system room to decompress.";
    case "self_understanding":
      return "Based on what you shared, we’ll help you decode emotional patterns and find clearer language for what you experience.";
    case "sleep":
      return "Based on what you shared, we’ll focus on evening unwinding practices to help your body signal safety before bed.";
    default:
      return "Based on what you shared, we’ll start with foundational practices tailored to where you are right now.";
  }
}

const PlanRevealStep: React.FC<PlanRevealStepProps> = ({
  planName,
  motivation = "anxiety",
  stressLevel,
}) => {
  const insets = useSafeAreaInsets();
  const planMeta = PLAN_META[motivation];
  const displayPlanName = planName.replace(/\.$/, "");
  const contentTopPadding = Platform.OS === "ios" ? 100 : insets.top + 100;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 120,
        paddingTop: contentTopPadding,
      }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6"
    >
      <Animated.View entering={FadeIn.duration(160).delay(60)}>
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
          className="text-xs font-semibold uppercase tracking-wider text-sage-600"
        >
          Built around your goal
        </Text>
      </Animated.View>

      {/* Hero Course Card */}
      <Animated.View entering={FadeInDown.duration(220).delay(120)}>
        <LinearGradient
          colors={["#243e26", "#182c19"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            marginTop: 12,
            overflow: "hidden",
            borderRadius: 20,
            borderCurve: "continuous",
            paddingHorizontal: 22,
            paddingVertical: 24,
            borderWidth: 1,
            borderColor: "rgba(95, 127, 88, 0.25)",
          }}
        >
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.bold }}
            className="text-[26px] leading-[1.15] text-white"
          >
            {displayPlanName}
          </Text>

          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.regular }}
            className="mt-2 text-[15px] leading-relaxed text-white/80"
          >
            {planMeta.subtitle}
          </Text>

          <View className="mt-5 flex-row items-center border-t border-white/10 pt-4">
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
              className="text-xs font-semibold tracking-wide text-sage-200"
            >
              7 days · about 5 min/day
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Why This Course - Open content */}
      <Animated.View entering={FadeIn.duration(180).delay(220)} className="mt-7">
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
          className="text-xs font-semibold uppercase tracking-wider text-sage-600"
        >
          Why this course
        </Text>
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.regular }}
          className="mt-2 text-[15px] leading-relaxed text-ink"
        >
          {getWhyThisCourse(motivation, stressLevel)}
        </Text>
      </Animated.View>

      {/* You'll Practice - Open content */}
      <Animated.View entering={FadeIn.duration(180).delay(280)} className="mt-6">
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
          className="text-xs font-semibold uppercase tracking-wider text-sage-600"
        >
          You’ll practice
        </Text>
        <View className="mt-3 gap-2.5">
          {planMeta.practiceItems.map((item, idx) => (
            <View key={idx} className="flex-row items-start gap-3">
              <View className="mt-2 h-1.5 w-1.5 rounded-full bg-sage-500" />
              <Text
                style={{ fontFamily: APP_FONT_FAMILIES.regular }}
                className="flex-1 text-[15px] leading-relaxed text-ink"
              >
                {item}
              </Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(PlanRevealStep);
