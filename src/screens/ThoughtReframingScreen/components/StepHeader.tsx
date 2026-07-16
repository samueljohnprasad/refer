import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { SAGE } from "@/lib/tokens";

interface StepHeaderProps {
  title: string;
  subtitle: string;
  progress?: number;
  stepNumber?: number;
  totalSteps?: number;
  accentColor?: string;
  showProgressBar?: boolean;
}

export const StepHeader: React.FC<StepHeaderProps> = React.memo(
  ({ title, subtitle }) => {
    return (
      <View className="mb-6 w-full">
        {/* Title — premium Cormorant display serif */}
        <Text variant="h1" className="mb-1.5 leading-snug">
          {title}
        </Text>

        {/* Subtitle */}
        <Text variant="h3" className="leading-relaxed text-[17px] opacity-90">
          {subtitle}
        </Text>
      </View>
    );
  },
);

StepHeader.displayName = "StepHeader";
