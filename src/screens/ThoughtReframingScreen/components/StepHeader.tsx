import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

interface StepHeaderProps {
  /** Step title displayed prominently */
  title: string;
  /** Subtitle / prompt shown below the title */
  subtitle: string;
  /** Current progress fraction (0–1) */
  progress: number;
  /** Current step number (1-indexed, for display) */
  stepNumber: number;
  /** Total number of input steps */
  totalSteps: number;
}

export const StepHeader: React.FC<StepHeaderProps> = React.memo(
  ({ title, subtitle, progress, stepNumber, totalSteps }) => {
    return (
      <View className="mb-6">
        {/* Progress bar */}
        <View className="flex-row items-center mb-4">
          <View className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
            <View
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </View>
          <Text className="text-xs text-slate-400 font-semibold ml-3">
            {stepNumber}/{totalSteps}
          </Text>
        </View>

        {/* Title */}
        <Text className="text-2xl font-bold text-slate-800 mb-2">
          {title}
        </Text>

        {/* Subtitle */}
        <Text className="text-base text-slate-500 leading-relaxed">
          {subtitle}
        </Text>
      </View>
    );
  }
);

StepHeader.displayName = 'StepHeader';
