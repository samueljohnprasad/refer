import React from "react";
import { View, Pressable, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/text";
import { StepHeader } from "../components/StepHeader";
import { StepNavigation } from "../components/StepNavigation";
import { VoiceTextInput } from "../components/VoiceTextInput";
import type { AIBalancedThoughtSuggestion } from "../hooks/useThoughtReframingAI";

interface BalancedThoughtStepProps {
  value: string;
  automaticThought: string;
  onChange: (text: string) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
  aiSuggestions?: AIBalancedThoughtSuggestion[];
  isSuggestingBalanced?: boolean;
}

export const BalancedThoughtStep: React.FC<BalancedThoughtStepProps> =
  React.memo(
    ({
      value,
      automaticThought,
      onChange,
      onNext,
      onBack,
      canGoBack,
      isValid,
      progress,
      aiSuggestions = [],
      isSuggestingBalanced = false,
    }) => {
      return (
        <View className="flex-1">
          <StepHeader
            title="Write a balanced thought"
            subtitle="Replace the original with something realistic and fair."
            progress={progress}
            stepNumber={7}
            totalSteps={8}
          />

          {/* Original thought — bordered card */}
          <View className="mb-5">
            <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
              Original thought
            </Text>
            <View
              className="rounded-2xl p-3.5"
              style={{
                backgroundColor: "#FEF2F2",
                borderWidth: 2,
                borderColor: "#FECACA",
              }}
            >
              <Text className="text-sm text-red-700 italic leading-relaxed">
                "{automaticThought}"
              </Text>
            </View>
          </View>

          {/* AI loading */}
          {isSuggestingBalanced && (
            <View className="flex-row items-center mb-4">
              <ActivityIndicator
                size="small"
                color="#94A3B8"
              />
              <Text className="text-[11px] text-slate-400 ml-2 uppercase tracking-wider">
                Crafting options…
              </Text>
            </View>
          )}

          {/* AI suggestions — Duolingo quiz-style tappable cards */}
          {aiSuggestions.length > 0 && !isSuggestingBalanced && (
            <View className="mb-5">
              <Text className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                Tap a suggestion to use it
              </Text>
              {aiSuggestions.map(
                (suggestion: AIBalancedThoughtSuggestion, index: number) => {
                  const isSelected: boolean = value === suggestion.text;
                  return (
                    <Pressable
                      key={index}
                      onPress={() => onChange(suggestion.text)}
                      accessibilityRole="button"
                      accessibilityLabel={`Use AI suggestion: ${suggestion.text}`}
                      className="rounded-2xl p-3.5 mb-3 active:opacity-80"
                      style={{
                        borderWidth: 2,
                        borderColor: isSelected ? "#58CC02" : "#E2E8F0",
                        backgroundColor: isSelected ? "#F0FFF0" : "#FFFFFF",
                        minHeight: 48,
                      }}
                    >
                      <View className="flex-row items-start">
                        <View className="flex-1">
                          <Text
                            className={`text-sm leading-relaxed mb-1 font-medium ${isSelected ? "text-green-800" : "text-slate-700"
                              }`}
                          >
                            "{suggestion.text}"
                          </Text>
                          <Text className="text-xs text-slate-400">
                            {suggestion.rationale}
                          </Text>
                        </View>
                        {isSelected && (
                          <View
                            className="h-5 w-5 rounded-full items-center justify-center ml-2 mt-0.5"
                            style={{ backgroundColor: "#58CC02" }}
                          >
                            <Text className="text-white text-[10px] font-extrabold">
                              ✓
                            </Text>
                          </View>
                        )}
                      </View>
                    </Pressable>
                  );
                },
              )}
            </View>
          )}

          <View className="flex-1">
            <VoiceTextInput
              value={value}
              onChangeText={onChange}
              placeholder="e.g., 'My manager is busy. Not responding doesn't mean they dislike my work.'"
              maxLength={300}
            />

            <View
              className="mt-3 rounded-xl p-3 flex-row items-start"
              style={{
                backgroundColor: "#EFF6FF",
                borderWidth: 1.5,
                borderColor: "#BFDBFE",
              }}
            >
              <Text className="text-xs mr-2">💡</Text>
              <Text className="text-xs text-blue-700 leading-relaxed flex-1 font-medium">
                Doesn't have to be positive — just fair and realistic.
              </Text>
            </View>
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

BalancedThoughtStep.displayName = "BalancedThoughtStep";
