import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StepLayout } from "./StepLayout";
import { PsychoeducationCard } from "@/src/components/exercise/PsychoeducationCard";
import type { StepProps } from "@/src/types/exerciseFlow";
import { getContentIcon } from "@/src/data/contentIconRegistry";
import { SAGE, BRAND_BORDER, BRAND_SURFACE, INK, INK_SOFT } from "@/lib/tokens";
import { triggerSelectionHaptic } from "@/src/components/exercise/selectionHaptics";

export interface MultiChoiceOption {
  value: string;
  label: string;
  /** Icon key resolved via contentIconRegistry */
  iconKey?: string;
  /** @deprecated Use iconKey instead */
  emoji?: string;
}

interface SelectionStorageAdapter {
  deserialize: (value: unknown) => string[];
  serialize: (values: string[]) => unknown;
}

interface MultiChoiceStepProps extends StepProps {
  title: string;
  subtitle: string;
  fieldKey: string;
  options: MultiChoiceOption[];
  maxSelections?: number;
  psychoeducationText?: string;
  layoutVariant?: "default" | "cbt_reflection";
  showStepCount?: boolean;
  selectionStorageAdapter?: SelectionStorageAdapter;
  nextLabel?: string;
  readOnlyNextLabel?: string;
  fallbackValueText?: string;
}

export const MultiChoiceStep: React.FC<MultiChoiceStepProps> = React.memo(
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
    maxSelections = 5,
    isSaving,
    psychoeducationText,
    layoutVariant = "default",
    showStepCount = true,
    selectionStorageAdapter,
    nextLabel,
    readOnlyNextLabel = "Done",
    fallbackValueText,
    readOnly,
    onClose,
  }) => {
    const responseRecord = response as Record<string, unknown>;
    const storedValue = responseRecord[fieldKey];
    const storedSelections = selectionStorageAdapter
      ? selectionStorageAdapter.deserialize(storedValue)
      : Array.isArray(storedValue)
        ? storedValue.filter((value): value is string => typeof value === "string")
        : [];
    const optionValues = new Set(options.map((option) => option.value));
    const selected = storedSelections.filter((value) => optionValues.has(value));
    const atLimit = selected.length >= maxSelections;
    const isCbtReflection = layoutVariant === "cbt_reflection";

    const toggle = (value: string) => {
      if (readOnly) return;

      const nextSelected = selected.includes(value)
        ? selected.filter((selectedValue) => selectedValue !== value)
        : atLimit
          ? selected
          : [...selected, value];

      if (nextSelected === selected) return;

      const nextValue = selectionStorageAdapter
        ? selectionStorageAdapter.serialize(nextSelected)
        : nextSelected;

      onUpdate({ [fieldKey]: nextValue });
    };

    return (
      <StepLayout
        title={title}
        subtitle={subtitle}
        progress={progress}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        canGoBack={canGoBack}
        isValid={isValid || Boolean(readOnly)}
        onBack={onBack}
        onClose={onClose}
        onNext={readOnly ? onClose : onNext}
        nextLabel={readOnly ? readOnlyNextLabel : nextLabel}
        isLoading={isSaving}
        showStepCount={showStepCount}
        scrollable
      >
        <PsychoeducationCard content={psychoeducationText ?? ""} />

        <View className="flex-row flex-wrap gap-2">
          {options.map((opt) => {
            const isSelected = selected.includes(opt.value);
            const isDisabled = atLimit && !isSelected;
            return (
              <Pressable
                key={opt.value}
                onPress={() => {
                  if (isDisabled || readOnly) return;
                  triggerSelectionHaptic();
                  toggle(opt.value);
                }}
                disabled={isDisabled || readOnly}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={opt.label}
                className={`rounded-xl flex-row items-center ${
                  isCbtReflection ? "px-4 py-3" : "px-4 py-2.5"
                }`}
                style={{
                  backgroundColor: isSelected ? SAGE.selected : BRAND_SURFACE,
                  borderWidth: 2,
                  borderColor: isSelected ? SAGE[500] : BRAND_BORDER,
                  opacity: isDisabled || readOnly ? 0.5 : 1,
                }}
              >
                {opt.iconKey && getContentIcon(opt.iconKey) ? (
                  <View className="mr-1.5">
                    <HugeiconsIcon
                      icon={getContentIcon(opt.iconKey)!}
                      size={16}
                      color={isSelected ? SAGE[700] : INK_SOFT}
                      strokeWidth={1.6}
                    />
                  </View>
                ) : opt.emoji ? (
                  <Text className="mr-1.5">{opt.emoji}</Text>
                ) : null}
                <Text
                  className={isCbtReflection ? "text-sm font-semibold" : "text-sm font-bold"}
                  style={{
                    color: isSelected ? SAGE[700] : INK,
                  }}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {fallbackValueText ? (
          <View className="mt-3 gap-1.5">
            <Text
              className={
                isCbtReflection
                  ? "text-xs text-sage-700"
                  : "text-xs text-slate-400"
              }
            >
              {selected.length}/{maxSelections} selected
            </Text>
            <Text
              className={
                isCbtReflection
                  ? "text-xs text-sage-700"
                  : "text-xs text-slate-400"
              }
            >
              Saved answer also includes: {fallbackValueText}
            </Text>
          </View>
        ) : (
          <Text
            className={
              isCbtReflection
                ? "text-xs text-sage-700 mt-3"
                : "text-xs text-slate-400 mt-3"
            }
          >
            {selected.length}/{maxSelections} selected
          </Text>
        )}
      </StepLayout>
    );
  },
);

MultiChoiceStep.displayName = "MultiChoiceStep";
