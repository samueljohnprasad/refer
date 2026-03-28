import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import Slider from '@react-native-community/slider';
import { StepHeader } from '../components/StepHeader';
import { StepNavigation } from '../components/StepNavigation';
import { EMOTION_OPTIONS, type EmotionOption } from '../data/emotions';
import type { EmotionName, EmotionRating } from '../types';

interface ReEvaluateStepProps {
  selectedEmotions: EmotionRating[];
  onSetFinalIntensity: (name: EmotionName, intensity: number) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
}

export const ReEvaluateStep: React.FC<ReEvaluateStepProps> = React.memo(
  ({
    selectedEmotions,
    onSetFinalIntensity,
    onNext,
    onBack,
    canGoBack,
    isValid,
    progress,
  }) => {
    return (
      <View className="flex-1">
        <StepHeader
          title="How do you feel now?"
          subtitle="Re-rate your emotions after reflecting on the evidence."
          progress={progress}
          stepNumber={8}
          totalSteps={8}
        />

        <View className="flex-1">
          {selectedEmotions.map((emotion: EmotionRating) => {
            const option: EmotionOption | undefined = EMOTION_OPTIONS.find(
              (e) => e.name === emotion.name
            );
            return (
              <View key={emotion.name} className="mb-6">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <Text className="text-base mr-2">{option?.emoji}</Text>
                    <Text className="text-sm font-medium text-slate-700">
                      {option?.label}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-3">
                    <Text className="text-[11px] text-slate-300 uppercase tracking-wider">
                      Before: {emotion.initial_intensity}
                    </Text>
                    <Text className="text-sm font-bold text-slate-900">
                      Now: {emotion.final_intensity}
                    </Text>
                  </View>
                </View>

                <Slider
                  minimumValue={0}
                  maximumValue={10}
                  step={1}
                  value={emotion.final_intensity}
                  onValueChange={(val: number) =>
                    onSetFinalIntensity(emotion.name, val)
                  }
                  minimumTrackTintColor="#1E293B"
                  maximumTrackTintColor="#E2E8F0"
                  thumbTintColor="#1E293B"
                  accessibilityLabel={`${option?.label} final intensity`}
                  accessibilityValue={{
                    min: 0,
                    max: 10,
                    now: emotion.final_intensity,
                  }}
                />
                <View className="flex-row justify-between mt-1">
                  <Text className="text-[11px] text-slate-300">Mild</Text>
                  <Text className="text-[11px] text-slate-300">Intense</Text>
                </View>
              </View>
            );
          })}
        </View>

        <StepNavigation
          canGoBack={canGoBack}
          canGoNext={isValid}
          onBack={onBack}
          onNext={onNext}
          nextLabel="See Results"
        />
      </View>
    );
  }
);

ReEvaluateStep.displayName = 'ReEvaluateStep';
