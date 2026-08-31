import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
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
  valueScale?: number; // Defaults to 100 so state saves as 0-100
}

const DEFAULT_COLORS = {
  left: {
    box: SEMANTIC_COLORS.surface.secondary,
    label: SEMANTIC_COLORS.text.secondary,
    percentage: SEMANTIC_COLORS.text.primary,
  },
  right: {
    box: SEMANTIC_COLORS.brand.soft,
    label: SEMANTIC_COLORS.text.secondary,
    percentage: SEMANTIC_COLORS.brand.pressed,
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
    valueScale = 100,
  }) => {
    const { width: screenWidth } = useWindowDimensions();
    // Assuming standard padding of 24 on each side for the container
    const PADDING_HORIZONTAL = 24;
    const sliderWidth = screenWidth - PADDING_HORIZONTAL * 2;

    // Get the saved value (e.g. 50) and convert it to 0-1 for the component
    const savedValue = (response as Record<string, any>)[fieldKey];
    const value: number = savedValue !== undefined ? savedValue / valueScale : 0.5;

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
                onUpdate({ [fieldKey]: Math.round(leftPercentage * valueScale) } as any);
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
