import React from 'react';
import { View, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import Slider from '@react-native-community/slider';

interface IntensityStepProps {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
  onClose: () => void;
}

export const IntensityStep: React.FC<IntensityStepProps> = ({
  value,
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
            Step 3 of 3
          </Text>
          <Pressable onPress={onClose} className="p-2 -mr-2 bg-slate-100 rounded-full active:bg-slate-200">
            <HugeiconsIcon icon={Cancel01Icon} size={20} color="#94A3B8" />
          </Pressable>
        </View>

        <View className="items-center mb-6">
          <Text className="text-2xl font-bold text-slate-800 mb-2">Thought Catcher</Text>
          <Text className="text-[64px] mb-4">😔</Text>
          <View className="h-1 w-32 mt-2 bg-slate-100 rounded-full overflow-hidden">
            <View className="h-full bg-blue-400 rounded-full" style={{ width: `${progress}%` }} />
          </View>
        </View>

        <View className="bg-white rounded-[32px] p-6 shadow-sm shadow-slate-200 border border-slate-100 flex-1">
          <Text className="text-[22px] font-bold text-slate-800 text-center mb-8">
            How strong is the feeling?
          </Text>
          
          <View className="mb-4">
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={value}
              onValueChange={onChange}
              minimumTrackTintColor="#F87171" // Reddish to indicate strength
              maximumTrackTintColor="#E2E8F0"
              thumbTintColor="#FFFFFF"
            />
          </View>
          
          <View className="flex-row justify-between mb-8 px-2">
            <Text className="text-[15px] font-medium text-slate-500">Not strong</Text>
            <Text className="text-[15px] font-medium text-slate-700">Very strong</Text>
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
