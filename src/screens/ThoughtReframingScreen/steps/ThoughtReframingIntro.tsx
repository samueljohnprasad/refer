import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { LessonScreen } from "@/src/components/ui/LessonScreen";

interface ThoughtReframingIntroProps {
  onBegin: () => void;
  onClose?: () => void;
}

interface StepItem {
  label: string;
  emoji: string;
}

const STEPS: StepItem[] = [
  { label: "Describe what happened", emoji: "📝" },
  { label: "Capture your thought", emoji: "💭" },
  { label: "Identify your feelings", emoji: "😟" },
  { label: "Spot the thinking trap", emoji: "🪤" },
  { label: "Weigh the evidence", emoji: "⚖️" },
  { label: "Write a balanced thought", emoji: "🌤️" },
];

const ACCENT = "#58CC02";
const XP_REWARD = 15;

export const ThoughtReframingIntro: React.FC<ThoughtReframingIntroProps> =
  React.memo(({ onBegin, onClose }) => {
    return (
      <LessonScreen 
        hideHeader 
        onClose={onClose}
        primaryLabel="Start Lesson"
        onPrimaryPress={onBegin}
      >
        <LessonScreen.Content hasHeader={false} showsVerticalScrollIndicator={false}>
          <View className="flex-1 justify-center px-2">
        {/* Hero icon with badge */}
        <View className="items-center mb-8">
          <View
            className="h-24 w-24 rounded-3xl items-center justify-center mb-4"
            style={{ backgroundColor: "#E8F0FE" }}
          >
            <Text className="text-5xl">🧠</Text>
          </View>
          {/* XP badge */}
          <View
            className="flex-row items-center px-3 py-1.5 rounded-full"
            style={{ backgroundColor: "#FFF3CD" }}
          >
            <Text className="text-sm">⚡</Text>
            <Text className="text-xs font-extrabold text-amber-700 ml-1">
              +{XP_REWARD} XP
            </Text>
          </View>
        </View>

        {/* Title & description */}
        <Text className="text-[28px] font-extrabold text-slate-900 text-center mb-2 leading-tight">
          Thought Reframing
        </Text>
        <Text className="text-[15px] text-slate-500 text-center leading-relaxed mb-8 px-2">
          Challenge unhelpful thoughts and see your situation more clearly.
        </Text>

        {/* Duration chip */}
        <View className="items-center mb-6">
          <View className="flex-row items-center bg-slate-100 px-4 py-2 rounded-full">
            <Text className="text-sm">⏱️</Text>
            <Text className="text-sm font-bold text-slate-600 ml-1.5">
              2–3 min
            </Text>
            <View className="h-1 w-1 rounded-full bg-slate-300 mx-2" />
            <Text className="text-sm font-bold text-slate-600">6 steps</Text>
          </View>
        </View>

        {/* Steps — Duolingo lesson-preview style with connected bubbles */}
        <View className="mb-8 px-1">
          {STEPS.map((step: StepItem, index: number) => (
            <View
              key={index}
              className="flex-row items-center mb-3"
            >
              <View className="h-10 w-10 rounded-xl bg-slate-100 items-center justify-center mr-3">
                <Text className="text-lg">{step.emoji}</Text>
              </View>
              <Text className="text-[15px] font-bold text-slate-700 flex-1">
                {step.label}
              </Text>
              <View className="h-2 w-2 rounded-full bg-slate-200" />
            </View>
          ))}
        </View>

          </View>
        </LessonScreen.Content>
      </LessonScreen>
    );
  });

ThoughtReframingIntro.displayName = "ThoughtReframingIntro";
