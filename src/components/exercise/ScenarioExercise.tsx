import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { Mascot } from '@/src/components/ui/Mascot';
import { Card } from '@/src/components/ui/Card';

export const ScenarioExercise = ({ payload, onInteraction }: any) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (option: any) => {
    setSelectedId(option.id);
    onInteraction({
      optionId: option.id,
      isCorrect: option.correct === true,
      text: option.text,
    });
  };

  const { scenario, question, options } = payload.content || {};

  return (
    <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <Text variant="h2" color="ink" className="font-bold">
          {payload.title || "Scenario"}
        </Text>
      </View>

      {scenario && (
        <View className="bg-slate-50 border-2 border-slate-200 p-6 rounded-3xl mb-8">
          <Text className="text-lg text-slate-800 leading-relaxed font-medium">
            {scenario}
          </Text>
        </View>
      )}

      {question && (
        <View className="flex-row items-start mb-6">
          <View className="mr-4 mt-2 z-10">
            <Mascot state="panda-happy" size={80} />
          </View>
          <View className="flex-1 bg-white rounded-3xl p-6 border-2 border-slate-200 relative">
            <View 
              className="absolute -left-3 top-10 w-5 h-5 bg-white border-l-2 border-b-2 border-slate-200 rounded-bl-[4px]" 
              style={{ transform: [{ rotate: '45deg' }] }} 
            />
            <Text variant="body" color="ink" className="leading-relaxed text-lg font-medium">
              {question}
            </Text>
          </View>
        </View>
      )}

      <View className="gap-4 pb-12">
        {options?.map((opt: any) => {
          const isSelected = selectedId === opt.id;
          return (
            <Card
              key={opt.id}
              variant={isSelected ? 'answer-selected' : 'answer'}
              onPress={() => handleSelect(opt)}
              contentClassName="items-center justify-center p-4"
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
