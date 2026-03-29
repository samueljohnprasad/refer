import React, { useState } from "react";
import { View, Pressable, ActivityIndicator, TextInput } from "react-native";
import { Text } from "@/components/ui/text";
import { StepHeader } from "../../ThoughtReframingScreen/components/StepHeader";
import { StepNavigation } from "../../ThoughtReframingScreen/components/StepNavigation";
import type { AIGratitudePrompt } from "../hooks/useGratitudeAI";

interface PromptsStepProps {
  selectedPrompt: string;
  onSelectPrompt: (prompt: string) => void;
  aiPrompts: AIGratitudePrompt[];
  isGenerating: boolean;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
}

const CATEGORY_EMOJI: Record<string, string> = {
  moments: "✨",
  people: "👥",
  health: "💪",
  environment: "🌿",
  resilience: "🛡️",
  self: "🪞",
  safety: "🏠",
  kindness: "💛",
  memory: "📸",
  comfort: "☕",
  perspective: "🔄",
  strength: "💎",
  support: "🤝",
  values: "⭐",
  patience: "🕊️",
  progress: "📈",
  peace: "🧘",
};

export const PromptsStep: React.FC<PromptsStepProps> = React.memo(
  ({
    selectedPrompt,
    onSelectPrompt,
    aiPrompts,
    isGenerating,
    onNext,
    onBack,
    canGoBack,
    isValid,
    progress,
  }) => {
    const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
    const [customPrompt, setCustomPrompt] = useState<string>("");

    const handleSelectPrompt = (text: string): void => {
      setIsCustomMode(false);
      onSelectPrompt(text);
    };

    const handleCustomToggle = (): void => {
      setIsCustomMode(true);
      onSelectPrompt(customPrompt);
    };

    const handleCustomChange = (text: string): void => {
      setCustomPrompt(text);
      if (isCustomMode) {
        onSelectPrompt(text);
      }
    };

    return (
      <View className="flex-1">
        <StepHeader
          title="Choose a prompt"
          subtitle="Pick a question to guide your gratitude reflection."
          progress={progress}
          stepNumber={2}
          totalSteps={4}
        />

        {/* AI loading state */}
        {isGenerating && (
          <View className="flex-row items-center mb-4">
            <ActivityIndicator
              size="small"
              color="#94A3B8"
            />
            <Text className="text-[11px] text-slate-400 ml-2 uppercase tracking-wider">
              Generating prompts…
            </Text>
          </View>
        )}

        {/* Prompt cards — Duolingo quiz-style selectable options */}
        {!isGenerating && aiPrompts.length > 0 && (
          <View className="mb-4">
            {aiPrompts.map((prompt: AIGratitudePrompt, index: number) => {
              const isSelected: boolean =
                !isCustomMode && selectedPrompt === prompt.text;
              const emoji: string = CATEGORY_EMOJI[prompt.category] ?? "💡";

              return (
                <Pressable
                  key={`prompt-${index}`}
                  onPress={() => handleSelectPrompt(prompt.text)}
                  accessibilityRole="button"
                  accessibilityLabel={prompt.text}
                  accessibilityState={{ selected: isSelected }}
                  className="rounded-2xl p-4 mb-3 active:opacity-80"
                  style={{
                    borderWidth: 2,
                    borderColor: isSelected ? "#58CC02" : "#E2E8F0",
                    backgroundColor: isSelected ? "#F0FFF0" : "#FFFFFF",
                    borderBottomWidth: isSelected ? 2 : 4,
                    borderBottomColor: isSelected ? "#58CC02" : "#CBD5E1",
                    minHeight: 48,
                  }}
                >
                  <View className="flex-row items-start">
                    <View className="h-9 w-9 rounded-xl bg-slate-100 items-center justify-center mr-3">
                      <Text className="text-lg">{emoji}</Text>
                    </View>
                    <Text
                      className={`flex-1 text-[15px] leading-snug font-bold pt-1 ${isSelected ? "text-green-800" : "text-slate-700"
                        }`}
                    >
                      {prompt.text}
                    </Text>
                    {isSelected && (
                      <View
                        className="h-6 w-6 rounded-full items-center justify-center ml-2"
                        style={{ backgroundColor: "#58CC02" }}
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
        )}

        {/* Custom prompt option */}
        <View className="mb-4">
          <Pressable
            onPress={handleCustomToggle}
            accessibilityRole="button"
            accessibilityLabel="Write your own prompt"
            className="rounded-2xl p-4 active:opacity-80"
            style={{
              borderWidth: 2,
              borderStyle: isCustomMode ? "solid" : "dashed",
              borderColor: isCustomMode ? "#58CC02" : "#CBD5E1",
              backgroundColor: isCustomMode ? "#F0FFF0" : "#FFFFFF",
              minHeight: 48,
            }}
          >
            <Text
              className={`text-[15px] font-bold ${isCustomMode ? "text-green-800" : "text-slate-400"
                }`}
            >
              ✏️ Write your own prompt
            </Text>
          </Pressable>

          {isCustomMode && (
            <TextInput
              value={customPrompt}
              onChangeText={handleCustomChange}
              placeholder="e.g., What made me laugh this week?"
              placeholderTextColor="#94A3B8"
              multiline
              className="bg-white rounded-2xl p-4 mt-3 text-base text-slate-700"
              style={{ minHeight: 80, borderWidth: 2, borderColor: "#E2E8F0" }}
              maxLength={200}
              autoFocus
            />
          )}
        </View>

        <StepNavigation
          canGoBack={canGoBack}
          canGoNext={isValid}
          onBack={onBack}
          onNext={onNext}
        />
      </View>
    );
  },
);

PromptsStep.displayName = "PromptsStep";
