import React from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import MochiMascot from "../components/MochiMascot";
import { FEELINGS } from "../constants";
import { FeelingEmoji, StressTiming } from "../types";

interface AIInsightStepProps {
  feeling?: FeelingEmoji;
  timing?: StressTiming;
}

const TIMING_LABELS: Record<StressTiming, string> = {
  morning: "mornings",
  afternoon: "afternoons",
  evening: "evenings",
  night: "late nights",
};

const TIME_WINDOWS: Record<StressTiming, string> = {
  morning: "7am–10am",
  afternoon: "1pm–5pm",
  evening: "5pm–9pm",
  night: "9pm–11pm",
};

const AIInsightStep: React.FC<AIInsightStepProps> = ({ feeling, timing }) => {
  const feelingLabel =
    FEELINGS.find((option) => option.id === feeling)?.label.toLowerCase() ??
    "that";
  const timingLabel = timing ? TIMING_LABELS[timing] : "evenings";
  const timeWindow = timing ? TIME_WINDOWS[timing] : "5pm–9pm";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 140 }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6 pt-3"
    >
      <Animated.View entering={FadeIn.duration(180).delay(80)}>
        <View className="mb-2 self-start">
          <MochiMascot expression="notes" size={92} animate={false} />
        </View>
        <Text
          style={{ fontFamily: "FrauncesRegular" }}
          className="text-[24px] leading-[1.15] text-ink"
        >
          Here&apos;s what I noticed about{" "}
          <Text
            style={{
              fontFamily: "FrauncesRegularItalic",
              color: "#5A7A56",
            }}
          >
            you.
          </Text>
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(180).delay(160)}
        className="mt-4 rounded-[20px] border-2 border-gold bg-cream px-5 py-5"
      >
        <Text
          style={{ fontFamily: "GeistBold" }}
          className="text-[11px] uppercase tracking-[0.1em] text-terracotta"
        >
          ✨ AI Insight
        </Text>
        <Text
          style={{ fontFamily: "FrauncesRegularItalic" }}
          className="mt-3 text-[16px] leading-[1.5] text-ink"
        >
          You named{" "}
          <Text
            style={{
              fontFamily: "FrauncesSemiBoldItalic",
              color: "#2A3F2A",
            }}
          >
            feeling {feelingLabel}
          </Text>{" "}
          — and that gives us something specific to work with. The{" "}
          <Text
            style={{
              fontFamily: "FrauncesSemiBoldItalic",
              color: "#2A3F2A",
            }}
          >
            {timingLabel}
          </Text>
          , the heaviest stretch of your day, may be where this practice gives
          you the most relief. Most people in your shoes find{" "}
          <Text
            style={{
              fontFamily: "FrauncesSemiBoldItalic",
              color: "#2A3F2A",
            }}
          >
            {timeWindow} reflection
          </Text>{" "}
          the highest-leverage time.
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(180).delay(240)}
        className="mt-5 rounded-[24px] border-2 border-sage-100 bg-warm-white px-6 py-6"
      >
        <Text
          style={{ fontFamily: "GeistBold" }}
          className="text-[12px] uppercase tracking-[0.1em] text-sage-500"
        >
          CBT Exercise — Try this
        </Text>
        <Text
          style={{ fontFamily: "FrauncesRegular" }}
          className="mt-3 text-[18px] leading-[1.35] text-ink"
        >
          When the {feelingLabel} hits, try the{" "}
          <Text
            style={{
              fontFamily: "FrauncesSemiBold",
              color: "#5A7A56",
            }}
          >
            5-4-3-2-1
          </Text>{" "}
          grounding technique:
        </Text>

        <View className="mt-4 gap-2">
          {[
            ["5 things", "you can see"],
            ["4 things", "you can touch"],
            ["3 things", "you can hear"],
            ["2 things", "you can smell"],
            ["1 thing", "you can taste"],
          ].map(([count, description]) => (
            <Text
              key={count}
              style={{ fontFamily: "GeistRegular" }}
              className="text-[14px] leading-[1.5] text-ink-soft"
            >
              <Text
                style={{
                  fontFamily: "GeistSemiBold",
                  color: "#5A7A56",
                }}
              >
                {count}
              </Text>{" "}
              {description}
            </Text>
          ))}
        </View>

        <View className="mt-4 flex-row items-start gap-2 rounded-[10px] bg-sage-300/15 px-3 py-3">
          <Text className="text-[13px] text-sage-600">📖</Text>
          <Text
            style={{ fontFamily: "GeistRegular" }}
            className="flex-1 text-[11px] leading-[1.4] text-ink-soft"
          >
            <Text
              style={{ fontFamily: "GeistSemiBold", color: "#3F5A3D" }}
            >
              Research:
            </Text>{" "}
            Naming an emotion reduces its intensity by activating the prefrontal
            cortex while quieting the amygdala.{" "}
            <Text style={{ fontFamily: "GeistMedium" }}>
              Lieberman et al., UCLA (2007)
            </Text>
            .
          </Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(AIInsightStep);
