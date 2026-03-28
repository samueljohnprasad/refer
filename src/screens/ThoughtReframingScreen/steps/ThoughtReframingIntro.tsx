import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';

interface ThoughtReframingIntroProps {
  onBegin: () => void;
}

const STEPS: string[] = [
  'Describe what happened',
  'Capture your automatic thought',
  'Identify how you feel',
  'Spot the thinking trap',
  'Weigh the evidence',
  'Write a balanced thought',
];

export const ThoughtReframingIntro: React.FC<ThoughtReframingIntroProps> = React.memo(
  ({ onBegin }) => {
    return (
      <View className="flex-1 justify-center px-2">
        {/* Icon */}
        <View className="items-center mb-10">
          <Text className="text-5xl mb-5">🧠</Text>
          <View className="h-px w-8 bg-slate-200" />
        </View>

        {/* Title & description */}
        <Text className="text-3xl font-bold text-slate-900 text-center mb-3 leading-tight">
          Thought Reframing
        </Text>
        <Text className="text-sm text-slate-400 text-center leading-relaxed mb-10 px-4">
          Challenge unhelpful thoughts and see your situation more clearly.{'\n'}Takes about 2–3 minutes.
        </Text>

        {/* Steps — plain list, no card */}
        <View className="mb-10 px-1">
          {STEPS.map((step: string, index: number) => (
            <View key={index} className="flex-row items-center mb-4">
              <Text className="text-[11px] text-slate-300 font-bold w-5 mr-3">
                {index + 1}
              </Text>
              <Text className="text-sm text-slate-500">{step}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <Pressable
          onPress={onBegin}
          accessibilityRole="button"
          accessibilityLabel="Begin exercise"
          className="h-14 rounded-2xl bg-slate-900 items-center justify-center active:opacity-80"
        >
          <Text className="text-base font-semibold text-white">
            Begin
          </Text>
        </Pressable>
      </View>
    );
  }
);

ThoughtReframingIntro.displayName = 'ThoughtReframingIntro';
