import React from "react";
import { View, useWindowDimensions } from "react-native";
import { StepLayout } from "./StepLayout";
import { PsychoeducationCard } from "@/src/components/exercise/PsychoeducationCard";
import { FadeInItem } from "@/src/components/ui/FadeInItem";
import type { StepProps } from "@/src/types/exerciseFlow";
import { BalanceSlider } from "@/src/animations/balance-slider/components/balance-slider";

interface ColorScheme {
  box: string;
  label: string;
  percentage: string;
}

interface BalanceSliderStepProps extends StepProps {
  title: string;
  subtitle: string;
  fieldKey: string;
  leftLabel: string;
  rightLabel: string;
  colors?: {
    left: ColorScheme;
    right: ColorScheme;
  };
  leftPercentageLimitBeforeShift?: number;
  rightPercentageLimitBeforeShift?: number;
  sliderHeight?: number;
  psychoeducationText?: string;
}

const DEFAULT_COLORS = {
  left: {
    box: "#F1F5F9", // Slate 100
    label: "#475569", // Slate 600
    percentage: "#1E293B", // Slate 800
  },
  right: {
    box: "#ECFDF5", // Emerald 50
    label: "#059669", // Emerald 600
    percentage: "#064E3B", // Emerald 900
  },
};

export const BalanceSliderStep: React.FC<BalanceSliderStepProps> = React.memo(
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
    leftLabel,
    rightLabel,
    colors = DEFAULT_COLORS,
    leftPercentageLimitBeforeShift = 0.2,
    rightPercentageLimitBeforeShift = 0.8,
    sliderHeight = 60,
    isSaving,
    psychoeducationText,
  }) => {
    const { width: screenWidth } = useWindowDimensions();
    // Assuming standard padding of 24 on each side for the container
    const PADDING_HORIZONTAL = 24;
    const sliderWidth = screenWidth - PADDING_HORIZONTAL * 2;

    const value: number =
      (response as Record<string, any>)[fieldKey] ?? 0.5;

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

        <View className="flex-1 justify-center items-center" style={{ paddingHorizontal: PADDING_HORIZONTAL }}>
          <FadeInItem index={0}>
            <BalanceSlider
              width={sliderWidth}
              height={sliderHeight}
              leftLabel={leftLabel}
              rightLabel={rightLabel}
              colors={colors}
              initialPercentage={value}
              onChange={({ leftPercentage }) => {
                onUpdate({ [fieldKey]: leftPercentage } as any);
              }}
              leftPercentageLimitBeforeShift={leftPercentageLimitBeforeShift}
              rightPercentageLimitBeforeShift={rightPercentageLimitBeforeShift}
            />
          </FadeInItem>
        </View>
      </StepLayout>
    );
  },
);

BalanceSliderStep.displayName = "BalanceSliderStep";
