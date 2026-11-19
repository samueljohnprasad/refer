// ponytail: exact Quick Reply chips matching .agents/onboarding.html and happy-ui tokens
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { sayIn } from '../animations';

export interface QuickReplyOption {
  label: string;
  value: string;
}

export interface QuickReplyStripProps {
  options: QuickReplyOption[];
  onSelect: (option: QuickReplyOption) => void;
  isWrap?: boolean;
}

export function QuickReplyStrip({
  options,
  onSelect,
  isWrap,
}: QuickReplyStripProps): React.JSX.Element {
  return (
    <View className={isWrap ? 'flex-row flex-wrap gap-2 justify-center' : 'flex-col gap-2'}>
      {options.map((option, i) => (
        <Animated.View key={option.value} entering={sayIn(i * 40)}>
          <Pressable
            onPress={() => onSelect(option)}
            className={`min-h-[44px] justify-center px-4 py-2.5 bg-happy-surface border-2 border-happy-sep active:border-happy-ink active:scale-[0.97] ${
              isWrap ? 'rounded-pill' : 'rounded-m rounded-br-[4px]'
            }`}
            accessibilityRole="button"
          >
            <Text className="text-happy-label font-semibold text-t-body text-center">
              {option.label}
            </Text>
          </Pressable>
        </Animated.View>
      ))}
    </View>
  );
}
