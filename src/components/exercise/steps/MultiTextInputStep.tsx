import React, { useState, useEffect } from "react";
import { useAppDispatch } from "@/src/store/hooks";
import { setAssistantMessage } from "@/src/store/slices/happyAssistantSlice";
import { View, TextInput, Pressable, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/text";
import { StepLayout } from "./StepLayout";
import { ValidationMessage } from "@/src/components/exercise/ValidationMessage";
import { PsychoeducationCard } from "@/src/components/exercise/PsychoeducationCard";
import { SuggestionCards, type SuggestionItem } from "@/src/components/exercise/SuggestionCards";
import type { StepProps, AISuggestionItem } from "@/src/types/exerciseFlow";
import GlowyInput from "@/src/components/GlowyInput";
interface MultiTextInputStepProps extends StepProps {
  title: string;
  subtitle: string;
  fieldKey: string;
  placeholder?: string;
  minItems?: number;
  maxItems?: number;
  maxLength?: number;
  validationMessage?: string;
  psychoeducationText?: string;
}

export const MultiTextInputStep: React.FC<MultiTextInputStepProps> = React.memo(
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
    placeholder = "Add an item...",
    minItems = 1,
    maxItems = 10,
    maxLength = 200,
    isSaving,
    validationMessage,
    psychoeducationText,
    aiSuggestions,
    isAiLoading,
    aiLoadingMessage,
    readOnly,
  }) => {
    const dispatch = useAppDispatch();
    const items: string[] = (response as Record<string, any>)[fieldKey] ?? [];

    useEffect(() => {
      if (validationMessage && items.length > 0) {
        dispatch(setAssistantMessage(validationMessage));
      } else {
        dispatch(setAssistantMessage(null));
      }
      return () => {
        dispatch(setAssistantMessage(null));
      };
    }, [validationMessage, items.length, dispatch]);
    const [draft, setDraft] = useState("");

    const addItem = () => {
      const trimmed = draft.trim();
      if (!trimmed || items.length >= maxItems) return;
      onUpdate({ [fieldKey]: [...items, trimmed] } as any);
      setDraft("");
    };

    const removeItem = (index: number) => {
      onUpdate({ [fieldKey]: items.filter((_, i) => i !== index) } as any);
    };

    const handleSuggestionSelect = (text: string) => {
      if (items.includes(text)) {
        onUpdate({ [fieldKey]: items.filter((i) => i !== text) } as any);
      } else {
        if (items.length >= maxItems) return;
        onUpdate({ [fieldKey]: [...items, text] } as any);
      }
    };

    const mappedSuggestions: SuggestionItem[] = (aiSuggestions || []).map(
      (s: any) => ({
        label: s.text || s.label,
        emoji: s.emoji,
      })
    );

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
        <PsychoeducationCard content={psychoeducationText ?? ""} />

        {!readOnly && (isAiLoading || mappedSuggestions.length > 0) && (
          <SuggestionCards
            title="AI Suggestions"
            suggestions={mappedSuggestions}
            currentValue={items}
            onSelect={handleSuggestionSelect}
            isLoading={isAiLoading}
            loadingMessage={aiLoadingMessage}
          />
        )}

        {/* Existing items */}
        {items.map((item, i) => (
          <View
            key={i}
            className="flex-row items-center bg-slate-50 rounded-xl p-3 mb-2"
            style={{ borderWidth: 1, borderColor: "#E2E8F0" }}
          >
            <Text className="text-sm text-slate-400 font-bold mr-3">
              {i + 1}.
            </Text>
            <Text className="text-sm text-slate-700 flex-1">{item}</Text>
            {!readOnly && (
              <Pressable
                onPress={() => removeItem(i)}
                accessibilityRole="button"
                accessibilityLabel={`Remove item ${i + 1}`}
                hitSlop={8}
              >
                <Text className="text-slate-400 text-lg">✕</Text>
              </Pressable>
            )}
          </View>
        ))}

        {/* Input row */}
        {!readOnly && items.length < maxItems && (
          <View className="mt-2" style={{ zIndex: 10 }}>
            <GlowyInput
              message={draft}
              setMessage={setDraft}
              handleSendMessage={addItem}
              handleSubmitEditing={addItem as any}
              placeholder={placeholder}
            />
          </View>
        )}

        <Text className="text-xs text-slate-400 mt-2">
          {items.length}/{maxItems} items
          {minItems > 0 ? ` (min ${minItems})` : ""}
        </Text>
      </StepLayout>
    );
  },
);

MultiTextInputStep.displayName = "MultiTextInputStep";
