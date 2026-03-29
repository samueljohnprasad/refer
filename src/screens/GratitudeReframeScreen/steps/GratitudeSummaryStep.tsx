import React, { useMemo } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import {
  EMOTION_OPTIONS,
  type EmotionOption,
} from '../../ThoughtReframingScreen/data/emotions';
import type { GratitudeFormState } from '../types';

interface GratitudeSummaryStepProps {
  formState: GratitudeFormState;
  onSave: () => void;
  onDone: () => void;
  isSaving: boolean;
}

interface SectionProps {
  label: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ label, children }) => (
  <View className="mb-7">
    <Text className="text-[13px] font-bold text-slate-400 tracking-tight mb-3">
      {label}
    </Text>
    {children}
  </View>
);

export const GratitudeSummaryStep: React.FC<GratitudeSummaryStepProps> = React.memo(
  ({ formState, onSave, onDone, isSaving }) => {
    const emotionOption: EmotionOption | undefined = useMemo(
      () => EMOTION_OPTIONS.find((e) => e.name === formState.currentMood),
      [formState.currentMood]
    );

    const shift: number = formState.moodIntensity - formState.finalMoodIntensity;
    const shiftLabel: string =
      shift > 0
        ? `Dropped ${shift} point${shift > 1 ? 's' : ''}`
        : shift < 0
        ? `Rose ${Math.abs(shift)} point${Math.abs(shift) > 1 ? 's' : ''}`
        : 'Stayed the same';

    return (
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="items-center mb-10 pt-2">
          <Text className="text-3xl mb-3">🌿</Text>
          <Text className="text-2xl font-bold text-slate-900 text-center">
            Well done
          </Text>
          <Text className="text-sm text-slate-400 text-center mt-1">
            Noticing what's good gets easier with practice.
          </Text>
        </View>

        {/* Mood shift */}
        {emotionOption && (
          <Section label="Mood shift">
            <View className="bg-white rounded-2xl p-4 border border-slate-100">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <Text className="text-lg mr-2">{emotionOption.emoji}</Text>
                  <Text className="text-sm font-medium text-slate-700">
                    {emotionOption.label}
                  </Text>
                </View>
                <Text
                  className={`text-sm font-bold ${
                    shift > 0
                      ? 'text-green-600'
                      : shift < 0
                      ? 'text-amber-600'
                      : 'text-slate-400'
                  }`}
                >
                  {shiftLabel}
                </Text>
              </View>

              {/* Visual bar */}
              <View className="flex-row items-center gap-2">
                <Text className="text-[13px] text-slate-400 font-bold tracking-tight w-12">Before</Text>
                <View className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-slate-400 rounded-full"
                    style={{ width: `${formState.moodIntensity * 10}%` }}
                  />
                </View>
                <Text className="text-xs text-slate-400 w-6 text-right">
                  {formState.moodIntensity}
                </Text>
              </View>
              <View className="flex-row items-center gap-2 mt-2">
                <Text className="text-[13px] text-slate-400 font-bold tracking-tight w-12">After</Text>
                <View className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <View
                    className={`h-full rounded-full ${
                      shift > 0 ? 'bg-green-500' : 'bg-slate-400'
                    }`}
                    style={{ width: `${formState.finalMoodIntensity * 10}%` }}
                  />
                </View>
                <Text className="text-xs text-slate-400 w-6 text-right">
                  {formState.finalMoodIntensity}
                </Text>
              </View>
            </View>
          </Section>
        )}

        {/* Prompt used */}
        {!!formState.selectedPrompt && (
          <Section label="Prompt">
            <Text className="text-sm text-slate-500 italic leading-relaxed">
              "{formState.selectedPrompt}"
            </Text>
          </Section>
        )}

        {/* Gratitude entries */}
        {formState.gratitudeEntries.length > 0 && (
          <Section label="Grateful for">
            {formState.gratitudeEntries.map((entry: string, i: number) => (
              <View key={`summary-${i}`} className="flex-row mb-2">
                <Text className="text-sm mr-2">🌿</Text>
                <Text className="text-sm text-slate-600 flex-1 leading-relaxed">
                  {entry}
                </Text>
              </View>
            ))}
          </Section>
        )}

        {/* Actions */}
        <View className="gap-3 mt-4">
          <Pressable
            onPress={onSave}
            disabled={isSaving}
            accessibilityRole="button"
            accessibilityLabel="Save to journal"
            className={`h-14 rounded-2xl items-center justify-center ${
              isSaving ? 'bg-slate-300' : 'bg-slate-900 active:opacity-80'
            }`}
          >
            <Text className="text-base font-semibold text-white">
              {isSaving ? 'Saving…' : 'Save to Journal'}
            </Text>
          </Pressable>

          <Pressable
            onPress={onDone}
            accessibilityRole="button"
            accessibilityLabel="Done"
            className="h-12 rounded-2xl items-center justify-center active:opacity-60"
          >
            <Text className="text-sm font-medium text-slate-400">
              Done
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }
);

GratitudeSummaryStep.displayName = 'GratitudeSummaryStep';
