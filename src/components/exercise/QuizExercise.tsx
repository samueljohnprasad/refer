import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { QuizPayload, ExerciseComponentProps } from '../../../types/exercises';
import { OptionButton } from '@/src/components/ui/OptionButton';

export const QuizExercise: React.FC<ExerciseComponentProps<QuizPayload>> = ({ 
  payload, 
  savedResponse,
  onInteraction 
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    savedResponse !== undefined ? savedResponse : null
  );

  // If there's a saved response, tell the parent we are already ready
  useEffect(() => {
    if (savedResponse !== undefined) {
      onInteraction(savedResponse);
    }
  }, [savedResponse]);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    onInteraction(index); // Tells NodeEngine to enable the footer button!
  };

  return (
    <View className="flex-1 p-6 justify-center">
      <Text className="text-2xl font-bold text-slate-800 mb-8">
        {payload.content.question}
      </Text>
      
      <View className="gap-3">
        {payload.content.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          return (
            <OptionButton
              key={index}
              label={option}
              isSelected={isSelected}
              onPress={() => handleSelect(index)}
            />
          );
        })}
      </View>
    </View>
  );
};
