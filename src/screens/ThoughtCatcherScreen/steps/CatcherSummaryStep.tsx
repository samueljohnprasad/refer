import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";

interface CatcherSummaryStepProps {
  onCheckIt: () => void;
  onClose: () => void;
}

const ACCENT = "#58CC02";
const XP_EARNED = 10;

export const CatcherSummaryStep: React.FC<CatcherSummaryStepProps> = ({
  onCheckIt,
  onClose,
}) => {
  return (
    <View className="flex-1">
      {/* ── Duolingo celebration ── */}
      <View className="flex-1 items-center justify-center p-6">
        <View
          className="h-24 w-24 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: "#F0FFF0" }}
        >
          <Text
            className="text-[56px]"
            accessible={false}
          >
            🧠
          </Text>
        </View>

        <Text className="text-[26px] font-extrabold text-slate-900 text-center mb-2">
          Nice catch!
        </Text>
        <Text className="text-[15px] text-slate-500 text-center leading-relaxed mb-6">
          That's an automatic thought.{"\n"}Let's check if it's really true.
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

      {/* ── Action Footer — Duolingo-style CTAs ── */}
      <View className="px-2 pb-8">
        <Pressable
          onPress={onCheckIt}
          accessibilityRole="button"
          accessibilityLabel="Check this thought"
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
            Let's check it
          </Text>
        </Pressable>

        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Do it later"
          className="mt-3 h-11 rounded-2xl items-center justify-center active:bg-slate-100"
        >
          <Text className="text-sm font-bold text-slate-400">
            I'll do it later
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
