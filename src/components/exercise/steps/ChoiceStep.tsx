import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StepLayout } from "./StepLayout";
import { PsychoeducationCard } from "@/src/components/exercise/PsychoeducationCard";
import { SAGE, INK_SOFT } from "@/lib/tokens";
import { getContentIcon } from "@/src/data/contentIconRegistry";
import { FadeInItem } from "@/src/components/ui/FadeInItem";
import type { StepProps } from "@/src/types/exerciseFlow";

interface ChoiceOption {
  value: string;
  label: string;
  iconKey?: string;
  emoji?: string;
  description?: string;
}

interface ChoiceStepProps extends StepProps {
  title: string;
  subtitle: string;
  fieldKey: string;
  options: ChoiceOption[];
  autoAdvance?: boolean;
  psychoeducationText?: string;
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
        <PsychoeducationCard content={psychoeducationText ?? ""} />

        <View className="gap-3 w-full">
          {options.map((opt, i) => {
            const isSelected = selected === opt.value;
            const resolvedIcon = opt.iconKey
              ? getContentIcon(opt.iconKey)
              : null;

            return (
              <FadeInItem key={opt.value} index={i} delayPerItem={40}>
                <Card
                  variant={isSelected ? "answer-selected" : "answer"}
                  radius="xl"
                  onPress={() => handleSelect(opt.value)}
                  className="mb-1"
                  contentClassName="flex-row items-center justify-between p-4.5"
                >
                  {resolvedIcon ? (
                    <View className="mr-3.5 h-10 w-10 items-center justify-center rounded-xl bg-sage-50">
                      <HugeiconsIcon
                        icon={resolvedIcon}
                        size={22}
                        color={isSelected ? SAGE[600] : INK_SOFT}
                        strokeWidth={2}
                      />
                    </View>
                  ) : opt.emoji ? (
                    <Text className="text-2xl mr-3.5">{opt.emoji}</Text>
                  ) : null}

                  <View className="flex-1 mr-2">
                    <Text
                      variant="body-bold"
                      color={isSelected ? "ink" : "soft"}
                      className="text-[16px] leading-tight"
                    >
                      {opt.label}
                    </Text>
                    {opt.description && (
                      <Text variant="caption-muted" className="mt-1">
                        {opt.description}
                      </Text>
                    )}
                  </View>

                  <View className="ml-2">
                    {isSelected ? (
                      <View className="w-6 h-6 rounded-full items-center justify-center bg-sage-500 border border-sage-600">
                        <Text
                          variant="chip"
                          color="surface"
                          className="font-extrabold text-[11px] leading-none"
                        >
                          ✓
                        </Text>
                      </View>
                    ) : (
                      <View className="w-6 h-6 rounded-full border-2 border-brand-border bg-brand-surface" />
                    )}
                  </View>
                </Card>
              </FadeInItem>
            );
          })}
        </View>
      </StepLayout>
    );
  },
);

ChoiceStep.displayName = "ChoiceStep";
