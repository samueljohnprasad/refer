import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { Mascot } from '@/src/components/ui/Mascot';
import { Card } from '@/src/components/ui/Card';

export const TrueFalseExercise = ({ payload, savedResponse, onInteraction }: any) => {
  const { statement, correct } = payload.content || {};
  const [selectedValue, setSelectedValue] = useState<boolean | null>(savedResponse?.value ?? null);

  useEffect(() => {
    if (savedResponse?.value !== undefined) {
      onInteraction(savedResponse, true);
    }
  }, []);

  const handleSelect = (val: boolean) => {
    setSelectedValue(val);
    const isCorrect = val === correct;
    onInteraction({ value: val, isCorrect }, true);
  };

  return (
    <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <Text variant="h2" color="ink" className="font-bold">
          {payload.title || "True or False"}
        </Text>
      </View>

      {statement && (
        <View className="flex-row items-start mb-10">
          <View className="mr-4 mt-2 z-10">
            <Mascot state="panda-happy" size={80} />
          </View>
          <View className="flex-1 bg-white rounded-3xl p-6 border-2 border-slate-200 relative">
            <View 
              className="absolute -left-3 top-10 w-5 h-5 bg-white border-l-2 border-b-2 border-slate-200 rounded-bl-[4px]" 
              style={{ transform: [{ rotate: '45deg' }] }} 
            />
            <Text variant="body" color="ink" className="leading-relaxed text-lg font-medium">
              {statement}
            </Text>
          </View>
        </View>
      )}

      <View className="flex-row gap-4 pb-12">
        <View className="flex-1">
          <Card
            variant={selectedValue === true ? 'answer-selected' : 'answer'}
            onPress={() => handleSelect(true)}
            contentClassName="items-center justify-center py-8"
          >
            <Text className={`text-xl font-bold ${selectedValue === true ? 'text-sage-700' : 'text-slate-600'}`}>
              True
            </Text>
          </Card>
        </View>
        
        <View className="flex-1">
          <Card
            variant={selectedValue === false ? 'answer-selected' : 'answer'}
            onPress={() => handleSelect(false)}
            contentClassName="items-center justify-center py-8"
          >
            <Text className={`text-xl font-bold ${selectedValue === false ? 'text-sage-700' : 'text-slate-600'}`}>
              False
            </Text>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
};
