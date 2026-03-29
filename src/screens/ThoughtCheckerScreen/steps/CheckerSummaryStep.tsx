import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Cancel01Icon, ArrowDown01Icon, CheckmarkBadge01Icon, Alert01Icon, HelpCircleIcon } from '@hugeicons/core-free-icons';

interface CheckerSummaryStepProps {
  situation: string;
  automaticThought: string;
  intensity: number;
  isTrue: string;
  balancedThought: string;
  onDone: () => void;
  onClose: () => void;
}

export const CheckerSummaryStep: React.FC<CheckerSummaryStepProps> = ({
  situation,
  automaticThought,
  intensity,
  isTrue,
  balancedThought,
  onDone,
  onClose,
}) => {
  // Determine styles for the "Reality Check" badge based on answer
  const getTruthStyles = () => {
    switch (isTrue) {
      case 'YES':
        return { icon: Alert01Icon, color: '#DC2626', bgClass: 'bg-red-100', textClass: 'text-red-700' };
      case 'NOT SURE':
        return { icon: HelpCircleIcon, color: '#D97706', bgClass: 'bg-amber-100', textClass: 'text-amber-700' };
      default:
        return { icon: CheckmarkBadge01Icon, color: '#059669', bgClass: 'bg-emerald-100', textClass: 'text-emerald-700' };
    }
  };

  const truthStyle = getTruthStyles();

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-2 mt-2">
        <Text className="text-[17px] font-bold text-slate-800">Review</Text>
        <Pressable onPress={onClose} className="p-2 -mr-2 bg-slate-100 rounded-full active:bg-slate-200">
          <HugeiconsIcon icon={Cancel01Icon} size={20} color="#94A3B8" />
        </Pressable>
      </View>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="items-center py-6">
          <View className="h-16 w-16 bg-blue-100 rounded-3xl items-center justify-center mb-4">
            <Text className="text-[32px]" accessible={false}>🌱</Text>
          </View>
          <Text className="text-2xl font-bold text-slate-800 text-center mb-2">
            Thought Checked
          </Text>
          <Text className="text-base text-slate-500 text-center px-4 leading-relaxed">
            You've successfully reframed your negative thought. Here is how your perspective shifted.
          </Text>
        </View>

        {/* Situation */}
        <View className="mb-4">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">The Situation</Text>
          <View className="bg-white rounded-[24px] p-5 shadow-sm shadow-slate-200 border border-slate-100">
            <Text className="text-[15px] text-slate-700 leading-relaxed font-medium">
              {situation || 'No situation recorded.'}
            </Text>
          </View>
        </View>

        {/* Arrow Down */}
        <View className="items-center mb-4">
          <HugeiconsIcon icon={ArrowDown01Icon} size={24} color="#CBD5E1" />
        </View>

        {/* Automatic Thought */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2 mx-1">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">Original Thought</Text>
            <Text className="text-xs font-bold text-orange-500 uppercase">Intensity: {intensity}%</Text>
          </View>
          <View className="bg-orange-50 rounded-[24px] p-5 border border-orange-100">
            <Text className="text-[15px] text-orange-900 leading-relaxed font-semibold italic">
              "{automaticThought || "..."}"
            </Text>
          </View>
        </View>

        {/* Reality Check */}
        <View className="mb-4">
           <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Reality Check</Text>
           <View className="bg-white rounded-[24px] p-5 shadow-sm shadow-slate-200 border border-slate-100 flex-row items-center justify-between">
             <Text className="text-[14px] text-slate-600 font-medium flex-1 mr-4">Is this thought completely grounded in facts?</Text>
             <View className={`flex-row items-center px-3 py-1.5 rounded-full ${truthStyle.bgClass}`}>
               <HugeiconsIcon icon={truthStyle.icon} size={14} color={truthStyle.color} />
               <Text className={`text-xs font-bold ml-1.5 ${truthStyle.textClass}`}>
                 {isTrue || 'N/A'}
               </Text>
             </View>
           </View>
        </View>

        {/* Balanced Thought */}
        <View className="mb-8 mt-2">
          <View className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-[28px] blur opacity-50"></View>
          <View className="bg-white rounded-[24px] p-6 shadow-md shadow-slate-200 border border-slate-100 relative">
            <View className="flex-row items-center mb-3">
              <View className="bg-blue-100 h-8 w-8 rounded-full items-center justify-center mr-3">
                <Text className="text-lg">⚖️</Text>
              </View>
              <Text className="text-[17px] font-bold text-slate-800">Balanced Perspective</Text>
            </View>
            <View className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <Text className="text-base text-slate-700 font-medium leading-relaxed">
                "{balancedThought || "..."}"
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Footer */}
      <View className="absolute bottom-6 left-0 right-0 px-2 bg-transparent">
        <Pressable
          onPress={onDone}
          className="w-full bg-slate-800 rounded-[20px] h-14 items-center justify-center shadow-lg shadow-slate-300 active:bg-slate-700"
        >
          <Text className="text-white text-[17px] font-bold tracking-wide">Done</Text>
        </Pressable>
      </View>
    </View>
  );
};
