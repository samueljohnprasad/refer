import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '@/src/components/ui/Text';
import { Mascot } from '@/src/components/ui/Mascot';
import { OrganicSpeechTail } from '@/src/components/ui/OrganicSpeechTail';
import { OptionButton } from '@/src/components/ui/OptionButton';

export const MultipleChoiceExercise = ({ payload, onInteraction }: any) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (option: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setSelectedId(option.id);
    onInteraction({
      optionId: option.id,
      isCorrect: option.correct === true,
      text: option.text,
    });
  };

  const { prompt, subPrompt, options } = payload.content || {};

  return (
    <ScrollView 
      className="flex-1 p-6"
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-6">
        <Text variant="h2" color="ink" className="font-bold">
          {payload.title || "Read and respond"}
        </Text>
      </View>

      {/* Premium Speech Bubble Layout */}
      <View className="flex-row items-start mb-8">
        <View className="mr-4 mt-2 z-10">
          <Mascot state="panda-happy" size={76} />
        </View>
        <View className="flex-1 bg-white rounded-xl p-6 border border-brand-border/60 shadow-sm relative">
          <OrganicSpeechTail />
          
          <Text variant="body" color="ink" className="leading-[32px] text-[17px] font-medium tracking-wide">
            {prompt}
          </Text>
        </View>
      </View>

      {subPrompt && (
        <Text className="text-slate-500 font-bold text-lg mb-5 tracking-wide">
          {subPrompt}
        </Text>
      )}

      {/* Options Stack */}
      <View className="gap-3 pb-12">
        {options?.map((opt: any) => {
          const isSelected = selectedId === opt.id;
          return (
            <OptionButton
              key={opt.id}
              label={opt.text}
              isSelected={isSelected}
              onPress={() => handleSelect(opt)}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};
