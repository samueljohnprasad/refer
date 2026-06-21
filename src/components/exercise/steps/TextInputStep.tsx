import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useAppDispatch } from "@/src/store/hooks";
import { setAssistantMessage } from "@/src/store/slices/happyAssistantSlice";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Idea01Icon } from "@hugeicons/core-free-icons";
import { StepLayout } from "./StepLayout";
import { SAGE } from "@/lib/tokens";
import { FadeInItem } from "@/src/components/ui/FadeInItem";
import { ValidationMessage } from "@/src/components/exercise/ValidationMessage";
import { PsychoeducationCard } from "@/src/components/exercise/PsychoeducationCard";
import { VoiceTextInput } from "@/src/screens/ThoughtReframingScreen/components/VoiceTextInput";
import { SuggestionCards, type SuggestionItem } from "@/src/components/exercise/SuggestionCards";
import type { StepProps, AISuggestionItem } from "@/src/types/exerciseFlow";

interface TextInputStepProps extends StepProps {
  title: string;
  subtitle: string;
  fieldKey: string;
  placeholder?: string;
  maxLength?: number;
  tipText?: string;
  validationMessage?: string;
  psychoeducationText?: string;
  suggestions?: SuggestionItem[];
  suggestionsTitle?: string;
}

export const TextInputStep: React.FC<TextInputStepProps> = React.memo(
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
    placeholder = "Type here...",
    maxLength = 500,
    tipText,
    isSaving,
    validationMessage,
    psychoeducationText,
    aiSuggestions,
    isAiLoading,
    aiLoadingMessage,
    suggestions,
    suggestionsTitle,
    readOnly,
  }) => {
    const dispatch = useAppDispatch();
    const value: string = (response as Record<string, any>)[fieldKey] ?? "";

    useEffect(() => {
      if (validationMessage && value.trim().length > 0) {
        dispatch(setAssistantMessage(validationMessage));
      } else {
        dispatch(setAssistantMessage(null));
      }
      return () => {
        dispatch(setAssistantMessage(null));
      };
    }, [validationMessage, value, dispatch]);

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
      >
        <PsychoeducationCard content={psychoeducationText ?? ""} />

        {tipText && (
          <FadeInItem index={0}>
            <View className="rounded-2xl p-4 mb-5 flex-row items-start bg-sage-pill border border-sage-200/50">
              <View className="h-8.5 w-8.5 rounded-xl bg-sage-50 items-center justify-center mr-3 mt-0.5 shadow-sm">
                <HugeiconsIcon
                  icon={Idea01Icon}
                  size={18}
                  color={SAGE[500]}
                  strokeWidth={2}
                />
              </View>
              <Text
                variant="body"
                color="soft"
                className="text-[14.5px] leading-relaxed flex-1 font-medium text-sage-800"
              >
                {tipText}
              </Text>
            </View>
          </FadeInItem>
        )}

        <FadeInItem index={tipText ? 1 : 0} className="flex-1">
          {suggestions && suggestions.length > 0 && (
            <SuggestionCards
              title={suggestionsTitle || "Quick picks"}
              suggestions={suggestions}
              currentValue={value}
              onSelect={(text) => onUpdate({ [fieldKey]: text } as any)}
              readOnly={readOnly}
            />
          )}

          {(isAiLoading || (aiSuggestions && aiSuggestions.length > 0)) && (
            <SuggestionCards
              title="Tap a suggestion to use it"
              suggestions={aiSuggestions?.map((s: AISuggestionItem) => ({
                label: s.text,
                emoji: s.emoji,
                rationale: s.rationale,
              })) || []}
              isLoading={isAiLoading}
              loadingMessage={aiLoadingMessage}
              onSelect={(text) => onUpdate({ [fieldKey]: text } as any)}
              currentValue={value}
            />
          )}

          <VoiceTextInput
            value={value}
            onChangeText={(text) => onUpdate({ [fieldKey]: text } as any)}
            placeholder={placeholder}
            maxLength={maxLength}
            showCharCount
            minHeight={140}
          />
        </FadeInItem>
      </StepLayout>
    );
  },
);

TextInputStep.displayName = "TextInputStep";
