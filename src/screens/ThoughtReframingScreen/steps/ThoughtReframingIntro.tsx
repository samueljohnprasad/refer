import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';

interface ThoughtReframingIntroProps {
  onBegin: () => void;
}

export const ThoughtReframingIntro: React.FC<ThoughtReframingIntroProps> = React.memo(
  ({ onBegin }) => {
    return (
      <View className="flex-1 justify-center px-6">
        {/* Icon */}
        <View className="items-center mb-8">
          <View className="h-24 w-24 rounded-3xl bg-blue-50 items-center justify-center mb-4">
            <Text className="text-5xl">🧠</Text>
          </View>
          <View className="h-1 w-12 rounded-full bg-blue-200" />
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-slate-800 text-center mb-3">
          Thought Reframing
        </Text>

        {/* Description */}
        <Text className="text-base text-slate-500 text-center leading-relaxed mb-2">
          This exercise helps you challenge unhelpful thoughts and see the situation more clearly.
        </Text>
        <Text className="text-sm text-slate-400 text-center mb-8">
          It takes about 2–3 minutes.
        </Text>

        {/* Steps preview */}
        <View className="bg-white rounded-2xl p-4 mb-8 border border-slate-100">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            What you'll do
          </Text>
          {[
            '📝 Describe what happened',
            '💭 Capture your thought',
            '😟 Identify how you feel',
            '🔍 Spot the thinking trap',
            '⚖️ Weigh the evidence',
            '✨ Reframe with balance',
          ].map((step: string, index: number) => (
            <View key={index} className="flex-row items-center py-1.5">
              <Text className="text-sm text-slate-600">{step}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <Pressable
          onPress={onBegin}
          accessibilityRole="button"
          accessibilityLabel="Begin exercise"
          className="h-14 rounded-2xl bg-blue-500 items-center justify-center active:bg-blue-600"
        >
          <Text className="text-base font-semibold text-white">
            Begin Exercise
          </Text>
        </Pressable>
      </View>
    );
  }
);

ThoughtReframingIntro.displayName = 'ThoughtReframingIntro';
