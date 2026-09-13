import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn, ReduceMotion } from "react-native-reanimated";

// ponytail: presentation cards and content defaults for wave faq discovery mechanism
export const DEFAULT_WAVE_FAQ_OPTIONS = [
  {
    id: "danger-present",
    label: "The returning anxiety means the danger is still there",
    isCorrect: false,
  },
  {
    id: "body-sensation",
    label: "A body sensation may have been read as danger again",
    isCorrect: true,
  },
] as const;

export const DEFAULT_WAVE_FAQ_MECHANISM = [
  "The first wave eases",
  "A body sensation appears",
  "“Is it happening again?”",
  "The sensation gets read as danger",
  "The alarm rises again",
] as const;

export const DEFAULT_WAVE_FAQ_INSIGHT = {
  eyebrow: "THE IDEA",
  title: "Another wave doesn't mean you're back at the beginning.",
  paragraphs: [
    "A body sensation can set off another alarm when it gets read as danger.",
    "The returning alarm isn't, by itself, proof that danger returned.",
  ],
} as const;

export function WaveFaqMechanismCard({
  mechanism,
  revealedStep,
}: {
  mechanism: readonly string[];
  revealedStep: number;
}) {
  return (
    <View className="mt-3.5 rounded-[20px] bg-[#FCFBF8] px-4 py-3.5 border border-[#EAE4DC] items-center">
      {mechanism.slice(0, Math.min(revealedStep, mechanism.length)).map((step, idx) => {
        const isThought = step.startsWith("“");
        const isHeroInterpretation =
          step.toLowerCase().includes("read as danger") ||
          step.toLowerCase().includes("interpreted as danger");

        return (
          <Animated.View
            key={idx}
            entering={FadeIn.duration(180).reduceMotion(ReduceMotion.System)}
            className="items-center w-full"
          >
            {idx > 0 ? (
              <Text className="text-[#3C6B3E] font-bold text-[13px] leading-[14px] my-1 text-center">
                ↓
              </Text>
            ) : null}
            <Text
              className={`text-center text-[14.5px] leading-[20px] ${
                isHeroInterpretation
                  ? "happy-font-body-bold text-[#1B3B2B]"
                  : isThought
                    ? "font-serif italic text-[#3F3A34]"
                    : "happy-font-body-medium text-[#201E1D]"
              }`}
            >
              {step}
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
}

export function WaveFaqInsightCard({
  eyebrow = "THE IDEA",
  title,
  paragraphs,
}: {
  eyebrow?: string;
  title: string;
  paragraphs: readonly string[];
}) {
  return (
    <Animated.View
      entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
      className="mt-3.5 rounded-[20px] bg-[#F2F8EF] px-5 py-4 border border-[#D9E5D5]"
      accessible
      accessibilityRole="summary"
    >
      <Text className="text-[11.5px] font-bold tracking-widest text-[#2D5A32] uppercase mb-1">
        {eyebrow}
      </Text>
      <Text className="happy-font-heading-bold text-[16px] leading-[22px] text-[#1B3B2B] mb-2">
        {title}
      </Text>
      {paragraphs.map((para, idx) => (
        <Text
          key={idx}
          className={`happy-font-body text-[14px] leading-[20px] text-[#201E1D] ${
            idx > 0 ? "mt-2" : ""
          }`}
        >
          {para}
        </Text>
      ))}
    </Animated.View>
  );
}

export function WaveFaqWrongFeedback() {
  return (
    <Animated.View
      entering={FadeIn.duration(180).reduceMotion(ReduceMotion.System)}
      className="mt-2.5 rounded-[16px] bg-[#F7F5F0] px-4 py-3 border border-[#E8E2D7]"
      accessible
      accessibilityRole="alert"
    >
      <Text className="text-[11px] font-bold tracking-widest text-[#8A8275] uppercase mb-0.5">
        NOT NECESSARILY
      </Text>
      <Text className="happy-font-body-medium text-[13.5px] leading-[19px] text-[#3D3833]">
        The alarm can return without new danger.
      </Text>
      <Text className="happy-font-body text-[13px] leading-[18px] text-[#6B645B] mt-0.5">
        What else might have restarted the loop?
      </Text>
    </Animated.View>
  );
}
