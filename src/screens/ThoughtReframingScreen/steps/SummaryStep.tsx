import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { EmotionShiftBar } from '../components/EmotionShiftBar';
import { COGNITIVE_DISTORTIONS } from '../data/cognitiveDistortions';
import type {
  ThoughtReframingFormState,
  CognitiveDistortionKey,
  CognitiveDistortion,
} from '../types';

interface SummaryStepProps {
  formState: ThoughtReframingFormState;
  onSave: () => void;
  onDone: () => void;
  isSaving: boolean;
}

export const SummaryStep: React.FC<SummaryStepProps> = React.memo(
  ({ formState, onSave, onDone, isSaving }) => {
    const distortionLabels: string[] = formState.selectedDistortions.map(
      (key: CognitiveDistortionKey) => {
        const found: CognitiveDistortion | undefined = COGNITIVE_DISTORTIONS.find(
          (d) => d.key === key
        );
        return found?.label ?? key;
      }
    );

    return (
      <View className="flex-1">
        {/* Header */}
        <View className="items-center mb-6">
          <Text className="text-4xl mb-2">✨</Text>
          <Text className="text-2xl font-bold text-slate-800 text-center">
            Great work!
          </Text>
          <Text className="text-sm text-slate-500 text-center mt-1">
            Reframing gets easier with practice.
          </Text>
        </View>

        {/* Thought comparison */}
        <View className="mb-5">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Thought shift
          </Text>

          {/* Original */}
          <View className="bg-red-50 rounded-2xl p-4 mb-2 border border-red-100">
            <Text className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">
              Before
            </Text>
            <Text className="text-sm text-red-700 italic">
              "{formState.automaticThought}"
            </Text>
          </View>

          {/* Balanced */}
          <View className="bg-green-50 rounded-2xl p-4 border border-green-100">
            <Text className="text-xs font-semibold text-green-500 uppercase tracking-wider mb-1">
              After
            </Text>
            <Text className="text-sm text-green-700">
              "{formState.balancedThought}"
            </Text>
          </View>
        </View>

        {/* Thinking traps */}
        {distortionLabels.length > 0 && (
          <View className="mb-5">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Thinking traps identified
            </Text>
            <View className="flex-row flex-wrap">
              {distortionLabels.map((label: string) => (
                <View
                  key={label}
                  className="bg-amber-50 rounded-xl px-3 py-1.5 mr-2 mb-2 border border-amber-100"
                >
                  <Text className="text-xs font-semibold text-amber-700">
                    {label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Emotion shift */}
        {formState.selectedEmotions.length > 0 && (
          <View className="mb-6">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Emotion shift
            </Text>
            <EmotionShiftBar emotions={formState.selectedEmotions} />
          </View>
        )}

        {/* Actions */}
        <View className="gap-3 mt-auto pb-2">
          <Pressable
            onPress={onSave}
            disabled={isSaving}
            accessibilityRole="button"
            accessibilityLabel="Save to journal"
            className={`h-14 rounded-2xl items-center justify-center ${
              isSaving ? 'bg-blue-300' : 'bg-blue-500 active:bg-blue-600'
            }`}
          >
            <Text className="text-base font-semibold text-white">
              {isSaving ? 'Saving...' : 'Save to Journal'}
            </Text>
          </Pressable>

          <Pressable
            onPress={onDone}
            accessibilityRole="button"
            accessibilityLabel="Done"
            className="h-12 rounded-2xl items-center justify-center bg-slate-100 active:bg-slate-200"
          >
            <Text className="text-base font-semibold text-slate-600">
              Done
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }
);

SummaryStep.displayName = 'SummaryStep';
