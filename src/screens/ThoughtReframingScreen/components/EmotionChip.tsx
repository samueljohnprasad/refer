import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import type { EmotionOption } from '../data/emotions';

interface EmotionChipProps {
  emotion: EmotionOption;
  isSelected: boolean;
  onToggle: () => void;
  /** Optional intensity slider value (0–10) */
  intensity?: number;
  /** Called when intensity changes */
  onIntensityChange?: (value: number) => void;
  disabled?: boolean;
}

export const EmotionChip: React.FC<EmotionChipProps> = React.memo(
  ({ emotion, isSelected, onToggle, disabled = false }) => {
    return (
      <Pressable
        onPress={onToggle}
        disabled={disabled && !isSelected}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected }}
        accessibilityLabel={`${emotion.label} emotion`}
        className={`rounded-2xl px-4 py-3 flex-row items-center mr-2 mb-2 border ${
          isSelected
            ? 'border-blue-300 bg-blue-50'
            : 'border-slate-100 bg-white'
        } ${disabled && !isSelected ? 'opacity-40' : ''}`}
      >
        <Text className="text-lg mr-2">{emotion.emoji}</Text>
        <Text
          className={`text-sm font-semibold ${
            isSelected ? 'text-blue-700' : 'text-slate-600'
          }`}
        >
          {emotion.label}
        </Text>
        {isSelected && (
          <View className="ml-1.5 h-2 w-2 rounded-full bg-blue-500" />
        )}
      </Pressable>
    );
  }
);

EmotionChip.displayName = 'EmotionChip';
