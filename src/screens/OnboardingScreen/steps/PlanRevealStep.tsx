import React, { useEffect } from "react";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "expo-router/react-navigation";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient as SvgLinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from "react-native-svg";

import { PLAN_STATS } from "../constants";
import { MotivationAnswer } from "../types";
import { StackedCarousel } from "../../../animations/stacked-carousel";
import { useWindowDimensions } from "react-native";
import { getScaledLayout } from "./progress-graph-victory/layout";
import ProgressGraphVictoryChart from "./progress-graph-victory/ProgressGraphVictoryChart";
import { useProgressGraphVictoryAnimation } from "./progress-graph-victory/useProgressGraphVictoryAnimation";
import TestimonialCard from "../components/TestimonialCard";
import ConfettiBurst from "../components/ConfettiBurst";

interface PlanRevealStepProps {
  planName: string;
  motivation?: MotivationAnswer;
}

const PLAN_META: Record<
  MotivationAnswer,
  {
    subtitle: string;
    testimonial: string;
    testimonialInitial: string;
    learnItems: Array<{ step: string; title: string; subtitle: string }>;
  }
> = {
  anxiety: {
    subtitle: "From racing thoughts to steady ground.",
    testimonial:
      "\"The AI noticed I was using 'should' 40 times a week. Therapy never caught that. Now I notice it before I write it.\"",
    testimonialInitial: "J",
    learnItems: [
      {
        step: "1",
        title: "Naming the feeling",
        subtitle: "Day 1 — Foundation",
      },
      {
        step: "2",
        title: "The thought spiral",
        subtitle: "Day 2 — Cognitive distortions",
      },
      {
        step: "3",
        title: "Body as compass",
        subtitle: "Day 3 — Somatic awareness",
      },
    ],
  },
  mood: {
    subtitle: "From heavy days to steadier light.",
    testimonial:
      "\"The reflection helped me notice what quietly lifts me before my mood drops all the way.\"",
    testimonialInitial: "M",
    learnItems: [
      {
        step: "1",
        title: "Naming the feeling",
        subtitle: "Day 1 — Emotional clarity",
      },
      {
        step: "2",
        title: "Tiny lifts",
        subtitle: "Day 2 — Mood anchors",
      },
      {
        step: "3",
        title: "Body as compass",
        subtitle: "Day 3 — Somatic awareness",
      },
    ],
  },
  stress: {
    subtitle: "From pressure to steadier ground.",
    testimonial:
      "\"I stopped waiting until I was overwhelmed. The app helped me catch stress while it was still workable.\"",
    testimonialInitial: "A",
    learnItems: [
      {
        step: "1",
        title: "Naming the feeling",
        subtitle: "Day 1 — Foundation",
      },
      {
        step: "2",
        title: "Pressure points",
        subtitle: "Day 2 — Stress patterns",
      },
      {
        step: "3",
        title: "Body as compass",
        subtitle: "Day 3 — Somatic awareness",
      },
    ],
  },
  self_understanding: {
    subtitle: "From confusion to clearer patterns.",
    testimonial:
      "\"I thought I needed more discipline. Turns out I needed language for what I was actually feeling.\"",
    testimonialInitial: "R",
    learnItems: [
      {
        step: "1",
        title: "Naming the feeling",
        subtitle: "Day 1 — Foundation",
      },
      {
        step: "2",
        title: "The thought spiral",
        subtitle: "Day 2 — Pattern spotting",
      },
      {
        step: "3",
        title: "Body as compass",
        subtitle: "Day 3 — Somatic awareness",
      },
    ],
  },
  sleep: {
    subtitle: "From restless nights to gentler wind-downs.",
    testimonial:
      "\"I finally noticed my evenings had a shape. Once I could see it, I could change it.\"",
    testimonialInitial: "S",
    learnItems: [
      {
        step: "1",
        title: "Naming the feeling",
        subtitle: "Day 1 — Nervous system check-in",
      },
      {
        step: "2",
        title: "The evening spiral",
        subtitle: "Day 2 — Thought patterns",
      },
      {
        step: "3",
        title: "Body as compass",
        subtitle: "Day 3 — Wind-down cues",
      },
    ],
  },
};

