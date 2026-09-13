// ponytail: Reusable presentational components for Socratic Dialogue exercise
import React from "react";
import { Pressable, Text, View } from "react-native";
import { HelpCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";

export function EyebrowLabel({
  children,
  tone = "neutral",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green";
  className?: string;
}): React.JSX.Element {
  const toneClass = tone === "green" ? "text-[#4A6B53]" : "text-[#82796A]";
  return (
    <Text
      className={`happy-font-body-bold mb-1 text-[10.5px] uppercase tracking-wider ${toneClass} ${className}`}
    >
      {children}
    </Text>
  );
}

export interface DialogueBubbleProps {
  speaker: "person" | "you";
  text: string;
}

export function DialogueBubble({ speaker, text }: DialogueBubbleProps): React.JSX.Element {
  const isYou = speaker === "you";

  if (isYou) {
    return (
      <View
        accessibilityLabel={`You asked: ${text}`}
        accessibilityRole="text"
        className="max-w-[88%] self-end rounded-[18px] rounded-tr-sm border border-[#C8DAC9] bg-[#E8EFE9] px-3.5 py-3"
      >
        <EyebrowLabel tone="green">YOU</EyebrowLabel>
        <Text className="happy-font-body text-[13.5px] leading-5 text-[#1B3B2B]">
          {text}
        </Text>
      </View>
    );
  }

  return (
    <View
      accessibilityLabel={`Person says: ${text}`}
      accessibilityRole="text"
      className="max-w-[92%] self-start rounded-[18px] rounded-tl-sm border border-[#E8DFD1] bg-[#F9F4ED] px-3.5 py-3"
    >
      <EyebrowLabel>PERSON</EyebrowLabel>
      <Text className="happy-font-body text-[13.5px] leading-5 text-[#201E1D]">
        {text}
      </Text>
    </View>
  );
}

export interface PedagogicalFeedbackProps {
  text: string;
}

export function PedagogicalFeedback({ text }: PedagogicalFeedbackProps): React.JSX.Element {
  return (
    <View
      accessibilityLabel={`Guidance: ${text}`}
      accessibilityRole="text"
      className="rounded-[16px] border border-[#ABC0A2] bg-[#F2F8EF] p-3"
    >
      <EyebrowLabel tone="green">GUIDANCE</EyebrowLabel>
      <Text className="happy-font-body text-[13px] leading-4.5 text-[#201E1D]">
        {text}
      </Text>
    </View>
  );
}

export interface CompressedStageCardProps {
  prediction: string;
  evidence: readonly string[];
}

export function CompressedStageCard({
  prediction,
  evidence,
}: CompressedStageCardProps): React.JSX.Element {
  return (
    <View
      accessibilityLabel="What we know so far"
      className="rounded-[18px] border border-[#E8DFD1] bg-[#F9F4ED] p-3.5"
    >
      <View accessibilityLabel={`Prediction: ${prediction}`}>
        <EyebrowLabel>THE PREDICTION</EyebrowLabel>
        <Text className="happy-font-body-bold text-[13.5px] leading-5 text-[#201E1D]">
          {prediction}
        </Text>
      </View>
      <View className="my-2.5 h-px bg-[#EAE2D5]" />
      <View accessibilityLabel={`What we know: ${evidence.join(", ")}`}>
        <EyebrowLabel>WHAT WE KNOW</EyebrowLabel>
        {evidence.map((item, idx) => (
          <Text
            key={idx}
            className="happy-font-body text-[13px] leading-4.5 text-[#201E1D]"
          >
            • {item}
          </Text>
        ))}
      </View>
    </View>
  );
}

export interface FinalSummaryProps {
  prediction: string;
  evidence: readonly string[];
  balancedThought: string;
  skill: string;
}

export function FinalSummaryCard({
  prediction,
  evidence,
  balancedThought,
  skill,
}: FinalSummaryProps): React.JSX.Element {
  const [skillMain, skillSupport] = skill.includes("\n\n")
    ? skill.split("\n\n")
    : [skill, "Check the evidence before treating it as fact."];

  return (
    <View className="gap-4">
      {/* 3-step cognitive model */}
      <View className="rounded-[18px] border border-[#E8DFD1] bg-[#F9F4ED] p-4">
        <View accessibilityLabel={`Prediction: ${prediction}`}>
          <EyebrowLabel>THE PREDICTION</EyebrowLabel>
          <Text className="happy-font-body-bold text-[13.5px] leading-5 text-[#201E1D]">
            {prediction}
          </Text>
        </View>

        <View className="my-3.5 h-px bg-[#EAE2D5]" />

        <View accessibilityLabel={`What we know: ${evidence.join(", ")}`}>
          <EyebrowLabel>WHAT WE KNOW</EyebrowLabel>
          {evidence.map((item, idx) => (
            <Text
              key={idx}
              className="happy-font-body text-[13px] leading-4.5 text-[#201E1D]"
            >
              • {item}
            </Text>
          ))}
        </View>

        <View className="my-3.5 h-px bg-[#EAE2D5]" />

        <View accessibilityLabel={`Balanced thought: ${balancedThought}`}>
          <EyebrowLabel tone="green">BALANCED THOUGHT</EyebrowLabel>
          {balancedThought.split("\n\n").map((para, i) => (
            <Text
              key={i}
              className={`happy-font-body text-[13px] leading-4.5 text-[#201E1D] ${i > 0 ? "mt-3" : ""}`}
            >
              {para}
            </Text>
          ))}
        </View>
      </View>

      {/* The transferable rule — softened sage border */}
      <View
        accessibilityLabel={`The skill: ${skill}`}
        className="rounded-[16px] border border-[#C8D9C2] bg-[#F2F8EF] p-4"
      >
        <EyebrowLabel tone="green">THE SKILL</EyebrowLabel>
        <Text className="happy-font-body-bold text-[13.5px] leading-5 text-[#201E1D]">
          {skillMain}
        </Text>
        {skillSupport ? (
          <Text className="happy-font-body mt-1 text-[13px] leading-4.5 text-[#201E1D]">
            {skillSupport}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export interface HintButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function HintButton({ isOpen, onToggle }: HintButtonProps): React.JSX.Element {
  return (
    <View className="relative pb-[2px]">
      <View className="absolute inset-x-0 bottom-0 top-[2px] rounded-full bg-[#D5E2D0]" />
      <Pressable
        accessibilityLabel={isOpen ? "Hide hint" : "Show hint"}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        onPress={onToggle}
        className="min-h-[28px] flex-row items-center gap-1 rounded-full border border-[#D5E2D0] bg-[#FAFDF9] px-2.5 active:translate-y-[2px]"
      >
        <HugeiconsIcon icon={HelpCircleIcon} size={13} color="#3C5A3E" />
        <Text className="happy-font-body-bold text-[11.5px] text-[#3C5A3E]">
          Hint
        </Text>
      </Pressable>
    </View>
  );
}

export interface InlineHintCardProps {
  title: string;
  body: string;
  onClose: () => void;
}

export function InlineHintCard({ title, body, onClose }: InlineHintCardProps): React.JSX.Element {
  return (
    <View
      accessibilityRole="text"
      className="mb-2.5 mt-0.5 rounded-[16px] border border-[#ABC0A2] bg-[#F2F8EF] px-4 py-3"
    >
      <Text className="happy-font-heading-bold text-[13.5px] leading-4.5 text-[#29452A]">
        {title}
      </Text>
      <Text className="happy-font-body mt-1 text-[12.5px] leading-4 text-[#29452A]">
        {body}
      </Text>
      <Pressable
        accessibilityLabel="Hide hint"
        accessibilityRole="button"
        onPress={onClose}
        className="mt-2 self-start py-0.5 active:opacity-60"
      >
        <Text className="happy-font-body-bold text-[11.5px] text-[#3C5A3E]">
          Hide hint ↑
        </Text>
      </Pressable>
    </View>
  );
}
