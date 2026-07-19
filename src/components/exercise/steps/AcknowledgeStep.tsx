import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Button } from "@/src/components/ui/Button";
import { StepLayout } from "./StepLayout";
import { PsychoeducationCard } from "@/src/components/exercise/PsychoeducationCard";
import type { StepProps } from "@/src/types/exerciseFlow";

interface AcknowledgeStepProps extends StepProps {
  title: string;
  subtitle: string;
  fieldKey: string;
  body: string;
  buttonLabel?: string;
  psychoeducationText?: string;
}

export const AcknowledgeStep: React.FC<AcknowledgeStepProps> = React.memo(
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
    body,
    buttonLabel = "I understand",
    isSaving,
    psychoeducationText,
  }) => {
    const acknowledged = (response as Record<string, any>)[fieldKey] === true;

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
        <View className="flex-1">
          <PsychoeducationCard content={psychoeducationText ?? ""} />

          <View
            className="bg-brand-surface rounded-2xl p-6 mb-8 border border-brand-border"
          >
            <Text className="text-base text-ink leading-relaxed font-medium text-center">
              {body}
            </Text>
          </View>

          <Button
            label={acknowledged ? `✓  ${buttonLabel}` : buttonLabel}
            onPress={() => {
              onUpdate({ [fieldKey]: true } as any);
              setTimeout(onNext, 400);
            }}
            disabled={acknowledged}
            variant={acknowledged ? "correct" : "primary"}
            size="lg"
            fullWidth
          />
        </View>
      </StepLayout>
    );
  },
);

AcknowledgeStep.displayName = "AcknowledgeStep";