const ProjectionGraph: React.FC = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isCompactScreen = screenWidth < 390 || screenHeight < 880;
  const horizontalPadding = isCompactScreen ? 12 : 16;
  const maxCardWidth = isCompactScreen ? 332 : 352;
  const cardWidth = Math.max(
      Math.min(screenWidth - horizontalPadding * 2 - 8, maxCardWidth),
      288,
  );
  const cardHeight = cardWidth * (isCompactScreen ? 0.87 : 0.9);
  const scale = cardWidth / 320;
  const chartHeight = cardHeight * (isCompactScreen ? 0.68 : 0.72);
  const baseLayout = getScaledLayout({
      scale,
      cardWidth,
      cardHeight,
      chartHeight,
      isCompact: isCompactScreen,
  });
  const layout = {
      ...baseLayout,
      chartContainerStyle: {
          ...baseLayout.chartContainerStyle,
          position: "relative" as const,
          left: 0,
          right: 0,
          top: 0,
          marginTop: 16,
          marginBottom: 16,
      }
  };
  const animationState = useProgressGraphVictoryAnimation();

  return (
    <View>
      <ProgressGraphVictoryChart
        comparisonDashOpacity={animationState.comparisonDashOpacity}
        comparisonDotOpacity={animationState.comparisonDotOpacity}
        comparisonProjectionEnd={animationState.comparisonProjectionEnd}
        endDotOpacity={animationState.endDotOpacity}
        happyProjectionEnd={animationState.happyProjectionEnd}
        layout={layout}
        startDotOpacity={animationState.startDotOpacity}
      />

      <View
        style={{
          marginTop: 8,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: "#D3E0CD",
          borderStyle: "dashed",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              backgroundColor: "#5F7F58",
            }}
          />
          <Text
            style={{ fontFamily: "GeistMedium" }}
            className="text-[11px] text-ink-muted"
          >
            With Happy
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              backgroundColor: "#E5EDE1",
              borderWidth: 1,
              borderColor: "#A8B89A",
              borderStyle: "dashed",
            }}
          />
          <Text
            style={{ fontFamily: "GeistMedium" }}
            className="text-[11px] text-ink-muted"
          >
            Without journaling
          </Text>
        </View>
      </View>

      <Text
        style={{ fontFamily: "GeistRegular" }}
        className="mt-2 text-[10px] italic leading-[1.4] text-ink-muted"
      >
        Based on self-reported clarity scores from{" "}
        <Text style={{ fontFamily: "GeistSemiBold" }}>3,847 Happy users</Text>{" "}
        over their first 30 days. Individual results vary.
      </Text>
    </View>
  );
};

