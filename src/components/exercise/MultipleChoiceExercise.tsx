import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { Mascot } from '@/src/components/ui/Mascot';

export const MultipleChoiceExercise = ({ payload, onInteraction }: any) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (option: any) => {
    setSelectedId(option.id);
    onInteraction({
      optionId: option.id,
      isCorrect: option.correct === true,
      text: option.text,
    });
  };

  const { prompt, subPrompt, options } = payload.content || {};

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text variant="h2" color="ink" className="font-bold">
          {payload.title || "Read and respond"}
        </Text>
      </View>

      <View className="flex-row items-start mb-6">
        <View className="mr-5 mt-2 z-10">
          <Mascot state="panda-happy" size={80} />
        </View>
        <View className="flex-1 bg-white rounded-3xl p-5 border-2 border-slate-200 relative">
          <View 
            className="absolute -left-[11px] top-10 w-5 h-5 bg-white border-l-2 border-b-2 border-slate-200" 
            style={{ transform: [{ rotate: '45deg' }] }} 
          />
          <Text variant="body" color="ink" className="leading-relaxed text-lg font-medium">
            {prompt}
          </Text>
        </View>
      </View>

      {subPrompt && (
        <Text className="text-slate-500 font-bold text-lg mb-6 tracking-wide">
          {subPrompt}
        </Text>
      )}

      <View className="gap-4">
        {options?.map((opt: any) => {
          const isSelected = selectedId === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              activeOpacity={0.7}
              onPress={() => handleSelect(opt)}
              className={`p-5 rounded-2xl border-2 items-center justify-center bg-white ${
                isSelected ? 'border-sky-400 bg-sky-50' : 'border-slate-200'
              }`}
            >
              <Text className={`text-lg font-medium ${isSelected ? 'text-sky-600' : 'text-slate-600'}`}>
                {opt.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};
