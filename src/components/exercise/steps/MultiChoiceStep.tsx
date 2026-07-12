import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StepLayout } from "./StepLayout";
import { PsychoeducationCard } from "@/src/components/exercise/PsychoeducationCard";
import type { StepProps } from "@/src/types/exerciseFlow";
import { getContentIcon } from "@/src/data/contentIconRegistry";

interface MultiChoiceOption {
  value: string;
  label: string;
  /** Icon key resolved via contentIconRegistry */
  iconKey?: string;
  /** @deprecated Use iconKey instead */
  emoji?: string;
}

interface MultiChoiceStepProps extends StepProps {
  title: string;
  subtitle: string;
  fieldKey: string;
  options: MultiChoiceOption[];
  maxSelections?: number;
  psychoeducationText?: string;
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
  }) => {
    const selected: string[] =
      (response as Record<string, any>)[fieldKey] ?? [];
    const atLimit = selected.length >= maxSelections;

    const toggle = (value: string) => {
      if (selected.includes(value)) {
        onUpdate({ [fieldKey]: selected.filter((v) => v !== value) } as any);
      } else if (!atLimit) {
        onUpdate({ [fieldKey]: [...selected, value] } as any);
      }
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
        <PsychoeducationCard content={psychoeducationText ?? ""} />

        <View className="flex-row flex-wrap gap-2">
          {options.map((opt) => {
            const isSelected = selected.includes(opt.value);
            const isDisabled = atLimit && !isSelected;
            return (
              <Pressable
                key={opt.value}
                onPress={() => toggle(opt.value)}
                disabled={isDisabled}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={opt.label}
                className="rounded-xl px-4 py-2.5 flex-row items-center"
                style={{
                  backgroundColor: isSelected
                    ? "#58CC02"
                    : isDisabled
                      ? "#F1F5F9"
                      : "#F8FAFC",
                  borderWidth: 2,
                  borderColor: isSelected ? "#58CC02" : "#E2E8F0",
                  opacity: isDisabled ? 0.5 : 1,
                }}
              >
                {opt.iconKey && getContentIcon(opt.iconKey) ? (
                  <View className="mr-1.5">
                    <HugeiconsIcon
                      icon={getContentIcon(opt.iconKey)!}
                      size={16}
                      color={isSelected ? "#FFFFFF" : "#475569"}
                      strokeWidth={1.6}
                    />
                  </View>
                ) : opt.emoji ? (
                  <Text className="mr-1.5">{opt.emoji}</Text>
                ) : null}
                <Text
                  className="text-sm font-bold"
                  style={{ color: isSelected ? "#FFFFFF" : "#475569" }}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text className="text-xs text-slate-400 mt-3">
          {selected.length}/{maxSelections} selected
        </Text>
      </StepLayout>
    );
  },
);

MultiChoiceStep.displayName = "MultiChoiceStep";
