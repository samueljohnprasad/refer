import React from "react";
import { View, TextInput, Pressable, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/text";
import { StepProps } from "@/src/types/exerciseFlow";
import { StepLayout } from ".";

interface AITextInputStepProps extends StepProps {
  title: string;
  subtitle: string;
  fieldKey: string;
  placeholder?: string;
  maxLength?: number;
}

export const AITextInputStep: React.FC<AITextInputStepProps> = React.memo(
  ({
    response,
    onUpdate,
    onNext,
    onBack,
    canGoBack,
    isValid,
    progress,
    stepIndex,
    totalSteps,
    title,
    subtitle,
    fieldKey,
    placeholder = "Type here or pick a suggestion...",
    maxLength = 500,
    aiSuggestions = [],
    isAiLoading = false,
    isSaving,
  }) => {
    const value = (response as Record<string, any>)[fieldKey] ?? "";

    const handlePickSuggestion = (text: string) => {
      onUpdate({ [fieldKey]: text } as any);
    };

    return (
      <StepLayout
        title={title}
        subtitle={subtitle}
        progress={progress}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        canGoBack={canGoBack}
        isValid={isValid}
        onBack={onBack}
        onNext={onNext}
        isLoading={isSaving}
        scrollable
      >
        {/* AI suggestions */}
        {isAiLoading && (
          <View className="flex-row items-center mb-3">
            <ActivityIndicator size="small" color="#94A3B8" />
            <Text className="text-[11px] text-slate-400 ml-2 uppercase tracking-wider">
              Generating suggestions...
            </Text>
          </View>
        )}

        {aiSuggestions.length > 0 && !isAiLoading && (
          <View className="mb-4">
            <Text className="text-[11px] text-slate-400 uppercase tracking-wider mb-2">
              AI suggestions — tap to use
            </Text>
            {aiSuggestions.map((suggestion: any, i: number) => {
              const text =
                typeof suggestion === "string"
                  ? suggestion
                  : (suggestion.text ?? JSON.stringify(suggestion));
              const isSelected = value === text;
              return (
                <Pressable
                  key={i}
                  onPress={() => handlePickSuggestion(text)}
                  accessibilityRole="button"
                  accessibilityLabel={`Use suggestion ${i + 1}`}
                  className="rounded-xl p-3 mb-2"
                  style={{
                    backgroundColor: isSelected ? "#F0FFF0" : "#FAFAFA",
                    borderWidth: 2,
                    borderColor: isSelected ? "#58CC02" : "#F1F5F9",
                  }}
                >
                  <Text className="text-sm text-slate-700 leading-relaxed">
                    {text}
                  </Text>
                  {suggestion.rationale && (
                    <Text className="text-xs text-slate-400 mt-1 italic">
                      {suggestion.rationale}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Manual input */}
        <TextInput
          value={value}
          onChangeText={(text) => onUpdate({ [fieldKey]: text } as any)}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          maxLength={maxLength}
          multiline
          textAlignVertical="top"
          accessibilityLabel={title}
          className="text-base text-slate-800 bg-slate-50 rounded-2xl p-4 min-h-[100px]"
          style={{ borderWidth: 2, borderColor: "#E2E8F0" }}
        />
        {maxLength && (
          <Text className="text-xs text-slate-400 text-right mt-1">
            {value.length}/{maxLength}
          </Text>
        )}
      </StepLayout>
    );
  },
);

AITextInputStep.displayName = "AITextInputStep";
