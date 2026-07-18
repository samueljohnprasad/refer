import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/src/store/hooks";
import { setAssistantMessage } from "@/src/store/slices/happyAssistantSlice";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { StepLayout } from "./StepLayout";
import { PsychoeducationCard } from "@/src/components/exercise/PsychoeducationCard";
import { SuggestionCards, type SuggestionItem } from "@/src/components/exercise/SuggestionCards";
import { ReflectionDisclosure } from "@/src/components/exercise/ReflectionStepSections";
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
  composerMinHeight?: number;
  showStepCount?: boolean;
  suggestionsTitle?: string;
  suggestionsHelperText?: string;
  suggestionsCollapsedByDefault?: boolean;
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
    composerMinHeight: configuredComposerMinHeight,
    showStepCount = true,
    suggestionsTitle,
    suggestionsHelperText,
    suggestionsCollapsedByDefault = true,
    aiSuggestions,
    isAiLoading,
    aiLoadingMessage,
    readOnly,
  }) => {
    const dispatch = useAppDispatch();
    const responseRecord = response as Record<string, unknown>;
    const responseItems = responseRecord[fieldKey];
    const items = Array.isArray(responseItems)
      ? responseItems.filter((item): item is string => typeof item === "string")
      : [];
    const composerMinHeight = configuredComposerMinHeight ?? 100;
    const [showSuggestions, setShowSuggestions] = useState(
      !suggestionsCollapsedByDefault,
    );

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
      onUpdate({ [fieldKey]: [...items, trimmed] } as Partial<typeof response>);
    };

    const removeItem = (index: number) => {
      onUpdate({
        [fieldKey]: items.filter((_, i) => i !== index),
      } as Partial<typeof response>);
    };

    const handleSuggestionSelect = (text: string) => {
      if (items.includes(text)) {
        onUpdate({
          [fieldKey]: items.filter((item) => item !== text),
        } as Partial<typeof response>);
      } else {
        if (items.length >= maxItems) return;
        onUpdate({ [fieldKey]: [...items, text] } as Partial<typeof response>);
      }
    };

    const mappedSuggestions: SuggestionItem[] = (aiSuggestions || []).map(
      (suggestion) => ({
        label: suggestion.text,
        emoji: suggestion.emoji,
      }),
    );
    const hasSuggestions = isAiLoading || mappedSuggestions.length > 0;

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
        showStepCount={showStepCount}
        scrollable
      >
        <PsychoeducationCard content={psychoeducationText ?? ""} />

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
              minHeight={composerMinHeight}
            />
          </View>
        )}

        <Text variant="caption" className="mt-2 text-ink-soft">
          {items.length}/{maxItems} items{minItems > 0 ? ` (min ${minItems})` : ""}
        </Text>

        {!readOnly && hasSuggestions ? (
          <ReflectionDisclosure
            expanded={showSuggestions}
            onToggle={() => setShowSuggestions((current) => !current)}
            title={suggestionsTitle ?? "Need an example?"}
          >
            <SuggestionCards
              title=""
              helperText={
                suggestionsHelperText ?? "Use only if it fits. Make the words yours."
              }
              suggestions={mappedSuggestions}
              currentValue={items}
              onSelect={handleSuggestionSelect}
              isLoading={isAiLoading}
              loadingMessage={aiLoadingMessage}
            />
          </ReflectionDisclosure>
        ) : null}
      </StepLayout>
    );
  },
);

MultiTextInputStep.displayName = "MultiTextInputStep";
