import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import Slider from "@react-native-community/slider";
import { StepLayout } from "./StepLayout";
import { BRAND_BORDER, INK, SAGE } from "@/lib/tokens";
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
  midLabel?: string;
  maxLabel?: string;
  unit?: string;
  showValue?: boolean;
  helperText?: string;
  contextLabel?: string;
  contextText?: string;
  psychoeducationText?: string;
  anchorValue?: number;
  anchorLabel?: string;
  showStepCount?: boolean;
}

function formatValueForSpeech(value: number, unit: string, max: number): string {
  if (unit.startsWith("/")) {
    return `${value} out of ${unit.slice(1) || max}`;
  }

  return unit ? `${value} ${unit}` : `${value}`;
}

function formatValueForDisplay(value: number, unit: string): string {
  return unit.startsWith("/") ? `${value}${unit}` : `${value}${unit}`;
}

function getActiveLabel(
  value: number,
  min: number,
  max: number,
  minLabel: string,
  midLabel: string | undefined,
  maxLabel: string,
): string | undefined {
  if (!midLabel || max <= min) return undefined;

  const ratio = (value - min) / (max - min);
  if (ratio < 0.34) return minLabel;
  if (ratio < 0.67) return midLabel;
  return maxLabel;
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
    midLabel,
    maxLabel = "High",
    unit = "",
    showValue = true,
    helperText,
    contextLabel,
    contextText,
    isSaving,
    psychoeducationText,
    anchorValue,
    anchorLabel,
    showStepCount = true,
  }) => {
    const savedValue = (response as Record<string, unknown>)[fieldKey];
    let value: number =
      typeof savedValue === "number" ? savedValue : Math.floor((min + max) / 2);

    // Scale down legacy 0-100 data to the new bounds
    if (value > max && max <= 10) {
      value = Math.round((value / 100) * max);
    }
    // Final safety clamp
    value = Math.min(Math.max(value, min), max);
    const spokenValue = formatValueForSpeech(value, unit, max);
    const activeLabel = getActiveLabel(
      value,
      min,
      max,
      minLabel,
      midLabel,
      maxLabel,
    );

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
        showStepCount={showStepCount}
      >
        <PsychoeducationCard content={psychoeducationText ?? ""} />

        <View className="flex-1 px-2 pt-5">
          {contextText ? (
            <FadeInItem index={0}>
              <View
                className="mb-7 rounded-2xl border px-4 py-3"
                style={{
                  borderColor: BRAND_BORDER,
                  backgroundColor: "#FFFFFF",
                }}
              >
                {contextLabel ? (
                  <Text
                    variant="caption"
                    className="mb-1 text-[11px] uppercase tracking-[1px] text-ink-soft"
                  >
                    {contextLabel}
                  </Text>
                ) : null}
                <Text
                  variant="body"
                  className="text-[16px] leading-[24px] text-ink"
                >
                  {contextText}
                </Text>
              </View>
            </FadeInItem>
          ) : null}

          {showValue && (
            <FadeInItem index={contextText ? 1 : 0}>
              <View className="mb-12 min-h-[110px] items-center justify-center">
                <Text
                  variant="counter"
                  className="text-center text-[84px] leading-[76px] text-sage-800"
                >
                  {value}
                </Text>
                {unit ? (
                  <Text
                    className="mt-1 text-[24px] leading-[28px] text-sage-400"
                    style={{ fontFamily: "CormorantMedium" }}
                  >
                    {unit}
                  </Text>
                ) : null}
                {helperText ? (
                  <Text
                    variant="caption"
                    className="mt-2.5 max-w-[280px] text-center text-ink-soft"
                  >
                    {helperText}
                  </Text>
                ) : null}
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

          <FadeInItem index={contextText ? 2 : 1}>
            <View className="px-1">
              <Slider
                minimumValue={min}
                maximumValue={max}
                step={step}
                value={value}
                onValueChange={(v: number) =>
                  onUpdate({ [fieldKey]: v } as Partial<typeof response>)
                }
                minimumTrackTintColor={SAGE[500]}
                maximumTrackTintColor={SAGE[100]}
                thumbTintColor={SAGE[500]}
                accessibilityLabel={title}
                accessibilityHint={`Adjust from ${minLabel} to ${maxLabel}`}
                accessibilityValue={{
                  min,
                  max,
                  now: value,
                  text: `${spokenValue}. ${
                    activeLabel ? `${activeLabel}. ` : ""
                  }${minLabel} to ${maxLabel}.`,
                }}
                style={{ height: 56 }}
              />
            </View>

            {midLabel ? (
              <View className="mt-6 flex-row items-start px-1">
                <Text
                  variant="caption"
                  className="flex-1 text-left text-ink-soft"
                  style={{ color: INK }}
                >
                  {minLabel}
                </Text>
                <Text
                  variant="caption"
                  className="flex-1 text-center text-ink-soft"
                  style={{ color: INK }}
                >
                  {midLabel}
                </Text>
                <Text
                  variant="caption"
                  className="flex-1 text-right text-ink-soft"
                  style={{ color: INK }}
                >
                  {maxLabel}
                </Text>
              </View>
            ) : (
              <View className="flex-row justify-between mt-3 px-1">
                <Text variant="caption" className="text-ink-soft">
                  {minLabel}
                </Text>
                <Text variant="caption" className="text-ink-soft">
                  {maxLabel}
                </Text>
              </View>
            )}
          </FadeInItem>
        </View>
      </StepLayout>
    );
  },
);

SliderStep.displayName = "SliderStep";
