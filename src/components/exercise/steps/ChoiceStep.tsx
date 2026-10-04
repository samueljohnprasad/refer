import React, { useCallback, useEffect, useMemo } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { StepLayout } from "./StepLayout";
import { PsychoeducationCard } from "@/src/components/exercise/PsychoeducationCard";
import type { StepProps } from "@/src/types/exerciseFlow";
import { triggerSelectionHaptic } from "@/src/components/exercise/selectionHaptics";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";
import {
  ChoiceOptionCard,
  type ChoiceLayoutVariant,
  type ChoiceOption,
} from "./ChoiceOptionCard";

interface ChoiceStepProps extends StepProps {
  title: string;
  subtitle: string;
  fieldKey: string;
  options: ChoiceOption[];
  autoAdvance?: boolean;
  psychoeducationText?: string;
  showStepCount?: boolean;
  layoutVariant?: ChoiceLayoutVariant;
}

export const ChoiceStep: React.FC<ChoiceStepProps> = React.memo(
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
    options,
    autoAdvance = false,
    isSaving,
    psychoeducationText,
    aiSuggestions,
    isAiLoading,
    showStepCount = true,
    layoutVariant = "default",
  }) => {
    const translateCopy = useExerciseCopy();
    const selected = (response as Record<string, unknown>)[fieldKey];
    const resolvedOptions = useMemo(
      () =>
        options.map((option) => ({
          ...option,
          label: translateCopy(option.label),
          description: option.description
            ? translateCopy(option.description)
            : undefined,
        })),
      [options, translateCopy],
    );
    const aiMappedOptions = useMemo(
      () =>
        (aiSuggestions ?? []).map((suggestion) => ({
          value: suggestion.text,
          label: suggestion.text,
          emoji: suggestion.emoji || "✨",
          description:
            typeof suggestion.category === "string"
              ? suggestion.category
              : typeof suggestion.description === "string"
                ? suggestion.description
                : undefined,
        })),
      [aiSuggestions],
    );

    const handleSelect = useCallback(
      (value: string) => {
        onUpdate({ [fieldKey]: value } as Partial<typeof response>);
        if (autoAdvance) setTimeout(onNext, 300);
      },
      [autoAdvance, fieldKey, onNext, onUpdate],
    );

    useEffect(() => {
      if (Platform.OS !== "web" || typeof window === "undefined") return;
      const handleKeyDown = (event: KeyboardEvent) => {
        const number = parseInt(event.key, 10);
        if (!isNaN(number) && number >= 1 && number <= resolvedOptions.length) {
          handleSelect(resolvedOptions[number - 1].value);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleSelect, resolvedOptions]);

    const selectOption = (value: string) => {
      if (layoutVariant === "cbt_reflection") triggerSelectionHaptic();
      handleSelect(value);
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
        showStepCount={showStepCount}
      >
        <PsychoeducationCard content={translateCopy(psychoeducationText ?? "")} />
        <View className={isAiLoading ? "min-h-[36px] justify-center mb-4" : ""}>
          {isAiLoading ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" />
              <Text className="text-[11px] text-slate-400 ml-2 uppercase tracking-wider">
                {translateCopy("Finding personalized options…")}
              </Text>
            </View>
          ) : null}
        </View>

        <View className="gap-3 w-full">
          {resolvedOptions.map((option, index) => (
            <ChoiceOptionCard
              key={option.value}
              option={option}
              index={index}
              selected={selected === option.value}
              layoutVariant={layoutVariant}
              onSelect={selectOption}
            />
          ))}

          {aiMappedOptions.length > 0 ? (
            <View className="mt-2">
              <Text className="text-xs font-extrabold text-ink-muted uppercase tracking-wider mb-3 ml-1">
                {translateCopy("AI Picks")}
              </Text>
              <View className="gap-3 w-full">
                {aiMappedOptions.map((option, index) => (
                  <ChoiceOptionCard
                    key={`ai-${index}`}
                    option={option}
                    index={index}
                    selected={selected === option.value}
                    layoutVariant="default"
                    onSelect={handleSelect}
                  />
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </StepLayout>
    );
  },
);

ChoiceStep.displayName = "ChoiceStep";
