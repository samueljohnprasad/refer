import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { Mascot } from '@/src/components/ui/Mascot';
import { Card } from '@/src/components/ui/Card';

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
        <View className="mr-4 mt-2 z-10">
          <Mascot state="panda-happy" size={80} />
        </View>
        <View className="flex-1 bg-white rounded-3xl p-6 border-2 border-slate-200 relative">
          <View 
            className="absolute -left-3 top-10 w-5 h-5 bg-white border-l-2 border-b-2 border-slate-200" 
            style={{ transform: [{ rotate: '45deg' }] }} 
          />
          <Text variant="body" color="ink" className="leading-relaxed text-lg font-medium">
            {prompt}
          </Text>
        </View>
      </View>

      {subPrompt && (
        <Text className="text-slate-500 font-bold text-lg mb-4 tracking-wide">
          {subPrompt}
        </Text>
      )}

      <View className="gap-4">
        {options?.map((opt: any) => {
          const isSelected = selectedId === opt.id;
          return (
            <Card
              key={opt.id}
              variant={isSelected ? 'answer-selected' : 'answer'}
              onPress={() => handleSelect(opt)}
              contentClassName="items-center justify-center p-1"
            >
              <Text className={`text-lg font-medium ${isSelected ? 'text-sage-700' : 'text-slate-600'}`}>
                {opt.text}
              </Text>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
};
