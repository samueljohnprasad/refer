import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import type { CognitiveDistortion } from '../types';

interface DistortionCardProps {
  distortion: CognitiveDistortion;
  isSelected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const DistortionCard: React.FC<DistortionCardProps> = React.memo(
  ({ distortion, isSelected, onToggle, disabled = false }) => {
    return (
      <Pressable
        onPress={onToggle}
        disabled={disabled && !isSelected}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected }}
        accessibilityLabel={`${distortion.label} thinking trap`}
        accessibilityHint={distortion.description}
        className={`rounded-2xl p-4 mb-3 border ${
          isSelected
            ? 'border-blue-300 bg-blue-50'
            : 'border-slate-100 bg-white'
        } ${disabled && !isSelected ? 'opacity-40' : ''}`}
      >
        <View className="flex-row items-center mb-1.5">
          <Text className="text-lg mr-2">{distortion.icon}</Text>
          <Text
            className={`text-[15px] font-bold flex-1 ${
              isSelected ? 'text-blue-700' : 'text-slate-800'
            }`}
          >
            {distortion.label}
          </Text>
          {isSelected && (
            <View className="h-5 w-5 rounded-full bg-blue-500 items-center justify-center">
              <Text className="text-white text-xs font-bold">✓</Text>
            </View>
          )}
        </View>
        <Text className="text-sm text-slate-500 mb-1">
          {distortion.description}
        </Text>
        <Text className="text-xs text-slate-400 italic">
          {distortion.example}
        </Text>
      </Pressable>
    );
  }
);

DistortionCard.displayName = 'DistortionCard';
