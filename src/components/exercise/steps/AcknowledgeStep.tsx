import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { StepLayout } from "./StepLayout";
import type { StepProps } from "@/src/types/exerciseFlow";

interface AcknowledgeStepProps extends StepProps {
  title: string;
  subtitle: string;
  fieldKey: string;
  body: string;
  buttonLabel?: string;
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
          <View
            className="bg-slate-50 rounded-2xl p-5 mb-6"
            style={{ borderWidth: 1, borderColor: "#E2E8F0" }}
          >
            <Text className="text-sm text-slate-700 leading-relaxed">
              {body}
            </Text>
          </View>

          <Pressable
            onPress={() => {
              onUpdate({ [fieldKey]: true } as any);
              setTimeout(onNext, 200);
            }}
            disabled={acknowledged}
            accessibilityRole="button"
            accessibilityLabel={buttonLabel}
            className="h-12 rounded-xl items-center justify-center active:opacity-90"
            style={{
              backgroundColor: acknowledged ? "#D1FAE5" : "#F8FAFC",
              borderWidth: 2,
              borderColor: acknowledged ? "#58CC02" : "#E2E8F0",
            }}
          >
            <Text
              className="text-sm font-bold"
              style={{ color: acknowledged ? "#15803D" : "#475569" }}
            >
              {acknowledged ? "✓ " : ""}
              {buttonLabel}
            </Text>
          </Pressable>
        </View>
      </StepLayout>
    );
  },
);

AcknowledgeStep.displayName = "AcknowledgeStep";
