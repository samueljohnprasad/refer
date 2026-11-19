import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { StepHappiTitle } from "@/src/components/exercise/steps/StepHappiTitle";

interface StepHeaderProps {
  title: string;
  subtitle?: string;
  progress?: number;
  stepNumber?: number;
  totalSteps?: number;
  accentColor?: string;
  showProgressBar?: boolean;
  showStepCount?: boolean;
  /** Happi + speech bubble (default). Timer-style steps opt out and keep the plain heading. */
  happi?: boolean;
}

export const StepHeader: React.FC<StepHeaderProps> = React.memo(
  ({ title, subtitle, happi = true }) => {
    if (happi) return <StepHappiTitle title={title} subtitle={subtitle} />;
    return (
      <View className="mb-6 w-full">
        <Text variant="h1" className="mb-2 leading-snug text-[28px]">
          {title}
        </Text>

        {subtitle ? (
          <Text variant="body" className="text-[17px] leading-[24px] text-ink-soft">
            {subtitle}
          </Text>
        ) : null}
      </View>
    );
  },
);

StepHeader.displayName = "StepHeader";
