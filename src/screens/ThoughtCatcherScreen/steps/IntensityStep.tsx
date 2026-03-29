import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import Slider from "@react-native-community/slider";

interface IntensityStepProps {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
  onClose: () => void;
}

const ACCENT = "#58CC02";

export const IntensityStep: React.FC<IntensityStepProps> = ({
  value,
  onChange,
  onNext,
  onBack,
  canGoBack,
  isValid,
  progress,
  onClose,
}) => {
  return (
    <View className="flex-1">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Duolingo-style header with progress bar ── */}
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={canGoBack ? onBack : onClose}
            className="p-2 -ml-2 rounded-full active:bg-slate-100 mr-3"
            accessibilityRole="button"
            accessibilityLabel={canGoBack ? "Go back" : "Close"}
          >
            <Text className="text-lg text-slate-400">
              {canGoBack ? "←" : "✕"}
            </Text>
          </Pressable>
          <View className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{ width: `${progress}%`, backgroundColor: ACCENT }}
            />
          </View>
          <Text className="text-xs font-extrabold text-slate-400 ml-3">
            {Math.round(progress)}%
          </Text>
        </View>

        {/* Step dots */}
        <View className="flex-row items-center justify-center gap-1.5 mb-6">
          {Array.from({ length: 3 }, (_: unknown, i: number) => (
            <View
              key={i}
              className={`rounded-full ${i === 2 ? "h-2.5 w-2.5" : "h-2 w-2"}`}
              style={{ backgroundColor: ACCENT }}
            />
          ))}
        </View>

        {/* Title */}
        <Text className="text-[24px] font-extrabold text-slate-900 mb-2">
          How strong is the feeling?
        </Text>
        <Text className="text-[15px] text-slate-500 mb-8 font-medium">
          Slide to rate the intensity of this thought.
        </Text>

        {/* Intensity display */}
        <View className="items-center mb-6">
          <View
            className="h-20 w-20 rounded-full items-center justify-center mb-3"
            style={{
              backgroundColor:
                value > 70 ? "#FEE2E2" : value > 40 ? "#FEF3C7" : "#F0FDF4",
            }}
          >
            <Text
              className="text-[32px] font-extrabold"
              style={{
                color:
                  value > 70 ? "#DC2626" : value > 40 ? "#D97706" : "#16A34A",
              }}
            >
              {value}
            </Text>
          </View>
          <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            {value > 70 ? "Very strong" : value > 40 ? "Moderate" : "Mild"}
          </Text>
        </View>

        {/* Slider */}
        <View
          className="bg-white rounded-2xl p-5 mb-8"
          style={{ borderWidth: 2, borderColor: "#E2E8F0" }}
        >
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={value}
            onValueChange={onChange}
            minimumTrackTintColor={
              value > 70 ? "#EF4444" : value > 40 ? "#F59E0B" : ACCENT
            }
            maximumTrackTintColor="#E2E8F0"
            thumbTintColor="#FFFFFF"
          />
          <View className="flex-row justify-between px-1 mt-2">
            <Text className="text-xs font-bold text-slate-400">Not strong</Text>
            <Text className="text-xs font-bold text-slate-400">
              Very strong
            </Text>
          </View>
        </View>

        {/* ── CTA — Duolingo green button ── */}
        <View className="mt-auto">
          <Pressable
            onPress={onNext}
            disabled={!isValid}
            accessibilityRole="button"
            accessibilityLabel="Continue"
            className="w-full rounded-2xl h-14 items-center justify-center active:opacity-90"
            style={{
              backgroundColor: isValid ? ACCENT : "#E2E8F0",
              shadowColor: isValid ? ACCENT : "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isValid ? 0.3 : 0,
              shadowRadius: 0,
              elevation: isValid ? 4 : 0,
            }}
          >
            <Text
              className="text-base font-extrabold uppercase tracking-wider"
              style={{ color: isValid ? "#FFFFFF" : "#94A3B8" }}
            >
              Continue
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};