const PlanRevealStep: React.FC<PlanRevealStepProps> = ({
  planName,
  motivation = "anxiety",
}) => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const planMeta = PLAN_META[motivation];
  const displayPlanName = planName.endsWith(".") ? planName : `${planName}.`;

  useEffect(() => {
    // Slight delay to align with the animation sequence
    const timer = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 144, paddingTop: headerHeight - insets.top }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6 pt-4"
    >
      <Animated.View entering={FadeIn.duration(180).delay(80)}>
        <View className="flex-row items-center">
          <Text
            style={{ fontFamily: "GeistSemiBold" }}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta"
          >
            Built for you
          </Text>
          <View className="absolute left-[120px] top-[-10px] z-10">
            <ConfettiBurst />
          </View>
        </View>
        <Text
          style={{ fontFamily: "CormorantRegular" }}
          className="mt-3 text-[28px] leading-[1.08] text-ink"
        >
          Your first journey:{"\n"}
          <Text
            style={{
              fontFamily: "CormorantRegularItalic",
              color: "#5F7F58",
            }}
          >
            {displayPlanName}
          </Text>
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(180).delay(160)}
        className="mt-4 rounded-2xl border-2 border-sage-200 bg-cream px-[18px] py-5"
      >
        <Text
          style={{ fontFamily: "CormorantSemiBold" }}
          className="mb-2 text-[20px] leading-[1.3] text-ink"
        >
          Projected path
        </Text>
        <Text
          style={{ fontFamily: "CormorantRegular" }}
          className="text-[17px] leading-[1.35] text-ink"
        >
          Your projected{" "}
          <Text
            style={{
              fontFamily: "CormorantRegularItalic",
              color: "#5F7F58",
            }}
          >
            mood clarity
          </Text>{" "}
          over 30 days
        </Text>
        <ProjectionGraph />
      </Animated.View>

      <Animated.View entering={FadeIn.duration(180).delay(240)}>
        <LinearGradient
          colors={["#44633F", "#29452A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            marginTop: 12,
            overflow: "hidden",
            borderRadius: 16,
            borderCurve: "continuous",
            paddingHorizontal: 24,
            paddingVertical: 28,
          }}
        >
          <View
            style={{
              position: "absolute",
              right: -34,
              top: -30,
              width: 108,
              height: 108,
              borderRadius: 999,
              backgroundColor: "rgba(212, 169, 67, 0.25)",
            }}
          />
          <Text
            style={{ fontFamily: "GeistMedium" }}
            className="text-[15px] text-gold/90"
          >
            7-Day Foundation Journey
          </Text>
          <Text
            style={{ fontFamily: "CormorantRegular" }}
            className="mt-2 text-[26px] leading-[1.15] text-white"
          >
            {planMeta.subtitle}
          </Text>

          <View className="mt-5 flex-row flex-wrap">
            {PLAN_STATS.map((stat) => (
              <View key={stat.label} className="mb-4 w-1/2 pr-3">
                <Text
                  style={{ fontFamily: "CormorantSemiBold" }}
                  className="text-2xl text-gold"
                >
                  {stat.value}
                </Text>
                <Text
                  style={{ fontFamily: "GeistMedium" }}
                  className="mt-0.5 text-[11px] uppercase tracking-[0.05em] text-white/70"
                >
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(180).delay(320)}>
        <LinearGradient
          colors={["#29452A", "#142414"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            marginTop: 16,
            overflow: "hidden",
            borderRadius: 16,
            borderCurve: "continuous",
            paddingHorizontal: 16,
            paddingVertical: 14,
          }}
        >
          <View
            style={{
              position: "absolute",
              right: -18,
              top: -18,
              width: 92,
              height: 92,
              borderRadius: 999,
              backgroundColor: "rgba(212, 169, 67, 0.24)",
            }}
          />
          <View
            style={{
              alignSelf: "flex-start",
              borderRadius: 999,
              borderCurve: "continuous",
              backgroundColor: "#D4A943",
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Text
              style={{ fontFamily: "GeistSemiBold" }}
              className="text-[12px] text-sage-800"
            >
              New · AI Companion
            </Text>
          </View>
          <Text
            style={{ fontFamily: "CormorantRegular" }}
            className="mt-4 text-[16px] leading-[1.3] text-white"
          >
            Mochi learns your patterns & reflects them back.
          </Text>
          <Text
            style={{ fontFamily: "GeistRegular" }}
            className="mt-2 text-[12px] leading-[1.4] text-white/85"
          >
            After every journal entry, get an AI insight written just for you.
            Spot the patterns you can&apos;t see.
          </Text>
        </LinearGradient>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(180).delay(400)} className="mt-4">
        <TestimonialCard
          initial={planMeta.testimonialInitial}
          name="Jordan"
          age={35}
          quote={planMeta.testimonial.replace(/^"|"$/g, "")}
          tone="sky"
        />
      </Animated.View>

      <Animated.View entering={FadeIn.duration(180).delay(480)} className="mt-5">
        <Text
          style={{ fontFamily: "CormorantSemiBold" }}
          className="mb-4 text-[22px] text-ink"
        >
          What you'll learn
        </Text>
        <View className="gap-2.5">
          {planMeta.learnItems.map((item) => (
            <View
              key={item.step}
              className="flex-row items-center gap-3 rounded-2xl border-2 border-sage-100 bg-warm-white px-4 py-3.5"
            >
              <View className="h-9 w-9 items-center justify-center rounded-full bg-sage-500">
                <Text
                  style={{ fontFamily: "GeistBold" }}
                  className="text-sm text-white"
                >
                  {item.step}
                </Text>
              </View>
              <View className="flex-1">
                <Text
                  style={{ fontFamily: "GeistSemiBold" }}
                  className="text-[14px] text-ink"
                >
                  {item.title}
                </Text>
                <Text
                  style={{ fontFamily: "GeistRegular" }}
                  className="mt-0.5 text-[12px] text-ink-muted"
                >
                  {item.subtitle}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(PlanRevealStep);
