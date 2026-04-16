import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StepLayout } from "./StepLayout";
import type { StepProps } from "@/src/types/exerciseFlow";
import { getContentIcon } from "@/src/data/contentIconRegistry";

interface ChoiceOption {
  value: string;
  label: string;
  /** Icon key resolved via contentIconRegistry */
  iconKey?: string;
  /** @deprecated Use iconKey instead */
  emoji?: string;
  description?: string;
}

interface ChoiceStepProps extends StepProps {
  title: string;
  subtitle: string;
  fieldKey: string;
  options: ChoiceOption[];
  autoAdvance?: boolean;
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
  }) => {
    const selected = (response as Record<string, any>)[fieldKey];

    const handleSelect = (value: string) => {
      onUpdate({ [fieldKey]: value } as any);
      if (autoAdvance) {
        setTimeout(onNext, 300);
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
        <View className="gap-3">
          {options.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => handleSelect(opt.value)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={opt.label}
                className="rounded-2xl p-4 flex-row items-center active:opacity-90"
                style={{
                  backgroundColor: isSelected ? "#F0FFF0" : "#F8FAFC",
                  borderWidth: 2,
                  borderColor: isSelected ? "#58CC02" : "#E2E8F0",
                }}
              >
                {opt.iconKey && getContentIcon(opt.iconKey) ? (
                  <View className="mr-3">
                    <HugeiconsIcon
                      icon={getContentIcon(opt.iconKey)!}
                      size={24}
                      color={isSelected ? "#15803D" : "#475569"}
                      strokeWidth={1.6}
                    />
                  </View>
                ) : opt.emoji ? (
                  <Text className="text-2xl mr-3">{opt.emoji}</Text>
                ) : null}
                <View className="flex-1">
                  <Text
                    className="text-base font-bold"
                    style={{ color: isSelected ? "#15803D" : "#1E293B" }}
                  >
                    {opt.label}
                  </Text>
                  {opt.description && (
                    <Text className="text-xs text-slate-500 mt-0.5">
                      {opt.description}
                    </Text>
                  )}
                </View>
                {isSelected && <Text className="text-lg ml-2">✓</Text>}
              </Pressable>
            );
          })}
        </View>
      </StepLayout>
    );
  },
);

ChoiceStep.displayName = "ChoiceStep";
