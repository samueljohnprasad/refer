import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import Slider from "@react-native-community/slider";
import { StepLayout } from "./StepLayout";
import { SAGE } from "@/lib/tokens";
import { FadeInItem } from "@/src/components/ui/FadeInItem";
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
    const value: number =
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
            <FadeInItem index={0}>
              <Text variant="counter" color="sage" className="text-6xl text-center mb-10 happy-font-heading-bold">
                {value}
                {unit}
              </Text>
            </FadeInItem>
          )}

          <FadeInItem index={1}>
            <Slider
              minimumValue={min}
              maximumValue={max}
              step={step}
              value={value}
              onValueChange={(v: number) => onUpdate({ [fieldKey]: v } as any)}
              minimumTrackTintColor={SAGE[500]}
              maximumTrackTintColor="#E5E5E5"
              thumbTintColor={SAGE[500]}
              accessibilityLabel={title}
              accessibilityValue={{ min, max, now: value }}
              style={{ height: 40 }}
            />

            <View className="flex-row justify-between mt-3 px-1">
              <Text variant="caption-muted" color="soft" className="font-semibold">{minLabel}</Text>
              <Text variant="caption-muted" color="soft" className="font-semibold">{maxLabel}</Text>
            </View>
          </FadeInItem>
        </View>
      </StepLayout>
    );
  },
);

SliderStep.displayName = "SliderStep";
