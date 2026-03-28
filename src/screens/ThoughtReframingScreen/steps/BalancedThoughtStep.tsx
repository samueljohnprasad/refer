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
  /** AI-generated balanced thought suggestions */
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
          subtitle="Replace the original thought with something more realistic and fair."
          progress={progress}
          stepNumber={7}
          totalSteps={8}
        />

        {/* Show original thought for reference */}
        <View className="bg-red-50 rounded-2xl p-3 mb-4 border border-red-100">
          <Text className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">
            Original thought
          </Text>
          <Text className="text-sm text-red-700 italic">
            "{automaticThought}"
          </Text>
        </View>

        {/* AI suggestions */}
        {isSuggestingBalanced && (
          <View className="flex-row items-center mb-3 bg-purple-50 rounded-xl px-3 py-2 border border-purple-100">
            <ActivityIndicator size="small" color="#7C3AED" />
            <Text className="text-xs text-purple-600 font-semibold ml-2">
              AI is crafting balanced thought options...
            </Text>
          </View>
        )}

        {aiSuggestions.length > 0 && !isSuggestingBalanced && (
          <View className="mb-4">
            <Text className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-2">
              ✨ AI Suggestions — tap to use
            </Text>
            {aiSuggestions.map((suggestion: AIBalancedThoughtSuggestion, index: number) => (
              <Pressable
                key={index}
                onPress={() => onChange(suggestion.text)}
                accessibilityRole="button"
                accessibilityLabel={`Use AI suggestion: ${suggestion.text}`}
                className="bg-purple-50 rounded-xl p-3 mb-2 border border-purple-100 active:bg-purple-100"
              >
                <Text className="text-sm text-purple-800 mb-1">
                  "{suggestion.text}"
                </Text>
                <Text className="text-xs text-purple-400 italic">
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
            placeholder="e.g., 'My manager is busy. Not responding immediately doesn't mean they dislike my work.'"
            maxLength={300}
          />

          <View className="bg-blue-50 rounded-2xl p-3 mt-3 border border-blue-100">
            <Text className="text-sm text-blue-600 leading-relaxed">
              ✨ This doesn't have to be positive — just fair and realistic.
            </Text>
          </View>
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
