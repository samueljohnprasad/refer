import React, { useEffect } from "react";
import { useAppDispatch } from "@/src/store/hooks";
import { setAssistantMessage } from "@/src/store/slices/happyAssistantSlice";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { StepLayout } from "./StepLayout";
import { PsychoeducationCard } from "@/src/components/exercise/PsychoeducationCard";
import { SuggestionCards, type SuggestionItem } from "@/src/components/exercise/SuggestionCards";
import type { StepProps } from "@/src/types/exerciseFlow";
import { ExerciseTextComposer } from "@/src/components/exercise/ExerciseTextComposer";
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
    const addItem = (item: string) => {
      const trimmed = item.trim();
      if (!trimmed || items.length >= maxItems) return;
      onUpdate({ [fieldKey]: [...items, trimmed] } as any);
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
        {(items.length > 0 || !readOnly) && (
          <View className="mt-2" style={{ zIndex: 10 }}>
            <ExerciseTextComposer
              mode="list"
              items={items}
              onAdd={addItem}
              onRemove={removeItem}
              placeholder={placeholder}
              maxItems={maxItems}
              readOnly={readOnly || items.length >= maxItems}
              glow
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
