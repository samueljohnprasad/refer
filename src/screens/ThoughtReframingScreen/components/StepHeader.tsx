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
        {/* Title — premium Fraunces display serif */}
        <Text variant="h1" className="mb-1.5 leading-snug">
          {title}
        </Text>

        {/* Subtitle — body Geist */}
        <Text variant="body" color="soft" className="leading-relaxed text-[15px]">
          {subtitle}
        </Text>
      </View>
    );
  },
);

StepHeader.displayName = "StepHeader";
