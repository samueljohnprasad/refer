import React from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { StepHeader } from '../components/StepHeader';
import { StepNavigation } from '../components/StepNavigation';
import { VoiceTextInput } from '../components/VoiceTextInput';
import type { AIBalancedThoughtSuggestion } from '../hooks/useThoughtReframingAI';

interface BalancedThoughtStepProps {
  value: string;
  automaticThought: string;
  onChange: (text: string) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
  aiSuggestions?: AIBalancedThoughtSuggestion[];
  isSuggestingBalanced?: boolean;
}

export const BalancedThoughtStep: React.FC<BalancedThoughtStepProps> = React.memo(
  ({
    value,
    automaticThought,
    onChange,
    onNext,
    onBack,
    canGoBack,
    isValid,
    progress,
    aiSuggestions = [],
    isSuggestingBalanced = false,
  }) => {
    return (
      <View className="flex-1">
        <StepHeader
          title="Write a balanced thought"
          subtitle="Replace the original with something realistic and fair."
          progress={progress}
          stepNumber={7}
          totalSteps={8}
        />

        {/* Original thought — quiet reference */}
        <View className="mb-5">
          <Text className="text-[11px] text-slate-300 uppercase tracking-wider mb-2">
            Original thought
          </Text>
          <Text className="text-sm text-slate-500 italic leading-relaxed">
            "{automaticThought}"
          </Text>
        </View>

        {/* AI loading */}
        {isSuggestingBalanced && (
          <View className="flex-row items-center mb-4">
            <ActivityIndicator size="small" color="#94A3B8" />
            <Text className="text-[11px] text-slate-400 ml-2 uppercase tracking-wider">
              Crafting options…
            </Text>
          </View>
        )}

        {/* AI suggestions — clean tappable items, no box banner */}
        {aiSuggestions.length > 0 && !isSuggestingBalanced && (
          <View className="mb-5">
            <Text className="text-[11px] text-slate-300 uppercase tracking-wider mb-3">
              Suggestions — tap to use
            </Text>
            {aiSuggestions.map((suggestion: AIBalancedThoughtSuggestion, index: number) => (
              <Pressable
                key={index}
                onPress={() => onChange(suggestion.text)}
                accessibilityRole="button"
                accessibilityLabel={`Use AI suggestion: ${suggestion.text}`}
                className="py-3 mb-2 border-b border-slate-100 active:opacity-60"
              >
                <Text className="text-sm text-slate-700 mb-1 leading-relaxed">
                  "{suggestion.text}"
                </Text>
                <Text className="text-[11px] text-slate-400">
                  {suggestion.rationale}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        <View className="flex-1">
          <VoiceTextInput
            value={value}
            onChangeText={onChange}
            placeholder="e.g., 'My manager is busy. Not responding doesn't mean they dislike my work.'"
            maxLength={300}
          />

          <Text className="text-[11px] text-slate-400 mt-3 leading-relaxed">
            Doesn't have to be positive — just fair and realistic.
          </Text>
        </View>

        <StepNavigation
          canGoBack={canGoBack}
          canGoNext={isValid}
          onBack={onBack}
          onNext={onNext}
        />
      </View>
    );
  }
);

BalancedThoughtStep.displayName = 'BalancedThoughtStep';
