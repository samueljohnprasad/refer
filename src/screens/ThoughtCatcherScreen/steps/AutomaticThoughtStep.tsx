import React from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { Text } from "@/components/ui/text";
import { TextInput } from "react-native";

interface AutomaticThoughtStepProps {
  value: string;
  onChange: (text: string) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
  onClose: () => void;
}

const ACCENT = "#58CC02";

interface SuggestionItem {
  label: string;
  emoji: string;
}

const SUGGESTIONS: SuggestionItem[] = [
  { label: "They don't like me", emoji: "😟" },
  { label: "I messed up", emoji: "😩" },
  { label: "I'll fail", emoji: "😰" },
];

export const AutomaticThoughtStep: React.FC<AutomaticThoughtStepProps> = ({
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
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
              className={`rounded-full ${i === 1 ? "h-2.5 w-2.5" : "h-2 w-2"}`}
              style={{
                backgroundColor: i < 2 ? ACCENT : "#E2E8F0",
              }}
            />
          ))}
        </View>

        {/* Title */}
        <Text className="text-[24px] font-extrabold text-slate-900 mb-2">
          What went through your mind?
        </Text>
        <Text className="text-[15px] text-slate-500 mb-6 font-medium">
          Write down the first thought that popped up.
        </Text>

        {/* Duolingo-style info tip */}
        <View
          className="rounded-2xl p-3.5 mb-6 flex-row items-start"
          style={{
            backgroundColor: "#EFF6FF",
            borderWidth: 2,
            borderColor: "#BFDBFE",
          }}
        >
          <View className="h-8 w-8 rounded-lg bg-blue-100 items-center justify-center mr-3 mt-0.5">
            <Text className="text-base">💡</Text>
          </View>
          <Text className="text-sm text-blue-800 leading-relaxed flex-1 font-medium">
            Automatic thoughts pop up instantly — they feel true, but aren't
            always accurate.
          </Text>
        </View>

        {/* Text input */}
        <TextInput
          placeholder="Type your thought..."
          value={value}
          onChangeText={onChange}
          autoFocus
          className="bg-white rounded-2xl p-4 text-base text-slate-700 mb-6"
          style={{ borderWidth: 2, borderColor: "#E2E8F0", minHeight: 48 }}
          placeholderTextColor="#94A3B8"
        />

        {/* Quick suggestions — Duolingo quiz-style */}
        <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
          Common thoughts
        </Text>
        <View className="gap-y-3 mb-8">
          {SUGGESTIONS.map((suggestion: SuggestionItem) => {
            const isSelected: boolean = value === suggestion.label;
            return (
              <Pressable
                key={suggestion.label}
                onPress={() => onChange(suggestion.label)}
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
                    <Text className="text-lg">{suggestion.emoji}</Text>
                  </View>
                  <Text
                    className={`text-[15px] font-bold flex-1 ${isSelected ? "text-green-800" : "text-slate-700"}`}
                  >
                    {suggestion.label}
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
    </KeyboardAvoidingView>
  );
};
