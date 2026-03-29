import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import Slider from '@react-native-community/slider';
import { StepHeader } from '../../ThoughtReframingScreen/components/StepHeader';
import { StepNavigation } from '../../ThoughtReframingScreen/components/StepNavigation';
import {
  EMOTION_OPTIONS,
  type EmotionOption,
} from '../../ThoughtReframingScreen/data/emotions';
import type { EmotionName } from '../../ThoughtReframingScreen/types';

interface GratitudeReEvaluateStepProps {
  currentMood: EmotionName;
  initialIntensity: number;
  finalIntensity: number;
  onSetFinalIntensity: (intensity: number) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
}

export const GratitudeReEvaluateStep: React.FC<GratitudeReEvaluateStepProps> = React.memo(
  ({
    currentMood,
    initialIntensity,
    finalIntensity,
    onSetFinalIntensity,
    onNext,
    onBack,
    canGoBack,
    isValid,
    progress,
  }) => {
    const option: EmotionOption | undefined = useMemo(
      () => EMOTION_OPTIONS.find((e) => e.name === currentMood),
      [currentMood]
    );

    const shift: number = initialIntensity - finalIntensity;
    const shiftLabel: string =
      shift > 0
        ? `↓ ${shift} point${shift > 1 ? 's' : ''} lower`
        : shift < 0
        ? `↑ ${Math.abs(shift)} point${Math.abs(shift) > 1 ? 's' : ''} higher`
        : 'No change yet';

    return (
      <View className="flex-1">
        <StepHeader
          title="How do you feel now?"
          subtitle="After reflecting on what you're grateful for, re-rate your mood."
          progress={progress}
          stepNumber={4}
          totalSteps={4}
        />

        <View className="flex-1">
          <View className="mb-6">
            {/* Emotion label */}
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Text className="text-base mr-2">{option?.emoji}</Text>
                <Text className="text-sm font-medium text-slate-700">
                  {option?.label}
                </Text>
              </View>
              <View className="flex-row items-center gap-3">
                <Text className="text-[11px] text-slate-300 uppercase tracking-wider">
                  Before: {initialIntensity}
                </Text>
                <Text className="text-sm font-bold text-slate-900">
                  Now: {finalIntensity}
                </Text>
              </View>
            </View>

            {/* Slider */}
            <Slider
              minimumValue={0}
              maximumValue={10}
              step={1}
              value={finalIntensity}
              onValueChange={onSetFinalIntensity}
              minimumTrackTintColor="#1E293B"
              maximumTrackTintColor="#E2E8F0"
              thumbTintColor="#1E293B"
              accessibilityLabel={`${option?.label} final intensity`}
              accessibilityValue={{
                min: 0,
                max: 10,
                now: finalIntensity,
              }}
            />
            <View className="flex-row justify-between mt-1">
              <Text className="text-[11px] text-slate-300">Mild</Text>
              <Text className="text-[11px] text-slate-300">Intense</Text>
            </View>
          </View>

          {/* Shift indicator */}
          <View className="bg-slate-50 rounded-2xl p-4 items-center border border-slate-100">
            <Text
              className={`text-sm font-medium ${
                shift > 0
                  ? 'text-green-600'
                  : shift < 0
                  ? 'text-amber-600'
                  : 'text-slate-400'
              }`}
            >
              {shiftLabel}
            </Text>
            {shift > 0 && (
              <Text className="text-xs text-slate-400 mt-1">
                Gratitude is working ✦
              </Text>
            )}
          </View>
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

GratitudeReEvaluateStep.displayName = 'GratitudeReEvaluateStep';
