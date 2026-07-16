import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import Slider from "@react-native-community/slider";
import { StepLayout } from "./StepLayout";
import { SAGE } from "@/lib/tokens";
import { FadeInItem } from "@/src/components/ui/FadeInItem";
import { PsychoeducationCard } from "@/src/components/exercise/PsychoeducationCard";
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
  psychoeducationText?: string;
  anchorValue?: number;
  anchorLabel?: string;
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
    psychoeducationText,
    anchorValue,
    anchorLabel,
  }) => {
    let value: number =
      (response as Record<string, any>)[fieldKey] ??
      Math.round((min + max) / 2);
      
    // Scale down legacy 0-100 data to the new bounds
    if (value > max && max <= 10) {
      value = Math.round((value / 100) * max);
    }
    // Final safety clamp
    value = Math.min(Math.max(value, min), max);

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

        <View className="flex-1 justify-center px-2">
          {showValue && (
            <FadeInItem index={0}>
              <View className="items-center mb-10">
                <Text
                  variant="h1"
                  className="text-5xl text-center tabular-nums font-bold"
                >
                  {value}
                  {unit}
                </Text>
                {typeof anchorValue === "number" && (
                  <View className="mt-2.5 px-3.5 py-1.5 rounded-full bg-sage-100/80 border border-sage-200">
                    <Text className="text-xs font-semibold text-sage-800">
                      {anchorLabel ?? "Before"}: {anchorValue}{unit}
                      {value < anchorValue
                        ? `  (↓ ${anchorValue - value}${unit})`
                        : ""}
                    </Text>
                  </View>
                )}
              </View>
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
              maximumTrackTintColor={SAGE[200]}
              thumbTintColor={SAGE[500]}
              accessibilityLabel={title}
              accessibilityValue={{ min, max, now: value }}
              style={{ height: 40 }}
            />

            <View className="flex-row justify-between mt-3 px-1">
              <Text variant="caption-muted">
                {minLabel}
              </Text>
              <Text variant="caption-muted">
                {maxLabel}
              </Text>
            </View>
          </FadeInItem>
        </View>
      </StepLayout>
    );
  },
);

SliderStep.displayName = "SliderStep";
