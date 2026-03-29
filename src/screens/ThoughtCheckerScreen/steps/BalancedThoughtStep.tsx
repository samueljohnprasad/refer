import React from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { TextInput, TouchableOpacity } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';

interface BalancedThoughtStepProps {
  value: string;
  onChange: (text: string) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
  onClose: () => void;
  isSaving?: boolean;
}

const SUGGESTIONS = [
  'Maybe I\'m overthinking',
  'There\'s not enough evidence',
  'They might be busy',
];

export const BalancedThoughtStep: React.FC<BalancedThoughtStepProps> = ({
  value,
  onChange,
  onNext,
  onBack,
  canGoBack,
  isValid,
  progress,
  onClose,
  isSaving,
}) => {
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          {canGoBack ? (
            <Pressable onPress={onBack} className="p-2 -ml-2 rounded-full active:bg-slate-100">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color="#64748B" />
            </Pressable>
          ) : (
             <View className="w-10" />
          )}
          <Text className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">
            Step 2 of 2
          </Text>
          <Pressable onPress={onClose} className="p-2 -mr-2 bg-slate-100 rounded-full active:bg-slate-200">
            <HugeiconsIcon icon={Cancel01Icon} size={20} color="#94A3B8" />
          </Pressable>
        </View>

        <View className="items-center mb-6">
          <Text className="text-2xl font-bold text-slate-800 mb-2">Thought Checker</Text>
          <Text className="text-[64px] mb-4">🪴</Text>
          <View className="h-1 w-32 mt-2 bg-slate-100 rounded-full overflow-hidden">
            <View className="h-full bg-blue-400 rounded-full" style={{ width: `${progress}%` }} />
          </View>
        </View>

        <View className="bg-white rounded-[32px] p-6 shadow-sm shadow-slate-200 border border-slate-100 flex-1">
          <Text className="text-[22px] font-bold text-slate-800 text-center mb-6">
            What's another possibility?
          </Text>
          
          <TextInput
            placeholder="We lie at your thought..."
            value={value}
            onChangeText={onChange}
            autoFocus
            className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-base focus:border-blue-400 mb-6"
            placeholderTextColor="#94A3B8"
          />

          <View className="gap-y-3 mb-8">
            {SUGGESTIONS.map((suggestion) => (
              <Pressable
                key={suggestion}
                onPress={() => onChange(suggestion)}
                className={`flex-row items-center py-3 px-4 rounded-xl ${
                  value === suggestion ? 'bg-blue-50 border border-blue-200' : 'bg-slate-100 border border-transparent'
                }`}
              >
                <View className={`w-2 h-2 rounded-full mr-3 ${value === suggestion ? 'bg-blue-500' : 'bg-slate-300'}`} />
                <Text className={`text-[15px] font-semibold ${value === suggestion ? 'text-blue-700' : 'text-slate-600'}`}>
                  {suggestion}
                </Text>
              </Pressable>
            ))}
          </View>

          <View className="mt-auto">
            <TouchableOpacity
              onPress={onNext}
              disabled={!isValid}
              className={`w-full rounded-2xl h-14 items-center justify-center ${!isValid ? 'bg-slate-300' : 'bg-slate-800'}`}
              activeOpacity={0.8}
            >
              <Text className="text-white text-[17px] font-semibold">Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
