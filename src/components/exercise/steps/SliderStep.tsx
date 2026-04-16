import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import Slider from "@react-native-community/slider";
import { StepLayout } from "./StepLayout";
import type { StepProps } from "@/src/types/exerciseFlow";

interface SliderStepProps extends StepProps {
  title: string;
  subtitle: string;
  fieldKey: string;
  min?: number;
  max?: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
  unit?: string;
  showValue?: boolean;
}

export const SliderStep: React.FC<SliderStepProps> = React.memo(
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
    min = 0,
    max = 10,
    step = 1,
    minLabel = "Low",
    maxLabel = "High",
    unit = "",
    showValue = true,
    isSaving,
  }) => {
    const value =
      (response as Record<string, any>)[fieldKey] ??
      Math.round((min + max) / 2);

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
        <View className="flex-1 justify-center px-2">
          {showValue && (
            <Text className="text-5xl font-extrabold text-slate-900 text-center mb-8">
              {value}
              {unit}
            </Text>
          )}

          <Slider
            minimumValue={min}
            maximumValue={max}
            step={step}
            value={value}
            onValueChange={(v: number) => onUpdate({ [fieldKey]: v } as any)}
            minimumTrackTintColor="#1E293B"
            maximumTrackTintColor="#E2E8F0"
            thumbTintColor="#1E293B"
            accessibilityLabel={title}
            accessibilityValue={{ min, max, now: value }}
          />

          <View className="flex-row justify-between mt-2">
            <Text className="text-xs text-slate-400">{minLabel}</Text>
            <Text className="text-xs text-slate-400">{maxLabel}</Text>
          </View>
        </View>
      </StepLayout>
    );
  },
);

SliderStep.displayName = "SliderStep";
