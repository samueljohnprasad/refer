import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Text } from "@/components/ui/text";

interface RealityCheckStepProps {
  value: "YES" | "NOT SURE" | "NO" | null;
  automaticThought: string;
  onChange: (val: "YES" | "NOT SURE" | "NO") => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
  onClose: () => void;
}

const ACCENT = "#58CC02";

type OptionKey = "YES" | "NOT SURE" | "NO";

interface OptionItem {
  key: OptionKey;
  label: string;
  emoji: string;
}

const OPTIONS: OptionItem[] = [
  { key: "YES", label: "Yes, it's true", emoji: "😔" },
  { key: "NOT SURE", label: "Not sure", emoji: "🤔" },
  { key: "NO", label: "No, probably not", emoji: "💡" },
];

export const RealityCheckStep: React.FC<RealityCheckStepProps> = ({
  value,
  automaticThought,
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
          {Array.from({ length: 2 }, (_: unknown, i: number) => (
            <View
              key={i}
              className={`rounded-full ${i === 0 ? "h-2.5 w-2.5" : "h-2 w-2"}`}
              style={{ backgroundColor: i === 0 ? ACCENT : "#E2E8F0" }}
            />
          ))}
        </View>

        {/* Title */}
        <Text className="text-[24px] font-extrabold text-slate-900 mb-2">
          Is this 100% true?
        </Text>
        <Text className="text-[15px] text-slate-500 mb-6 font-medium">
          Think about whether this thought is based on facts.
        </Text>

        {/* Automatic thought — bordered card */}
        <View
          className="rounded-2xl p-4 mb-6"
          style={{
            backgroundColor: "#FEF2F2",
            borderWidth: 2,
            borderColor: "#FECACA",
          }}
        >
          <Text className="text-xs font-extrabold text-red-400 uppercase tracking-wider mb-1">
            Your thought
          </Text>
          <Text className="text-sm text-red-700 italic leading-relaxed font-medium">
            "{automaticThought}"
          </Text>
        </View>

        {/* Quiz-style option cards */}
        <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
          Choose one
        </Text>
        <View className="gap-y-3 mb-8">
          {OPTIONS.map((option: OptionItem) => {
            const isSelected: boolean = value === option.key;
            return (
              <Pressable
                key={option.key}
                onPress={() => onChange(option.key)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                className="rounded-2xl p-4 active:opacity-80"
                style={{
                  borderWidth: 2,
                  borderColor: isSelected ? ACCENT : "#E2E8F0",
                  backgroundColor: isSelected ? "#F0FFF0" : "#FFFFFF",
                  borderBottomWidth: isSelected ? 2 : 4,
                  borderBottomColor: isSelected ? ACCENT : "#CBD5E1",
                  minHeight: 48,
                }}
              >
                <View className="flex-row items-center">
                  <View className="h-9 w-9 rounded-xl bg-slate-100 items-center justify-center mr-3">
                    <Text className="text-lg">{option.emoji}</Text>
                  </View>
                  <Text
                    className={`text-[15px] font-bold flex-1 ${isSelected ? "text-green-800" : "text-slate-700"}`}
                  >
                    {option.label}
                  </Text>
                  {isSelected && (
                    <View
                      className="h-6 w-6 rounded-full items-center justify-center"
                      style={{ backgroundColor: ACCENT }}
                    >
                      <Text className="text-white text-xs font-extrabold">
                        ✓
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
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
