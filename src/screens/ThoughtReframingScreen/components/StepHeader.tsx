import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";

interface StepHeaderProps {
  title: string;
  subtitle: string;
  progress?: number;
  stepNumber?: number;
  totalSteps?: number;
  accentColor?: string;
  showProgressBar?: boolean;
  showStepCount?: boolean;
}

export const StepHeader: React.FC<StepHeaderProps> = React.memo(
  ({ title, subtitle, stepNumber, totalSteps, showStepCount = true }) => {
    const hasStepCount =
      showStepCount &&
      typeof stepNumber === "number" &&
      typeof totalSteps === "number" &&
      totalSteps > 0;

    return (
      <View className="mb-5 w-full">
        {hasStepCount ? (
          <Text variant="caption" className="mb-2 text-sage-700">
            Step {stepNumber} of {totalSteps}
          </Text>
        ) : null}

        <Text variant="h1" className="mb-1.5 leading-snug">
          {title}
        </Text>

        {subtitle ? (
          <Text variant="body" className="text-[16px] leading-[23px] text-ink-soft">
            {subtitle}
          </Text>
        ) : null}
      </View>
    );
  },
);

StepHeader.displayName = "StepHeader";
