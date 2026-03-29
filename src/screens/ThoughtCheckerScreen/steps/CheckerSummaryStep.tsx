import React from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";

interface CheckerSummaryStepProps {
  situation: string;
  automaticThought: string;
  intensity: number;
  isTrue: string;
  balancedThought: string;
  onDone: () => void;
  onClose: () => void;
}

const ACCENT = "#58CC02";
const XP_EARNED = 15;

interface TruthStyle {
  emoji: string;
  label: string;
  bgColor: string;
  textColor: string;
}

function getTruthStyle(isTrue: string): TruthStyle {
  switch (isTrue) {
    case "YES":
      return {
        emoji: "⚠️",
        label: "Yes",
        bgColor: "#FEE2E2",
        textColor: "#DC2626",
      };
    case "NOT SURE":
      return {
        emoji: "🤔",
        label: "Not sure",
        bgColor: "#FEF3C7",
        textColor: "#D97706",
      };
    default:
      return {
        emoji: "💡",
        label: "No",
        bgColor: "#D1FAE5",
        textColor: "#059669",
      };
  }
}

export const CheckerSummaryStep: React.FC<CheckerSummaryStepProps> = ({
  situation,
  automaticThought,
  intensity,
  isTrue,
  balancedThought,
  onDone,
  onClose,
}) => {
  const truthStyle: TruthStyle = getTruthStyle(isTrue);

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ── Duolingo celebration header ── */}
        <View className="items-center pt-4 mb-8">
          <View
            className="h-20 w-20 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: "#F0FFF0" }}
          >
            <Text
              className="text-[44px]"
              accessible={false}
            >
              🌱
            </Text>
          </View>
          <Text className="text-[26px] font-extrabold text-slate-900 text-center mb-1">
            Thought Checked!
          </Text>
          <Text className="text-[15px] text-slate-500 text-center mb-4">
            You've reframed your perspective. Great work!
          </Text>

          {/* XP reward badge */}
          <View
            className="flex-row items-center px-5 py-2.5 rounded-full"
            style={{
              backgroundColor: "#FFF3CD",
              borderWidth: 2,
              borderColor: "#FBBF24",
            }}
          >
            <Text className="text-lg mr-1.5">⚡</Text>
            <Text className="text-base font-extrabold text-amber-700">
              +{XP_EARNED} XP earned!
            </Text>
          </View>
        </View>

        {/* Situation */}
        <View className="mb-4">
          <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
            The Situation
          </Text>
          <View
            className="bg-white rounded-2xl p-4"
            style={{ borderWidth: 2, borderColor: "#E2E8F0" }}
          >
            <Text className="text-sm text-slate-700 leading-relaxed font-medium">
              {situation || "No situation recorded."}
            </Text>
          </View>
        </View>

        {/* Arrow */}
        <View className="items-center mb-4">
          <Text className="text-slate-300 text-lg">↓</Text>
        </View>

        {/* Original Thought — red card */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Original Thought
            </Text>
            <View className="px-2 py-0.5 rounded-full bg-orange-100">
              <Text className="text-[10px] font-extrabold text-orange-600 uppercase">
                Intensity: {intensity}%
              </Text>
            </View>
          </View>
          <View
            className="rounded-2xl p-4"
            style={{
              backgroundColor: "#FEF2F2",
              borderWidth: 2,
              borderColor: "#FECACA",
            }}
          >
            <Text className="text-sm text-red-700 italic leading-relaxed font-medium">
              "{automaticThought || "..."}"
            </Text>
          </View>
        </View>

        {/* Reality Check */}
        <View className="mb-4">
          <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
            Reality Check
          </Text>
          <View
            className="bg-white rounded-2xl p-4 flex-row items-center justify-between"
            style={{ borderWidth: 2, borderColor: "#E2E8F0" }}
          >
            <Text className="text-sm text-slate-600 font-medium flex-1 mr-3">
              Is this thought grounded in facts?
            </Text>
            <View
              className="flex-row items-center px-3 py-1.5 rounded-full"
              style={{ backgroundColor: truthStyle.bgColor }}
            >
              <Text className="text-xs mr-1">{truthStyle.emoji}</Text>
              <Text
                className="text-xs font-extrabold"
                style={{ color: truthStyle.textColor }}
              >
                {truthStyle.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Balanced Thought — green card */}
        <View className="mb-8">
          <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
            Balanced Perspective
          </Text>
          <View
            className="rounded-2xl p-4"
            style={{
              backgroundColor: "#F0FDF4",
              borderWidth: 2,
              borderColor: "#BBF7D0",
            }}
          >
            <View className="flex-row items-center mb-2">
              <Text className="text-lg mr-2">⚖️</Text>
              <Text className="text-xs font-extrabold text-green-600 uppercase tracking-wider">
                New thought
              </Text>
            </View>
            <Text className="text-sm text-green-800 font-medium leading-relaxed">
              "{balancedThought || "..."}"
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Action Footer — Duolingo-style CTA ── */}
      <View className="absolute bottom-6 left-0 right-0 px-2 bg-transparent">
        <Pressable
          onPress={onDone}
          accessibilityRole="button"
          accessibilityLabel="Done"
          className="w-full rounded-2xl h-14 items-center justify-center active:opacity-90"
          style={{
            backgroundColor: ACCENT,
            shadowColor: ACCENT,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 0,
            elevation: 4,
          }}
        >
          <Text className="text-white text-base font-extrabold uppercase tracking-wider">
            Done
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
