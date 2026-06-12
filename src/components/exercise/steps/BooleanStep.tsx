import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StepLayout } from "./StepLayout";
import { PsychoeducationCard } from "@/src/components/exercise/PsychoeducationCard";
import type { StepProps } from "@/src/types/exerciseFlow";
import { getContentIcon } from "@/src/data/contentIconRegistry";

interface BooleanStepProps extends StepProps {
  title: string;
  subtitle: string;
  fieldKey: string;
  yesLabel?: string;
  noLabel?: string;
  /** Icon key resolved via contentIconRegistry */
  yesIconKey?: string;
  /** Icon key resolved via contentIconRegistry */
  noIconKey?: string;
  /** @deprecated Use yesIconKey instead */
  yesEmoji?: string;
  /** @deprecated Use noIconKey instead */
  noEmoji?: string;
  autoAdvance?: boolean;
  psychoeducationText?: string;
}

export const BooleanStep: React.FC<BooleanStepProps> = React.memo(
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
    yesLabel = "Yes",
    noLabel = "No",
    yesIconKey,
    noIconKey,
    yesEmoji = "✅",
    noEmoji = "❌",
    autoAdvance = true,
    isSaving,
    psychoeducationText,
  }) => {
    const value = (response as Record<string, any>)[fieldKey];

    const handleSelect = (val: boolean | string) => {
      onUpdate({ [fieldKey]: val } as any);
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
      >
        <PsychoeducationCard content={psychoeducationText ?? ""} />

        <View className="flex-1 justify-center gap-4">
          {[
            {
              val: true,
              label: yesLabel,
              emoji: yesEmoji,
              iconKey: yesIconKey,
            },
            { val: false, label: noLabel, emoji: noEmoji, iconKey: noIconKey },
          ].map((opt) => {
            const isSelected =
              value === opt.val || value === (opt.val ? "yes" : "no");
            return (
              <Pressable
                key={String(opt.val)}
                onPress={() => handleSelect(opt.val)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={opt.label}
                className="h-16 rounded-2xl flex-row items-center justify-center active:opacity-90"
                style={{
                  backgroundColor: isSelected ? "#F0FFF0" : "#F8FAFC",
                  borderWidth: 2,
                  borderColor: isSelected ? "#58CC02" : "#E2E8F0",
                }}
              >
                {opt.iconKey && getContentIcon(opt.iconKey) ? (
                  <HugeiconsIcon
                    icon={getContentIcon(opt.iconKey)!}
                    size={20}
                    color={isSelected ? "#15803D" : "#475569"}
                    strokeWidth={1.6}
                  />
                ) : (
                  <Text className="text-xl">{opt.emoji}</Text>
                )}
                <View className="w-3" />
                <Text
                  className="text-lg font-bold"
                  style={{ color: isSelected ? "#15803D" : "#1E293B" }}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </StepLayout>
    );
  },
);

BooleanStep.displayName = "BooleanStep";
