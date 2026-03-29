import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { TouchableOpacity } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

interface CatcherSummaryStepProps {
  onCheckIt: () => void;
  onClose: () => void; // Allow dropping off with it saved
}

export const CatcherSummaryStep: React.FC<CatcherSummaryStepProps> = ({
  onCheckIt,
  onClose,
}) => {
  return (
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-end mb-8 mt-2">
        <Pressable onPress={onClose} className="p-2 -mr-2 bg-slate-100 rounded-full active:bg-slate-200">
          <HugeiconsIcon icon={Cancel01Icon} size={20} color="#94A3B8" />
        </Pressable>
      </View>

      <Animated.View 
        entering={FadeIn.duration(800)}
        className="flex-1 items-center justify-center p-6"
      >
        <Text className="text-[100px] mb-8 text-center" accessible={false}>
          🧠
        </Text>
        
        <Text className="text-[28px] font-bold text-slate-800 text-center mb-4">
          Nice catch.
        </Text>
        
        <Text className="text-[17px] text-slate-500 text-center leading-relaxed">
          That's an automatic thought.{"\n"}Let's check it.
        </Text>
      </Animated.View>

      {/* Action Footer */}
      <Animated.View 
        entering={SlideInDown.delay(300).springify().damping(18)}
        className="mt-auto px-2 pb-8"
      >
        <TouchableOpacity
          onPress={onCheckIt}
          className="w-full bg-slate-800 rounded-2xl h-14 items-center justify-center"
          activeOpacity={0.8}
        >
          <Text className="text-white text-[17px] font-semibold">Let's check it</Text>
        </TouchableOpacity>
        
        <Pressable 
          onPress={onClose}
          className="mt-4 p-3 active:opacity-70 items-center"
        >
          <Text className="text-[15px] font-semibold text-slate-500">I'll do it later</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};
