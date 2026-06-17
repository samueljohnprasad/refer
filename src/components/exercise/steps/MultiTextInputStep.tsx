import React, { useState } from "react";
import { View, TextInput, Pressable, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/text";
import { StepLayout } from "./StepLayout";
import { ValidationMessage } from "@/src/components/exercise/ValidationMessage";
import { PsychoeducationCard } from "@/src/components/exercise/PsychoeducationCard";
import { SuggestionCards, SuggestionItem } from "@/src/components/exercise/SuggestionCards";
import type { StepProps } from "@/src/types/exerciseFlow";

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
    readOnly,
  }) => {
    const items: string[] = (response as Record<string, any>)[fieldKey] ?? [];
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

    const suggestions = (aiSuggestions ?? []) as SuggestionItem[];

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

        <ValidationMessage
          message={validationMessage ?? ""}
          visible={!!validationMessage && items.length > 0}
        />

        {isAiLoading && (
          <View className="flex-row items-center mb-4">
            <ActivityIndicator size="small" color="#94A3B8" />
            <Text className="text-[11px] text-slate-400 ml-2 uppercase tracking-wider">
              Finding potential suggestions…
            </Text>
          </View>
        )}

        {!readOnly && (!isAiLoading) && suggestions.length > 0 && (
          <SuggestionCards
            title="AI Suggestions"
            suggestions={suggestions}
            currentValue={items}
            onSelect={handleSuggestionSelect}
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
            <Pressable
              onPress={() => removeItem(i)}
              accessibilityRole="button"
              accessibilityLabel={`Remove item ${i + 1}`}
              hitSlop={8}
            >
              <Text className="text-slate-400 text-lg">✕</Text>
            </Pressable>
          </View>
        ))}

        {/* Input row */}
        {items.length < maxItems && (
          <View className="flex-row items-center mt-2">
            <TextInput
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={addItem}
              placeholder={placeholder}
              placeholderTextColor="#94A3B8"
              maxLength={maxLength}
              returnKeyType="done"
              accessibilityLabel="Add item"
              className="flex-1 text-sm text-slate-800 bg-white rounded-xl p-3 mr-2"
              style={{ borderWidth: 2, borderColor: "#E2E8F0" }}
            />
            <Pressable
              onPress={addItem}
              disabled={!draft.trim()}
              accessibilityRole="button"
              accessibilityLabel="Add"
              className="h-11 w-11 rounded-xl items-center justify-center"
              style={{
                backgroundColor: draft.trim() ? "#58CC02" : "#E2E8F0",
              }}
            >
              <Text className="text-white font-bold text-lg">+</Text>
            </Pressable>
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
