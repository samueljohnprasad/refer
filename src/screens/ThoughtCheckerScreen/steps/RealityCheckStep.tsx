import React from 'react';
import { View, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';

interface RealityCheckStepProps {
  value: 'YES' | 'NOT SURE' | 'NO' | null;
  automaticThought: string;
  onChange: (val: 'YES' | 'NOT SURE' | 'NO') => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
  onClose: () => void;
}

export const RealityCheckStep: React.FC<RealityCheckStepProps> = ({
  value,
  automaticThought,
  onChange,
  onNext,
  onBack,
  canGoBack,
  isValid,
  progress,
  onClose,
}) => {
  return (
    <View className="flex-1">
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
            Step 1 of 2
          </Text>
          <Pressable onPress={onClose} className="p-2 -mr-2 bg-slate-100 rounded-full active:bg-slate-200">
            <HugeiconsIcon icon={Cancel01Icon} size={20} color="#94A3B8" />
          </Pressable>
        </View>

        <View className="items-center mb-6">
          <Text className="text-2xl font-bold text-slate-800 mb-2">Thought Checker</Text>
          <Text className="text-[64px] mb-4">⚖️</Text>
          <View className="h-1 w-32 mt-2 bg-slate-100 rounded-full overflow-hidden">
            <View className="h-full bg-blue-400 rounded-full" style={{ width: `${progress}%` }} />
          </View>
        </View>

        <View className="bg-white rounded-[32px] p-6 shadow-sm shadow-slate-200 border border-slate-100 flex-1">
          <Text className="text-[22px] font-bold text-slate-800 text-center mb-6">
            Is this 100% true?
          </Text>
          
          <View className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
            <Text className="text-base text-slate-700 font-medium text-center">
              "{automaticThought}"
            </Text>
          </View>

          <View className="gap-y-3 mb-8">
            <Pressable
              onPress={() => onChange('YES')}
              className={`py-4 rounded-xl items-center ${
                value === 'YES' ? 'bg-amber-200' : 'bg-slate-100'
              }`}
            >
              <Text className={`text-[16px] font-bold ${value === 'YES' ? 'text-amber-800' : 'text-slate-600'}`}>
                YES
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => onChange('NOT SURE')}
              className={`py-4 rounded-xl items-center ${
                value === 'NOT SURE' ? 'bg-slate-200' : 'bg-slate-100'
              }`}
            >
              <Text className={`text-[16px] font-bold text-slate-600`}>
                NOT SURE
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => onChange('NO')}
              className={`py-4 rounded-xl items-center ${
                value === 'NO' ? 'bg-blue-100' : 'bg-slate-100'
              }`}
            >
              <Text className={`text-[16px] font-bold ${value === 'NO' ? 'text-blue-700' : 'text-slate-600'}`}>
                NO
              </Text>
            </Pressable>
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
    </View>
  );
};
