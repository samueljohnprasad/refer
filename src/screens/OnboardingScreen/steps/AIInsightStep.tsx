import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "expo-router/react-navigation";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import MochiMascot from "../components/MochiMascot";
import { FEELINGS } from "../constants";
import { FeelingEmoji, StressTiming } from "../types";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { SparklesIcon, Book01Icon } from "@hugeicons/core-free-icons";

interface AIInsightStepProps {
  feeling?: FeelingEmoji;
  onSelect?: (feeling: FeelingEmoji) => void;
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
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const feelingLabel =
    FEELINGS.find((option) => option.id === feeling)?.label.toLowerCase() ??
    "that";
  const timingLabel = timing ? TIMING_LABELS[timing] : "evenings";
  const timeWindow = timing ? TIME_WINDOWS[timing] : "5pm–9pm";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 140, paddingTop: headerHeight - insets.top }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6 pt-3"
    >
      <Animated.View entering={FadeIn.duration(180).delay(80)}>
        <View className="mb-2 self-start">
          <MochiMascot expression="notes" size={92} animate={false} />
        </View>
        <Text
          style={{ fontFamily: "CormorantRegular" }}
          className="text-[24px] leading-[1.15] text-ink"
        >
          Here&apos;s what I noticed about{" "}
          <Text
            style={{
              fontFamily: "CormorantRegularItalic",
              color: "#5F7F58",
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
        <View className="flex-row items-center gap-1.5 mb-2">
          <HugeiconsIcon icon={SparklesIcon} size={14} color="#D97706" />
          <Text
            style={{ fontFamily: "GeistBold" }}
            className="text-[11px] uppercase tracking-[0.1em] text-terracotta"
          >
            AI Insight
          </Text>
        </View>
        <Text
          style={{ fontFamily: "CormorantRegularItalic" }}
          className="text-[16px] leading-[1.5] text-ink"
        >
          You named{" "}
          <Text
            style={{
              fontFamily: "CormorantSemiBoldItalic",
              color: "#29452A",
            }}
          >
            feeling {feelingLabel}
          </Text>{" "}
          — and that gives us something specific to work with. The{" "}
          <Text
            style={{
              fontFamily: "CormorantSemiBoldItalic",
              color: "#29452A",
            }}
          >
            {timingLabel}
          </Text>
          , the heaviest stretch of your day, may be where this practice gives
          you the most relief. Most people in your shoes find{" "}
          <Text
            style={{
              fontFamily: "CormorantSemiBoldItalic",
              color: "#29452A",
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
          style={{ fontFamily: "CormorantRegular" }}
          className="mt-3 text-[18px] leading-[1.35] text-ink"
        >
          When the {feelingLabel} hits, try the{" "}
          <Text
            style={{
              fontFamily: "CormorantSemiBold",
              color: "#5F7F58",
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
                  color: "#5F7F58",
                }}
              >
                {count}
              </Text>{" "}
              {description}
            </Text>
          ))}
        </View>

        <View className="mt-4 flex-row items-start gap-2.5 rounded-[10px] bg-sage-300/15 px-3 py-3">
          <View className="mt-0.5">
            <HugeiconsIcon icon={Book01Icon} size={14} color="#5F7F58" />
          </View>
          <Text
            style={{ fontFamily: "GeistRegular" }}
            className="flex-1 text-[11px] leading-[1.4] text-ink-soft"
          >
            <Text
              style={{ fontFamily: "GeistSemiBold", color: "#44633F" }}
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
