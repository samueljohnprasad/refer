import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
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
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="items-center mb-10 pt-2">
          <Text className="text-3xl mb-3">✦</Text>
          <Text className="text-2xl font-bold text-slate-900 text-center">
            You did it
          </Text>
          <Text className="text-sm text-slate-400 text-center mt-1">
            Reframing gets easier with practice.
          </Text>
        </View>

        {/* Situation */}
        {!!formState.situation && (
          <Section label="What happened">
            <Text className="text-sm text-slate-600 leading-relaxed">
              {formState.situation}
            </Text>
          </Section>
        )}

        {/* Thought shift */}
        <Section label="Thought shift">
          <View className="mb-3">
            <Text className="text-[13px] text-slate-400 font-bold tracking-tight mb-1">Before</Text>
            <Text className="text-sm text-slate-500 italic leading-relaxed">
              "{formState.automaticThought}"
            </Text>
          </View>
          <View className="h-px bg-slate-100 mb-3" />
          <View>
            <Text className="text-[13px] text-slate-400 font-bold tracking-tight mb-1">After</Text>
            <Text className="text-sm text-slate-700 leading-relaxed">
              "{formState.balancedThought}"
            </Text>
          </View>
        </Section>

        {/* Evidence */}
        {(formState.evidenceFor.length > 0 || formState.evidenceAgainst.length > 0) && (
          <Section label="Evidence">
            {formState.evidenceFor.length > 0 && (
              <View className="mb-4">
                <Text className="text-[13px] text-slate-400 font-bold tracking-tight mb-2">
                  Supporting
                </Text>
                {formState.evidenceFor.map((item: string, i: number) => (
                  <View key={`for-${i}`} className="flex-row mb-2">
                    <Text className="text-slate-300 mr-2 text-sm">·</Text>
                    <Text className="text-sm text-slate-600 flex-1 leading-relaxed">{item}</Text>
                  </View>
                ))}
              </View>
            )}
            {formState.evidenceAgainst.length > 0 && (
              <View>
                <Text className="text-[13px] text-slate-400 font-bold tracking-tight mb-2">
                  Against
                </Text>
                {formState.evidenceAgainst.map((item: string, i: number) => (
                  <View key={`against-${i}`} className="flex-row mb-2">
                    <Text className="text-slate-300 mr-2 text-sm">·</Text>
                    <Text className="text-sm text-slate-600 flex-1 leading-relaxed">{item}</Text>
                  </View>
                ))}
              </View>
            )}
          </Section>
        )}

        {/* Thinking traps */}
        {distortionLabels.length > 0 && (
          <Section label="Thinking traps">
            <View className="flex-row flex-wrap gap-2">
              {distortionLabels.map((label: string) => (
                <View
                  key={label}
                  className="bg-slate-100 rounded-full px-3 py-1"
                >
                  <Text className="text-xs text-slate-600">{label}</Text>
                </View>
              ))}
            </View>
          </Section>
        )}

        {/* Emotion shift */}
        {formState.selectedEmotions.length > 0 && (
          <Section label="Emotion shift">
            <EmotionShiftBar emotions={formState.selectedEmotions} />
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

SummaryStep.displayName = 'SummaryStep';
