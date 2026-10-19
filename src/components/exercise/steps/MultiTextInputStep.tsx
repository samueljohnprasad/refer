import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/src/store/hooks";
import { setAssistantMessage } from "@/src/store/slices/happyAssistantSlice";
import { View } from "react-native";
import { useComposerVoice } from "@/src/components/exercise/hooks/useComposerVoice";
import { Text } from "@/src/components/ui/Text";
import { StepLayout } from "./StepLayout";
import { PsychoeducationCard } from "@/src/components/exercise/PsychoeducationCard";
import { SuggestionCards, type SuggestionItem } from "@/src/components/exercise/SuggestionCards";
import { ReflectionDisclosure } from "@/src/components/exercise/ReflectionStepSections";
import type { StepProps } from "@/src/types/exerciseFlow";
import { ExerciseTextComposer } from "@/src/components/exercise/ExerciseTextComposer";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";
import { useTranslation } from "react-i18next";
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
  tipText?: string;
  tipIcon?: string;
  showVoice?: boolean;
  alwaysShowVoice?: boolean;
  composerGlow?: boolean;
  showExamplesInitially?: boolean;
  referenceQuote?: {
    label: string;
    text: string;
  };
  suggestions?: SuggestionItem[];
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
    textOnly,
    autoFocus = true,
    tipText,
    tipIcon,
    showVoice,
    alwaysShowVoice,
    composerGlow,
    showExamplesInitially,
    referenceQuote,
    suggestions,
  }) => {
    const translateCopy = useExerciseCopy();
    const { t } = useTranslation("exercises");
    const dispatch = useAppDispatch();
    const responseRecord = response as Record<string, unknown>;
    const responseItems = responseRecord[fieldKey];
    
    const isStringMode = typeof responseItems === "string";
    const isSingleMode = isStringMode || maxItems === 1;

    const items = Array.isArray(responseItems)
      ? responseItems.filter((item): item is string => typeof item === "string")
      : (isStringMode && responseItems.trim() !== "" ? [responseItems] : []);

    const singleValue = isStringMode ? ((responseItems as string) ?? "") : (items[0] ?? "");

    const composerMinHeight = configuredComposerMinHeight ?? 110;
    const [showSuggestions, setShowSuggestions] = useState(
      !suggestionsCollapsedByDefault,
    );

    const handleSingleChange = (text: string) => {
      if (isStringMode) {
        onUpdate({ [fieldKey]: text } as Partial<typeof response>);
      } else {
        onUpdate({ [fieldKey]: text.trim() ? [text] : [] } as Partial<typeof response>);
      }
    };

    const {
      canUseVoice,
      isRecording,
      isTranscribing,
      voiceError,
      handleToggleRecording,
    } = useComposerVoice({
      enabled: !textOnly && (Boolean(showVoice) || Boolean(alwaysShowVoice)),
      currentValue: singleValue,
      onTranscription: handleSingleChange,
    });

    useEffect(() => {
      if (validationMessage && (singleValue.length > 0 || items.length > 0)) {
        dispatch(setAssistantMessage(validationMessage));
      } else {
        dispatch(setAssistantMessage(null));
      }
      return () => {
        dispatch(setAssistantMessage(null));
      };
    }, [validationMessage, singleValue.length, items.length, dispatch]);

    const addItem = (item: string) => {
      const trimmed = item.trim();
      if (!trimmed) return;
      
      if (isSingleMode) {
        handleSingleChange(trimmed);
      } else {
        if (items.length >= maxItems) return;
        onUpdate({ [fieldKey]: [...items, trimmed] } as Partial<typeof response>);
      }
    };

    const removeItem = (index: number) => {
      if (isSingleMode) {
        handleSingleChange("");
      } else {
        onUpdate({
          [fieldKey]: items.filter((_, i) => i !== index),
        } as Partial<typeof response>);
      }
    };

    const handleSuggestionSelect = (text: string) => {
      if (isSingleMode) {
        handleSingleChange(text);
      } else {
        if (items.includes(text)) {
          onUpdate({
            [fieldKey]: items.filter((item) => item !== text),
          } as Partial<typeof response>);
        } else {
          if (items.length >= maxItems) return;
          onUpdate({ [fieldKey]: [...items, text] } as Partial<typeof response>);
        }
      }
    };

    const mappedSuggestions: SuggestionItem[] = [
      ...(suggestions || []).map((suggestion) => ({
        ...suggestion,
        label: translateCopy(suggestion.label),
      })),
      ...(aiSuggestions || []).map((suggestion) => ({
        label: suggestion.text,
        emoji: suggestion.emoji,
      })),
    ];
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
        {psychoeducationText ? (
          <PsychoeducationCard content={translateCopy(psychoeducationText)} />
        ) : null}
        {tipText ? (
          <PsychoeducationCard content={translateCopy(tipText)} />
        ) : null}

        {(isSingleMode || items.length > 0 || !readOnly) && (
          <View className="mt-2" style={{ zIndex: 10 }}>
            {isSingleMode ? (
              <ExerciseTextComposer
                value={singleValue}
                onChange={handleSingleChange}
                placeholder={translateCopy(placeholder)}
                minHeight={composerMinHeight}
                maxLength={maxLength}
                readOnly={readOnly}
                autoFocus={autoFocus}
                accessibilityLabel={translateCopy(title)}
                onWavePress={handleToggleRecording}
                isRecording={isRecording}
                isTranscribing={isTranscribing}
                showVoice={canUseVoice}
                alwaysShowVoice={alwaysShowVoice}
              />
            ) : (
              <ExerciseTextComposer
                mode="list"
                items={items}
                onAdd={addItem}
                onRemove={removeItem}
                placeholder={translateCopy(placeholder)}
                maxItems={maxItems}
                maxLength={maxLength}
                readOnly={readOnly}
                textOnly={textOnly}
                minHeight={composerMinHeight}
                autoFocus={autoFocus}
                accessibilityLabel={translateCopy(title)}
              />
            )}
            {voiceError ? (
              <Text className="mt-2 text-[13px] leading-relaxed text-ink-soft">
                {voiceError}
              </Text>
            ) : null}
          </View>
        )}

        {maxItems > 1 && (
          <Text variant="caption" className="mt-2 text-ink-soft">
            {t("flow.ui.itemsCount", {
              count: items.length,
              max: maxItems,
              minimum:
                minItems > 0 ? t("flow.ui.minimumItems", { count: minItems }) : "",
            })}
          </Text>
        )}

        {!readOnly && hasSuggestions ? (
          <ReflectionDisclosure
            expanded={showSuggestions}
            onToggle={() => setShowSuggestions((current) => !current)}
            title={translateCopy(suggestionsTitle ?? "Need an example?")}
          >
            <SuggestionCards
              title=""
              helperText={
                translateCopy(
                  suggestionsHelperText ?? "Use only if it fits. Make the words yours.",
                )
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
