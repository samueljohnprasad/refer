import React from "react";
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
  return (
    <View style={{ marginTop: 10 }}>
      <Svg width="100%" height={148} viewBox="0 0 320 140">
        <Defs>
          <SvgLinearGradient id="planProjectionGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#7E9874" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#7E9874" stopOpacity="0" />
          </SvgLinearGradient>
        </Defs>

        <SvgText
          x="6"
          y="22"
          fill="#7D8D7B"
          fontSize="10"
          fontFamily="GeistMedium"
        >
          High
        </SvgText>
        <SvgText
          x="6"
          y="120"
          fill="#7D8D7B"
          fontSize="10"
          fontFamily="GeistMedium"
        >
          Low
        </SvgText>

        <Line
          x1="35"
          y1="20"
          x2="305"
          y2="20"
          stroke="#E5EDE1"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
        <Line
          x1="35"
          y1="60"
          x2="305"
          y2="60"
          stroke="#E5EDE1"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
        <Line
          x1="35"
          y1="100"
          x2="305"
          y2="100"
          stroke="#E5EDE1"
          strokeWidth="1"
          strokeDasharray="2 3"
        />

        <Path
          d="M 35 95 L 305 92"
          fill="none"
          stroke="#D3E0CD"
          strokeWidth="2.5"
          strokeDasharray="4 4"
        />
        <Path
          d="M 35 100 Q 80 95 110 85 T 180 60 T 250 35 L 305 22 L 305 120 L 35 120 Z"
          fill="url(#planProjectionGradient)"
        />
        <Path
          d="M 35 100 Q 80 95 110 85 T 180 60 T 250 35 L 305 22"
          fill="none"
          stroke="#5F7F58"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <Circle cx="35" cy="100" r="4" fill="#5F7F58" stroke="#FFFFFF" strokeWidth="2.5" />
        <Circle cx="110" cy="85" r="4" fill="#5F7F58" stroke="#FFFFFF" strokeWidth="2.5" />
        <Circle cx="180" cy="60" r="4" fill="#5F7F58" stroke="#FFFFFF" strokeWidth="2.5" />
        <Circle cx="250" cy="35" r="4" fill="#5F7F58" stroke="#FFFFFF" strokeWidth="2.5" />
        <Circle cx="305" cy="22" r="5" fill="#D4A943" stroke="#FFFFFF" strokeWidth="3" />

        <SvgText
          x="35"
          y="135"
          textAnchor="start"
          fill="#7D8D7B"
          fontSize="10"
          fontFamily="GeistMedium"
        >
          Day 1
        </SvgText>
        <SvgText
          x="110"
          y="135"
          textAnchor="middle"
          fill="#7D8D7B"
          fontSize="10"
          fontFamily="GeistMedium"
        >
          7
        </SvgText>
        <SvgText
          x="180"
          y="135"
          textAnchor="middle"
          fill="#7D8D7B"
          fontSize="10"
          fontFamily="GeistMedium"
        >
          14
        </SvgText>
        <SvgText
          x="250"
          y="135"
          textAnchor="middle"
          fill="#7D8D7B"
          fontSize="10"
          fontFamily="GeistMedium"
        >
          21
        </SvgText>
        <SvgText
          x="305"
          y="135"
          textAnchor="end"
          fill="#7D8D7B"
          fontSize="10"
          fontFamily="GeistMedium"
        >
          Day 30
        </SvgText>

        <SvgText
          x="305"
          y="14"
          textAnchor="end"
          fill="#29452A"
          fontSize="12"
          fontFamily="FrauncesSemiBold"
        >
          +62%
        </SvgText>
      </Svg>

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
  const planMeta = PLAN_META[motivation];
  const displayPlanName = planName.endsWith(".") ? planName : `${planName}.`;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 144 }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6 pt-4"
    >
      <Animated.View entering={FadeIn.duration(180).delay(80)}>
        <Text
          style={{ fontFamily: "GeistSemiBold" }}
          className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta"
        >
          Built for you ✨
        </Text>
        <Text
          style={{ fontFamily: "FrauncesRegular" }}
          className="mt-3 text-[28px] leading-[1.08] text-ink"
        >
          Your first journey:{"\n"}
          <Text
            style={{
              fontFamily: "FrauncesRegularItalic",
              color: "#5F7F58",
            }}
          >
            {displayPlanName}
          </Text>
        </Text>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(180).delay(160)}>
        <LinearGradient
          colors={["#44633F", "#29452A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            marginTop: 16,
            overflow: "hidden",
            borderRadius: 24,
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
            style={{ fontFamily: "GeistBold" }}
            className="text-[11px] uppercase tracking-[0.15em] text-gold"
          >
            7-Day Foundation Journey
          </Text>
          <Text
            style={{ fontFamily: "FrauncesRegular" }}
            className="mt-2 text-[26px] leading-[1.15] text-white"
          >
            {planMeta.subtitle}
          </Text>

          <View className="mt-5 flex-row flex-wrap">
            {PLAN_STATS.map((stat) => (
              <View key={stat.label} className="mb-4 w-1/2 pr-3">
                <Text
                  style={{ fontFamily: "FrauncesSemiBold" }}
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

      <Animated.View
        entering={FadeIn.duration(180).delay(240)}
        className="mt-3 rounded-[20px] border-2 border-sage-200 bg-cream px-[18px] py-5"
      >
        <Text
          style={{ fontFamily: "GeistBold" }}
          className="text-[11px] uppercase tracking-[0.1em] text-terracotta"
        >
          📈 What people like you report
        </Text>
        <Text
          style={{ fontFamily: "FrauncesRegular" }}
          className="mt-1.5 text-[17px] leading-[1.35] text-ink"
        >
          Your projected{" "}
          <Text
            style={{
              fontFamily: "FrauncesRegularItalic",
              color: "#5F7F58",
            }}
          >
            mood clarity
          </Text>{" "}
          over 30 days
        </Text>
        <ProjectionGraph />
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
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Text
              style={{ fontFamily: "GeistBold" }}
              className="text-[10px] uppercase tracking-[0.1em] text-sage-700"
            >
              ✨ New · AI Companion
            </Text>
          </View>
          <Text
            style={{ fontFamily: "FrauncesRegular" }}
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

      <Animated.View
        entering={FadeIn.duration(180).delay(400)}
        className="mt-4 flex-row gap-3 rounded-[14px] border border-sage-200 border-l-[3px] border-l-gold bg-warm-white px-4 py-4"
      >
        <LinearGradient
          colors={["#B0CCDB", "#94B5C9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontFamily: "FrauncesBold", color: "#FFFFFF" }}>
            {planMeta.testimonialInitial}
          </Text>
        </LinearGradient>
        <View className="flex-1">
          <Text
            style={{ fontFamily: "FrauncesRegularItalic" }}
            className="text-[13px] leading-[1.45] text-ink"
          >
            {planMeta.testimonial}
          </Text>
          <View className="mt-1 flex-row items-center gap-2">
            <Text
              style={{ fontFamily: "GeistMedium" }}
              className="text-[11px] text-ink-muted"
            >
              Jordan, 35
            </Text>
            <Text
              style={{ fontFamily: "GeistBold" }}
              className="text-[10px] tracking-[-0.04em] text-gold"
            >
              ★★★★★
            </Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(180).delay(480)} className="mt-5">
        <Text
          style={{ fontFamily: "GeistBold" }}
          className="mb-3 text-[11px] uppercase tracking-[0.12em] text-sage-500"
        >
          What you&apos;ll learn
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
