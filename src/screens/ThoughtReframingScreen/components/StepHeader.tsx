import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

interface StepHeaderProps {
  title: string;
  subtitle: string;
  progress: number;
  stepNumber: number;
  totalSteps: number;
}

export const StepHeader: React.FC<StepHeaderProps> = React.memo(
  ({ title, subtitle, progress, stepNumber, totalSteps }) => {
    return (
      <View className="mb-8">
        {/* Progress */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-0.5 bg-slate-100 rounded-full overflow-hidden">
            <View
              className="h-full bg-slate-400 rounded-full"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </View>
          <Text className="text-[11px] text-slate-400 font-medium ml-3 tracking-wider uppercase">
            {stepNumber} of {totalSteps}
          </Text>
        </View>

        {/* Title */}
        <Text className="text-2xl font-bold text-slate-900 mb-2 leading-tight">
          {title}
        </Text>

        {/* Subtitle */}
        <Text className="text-sm text-slate-400 leading-relaxed">
          {subtitle}
        </Text>
      </View>
    );
  }
);

StepHeader.displayName = 'StepHeader';
