import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { QuizPayload, ExerciseComponentProps } from '../../../types/exercises';

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
      
      {payload.content.options.map((option, index) => {
        const isSelected = selectedIndex === index;
        return (
          <TouchableOpacity 
            key={index}
            className={`p-4 rounded-xl border-2 mb-3 flex-row items-center justify-between ${
              isSelected 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-slate-200 bg-white'
            }`}
            onPress={() => handleSelect(index)}
          >
            <Text className={`text-lg flex-1 ${isSelected ? 'text-blue-700 font-bold' : 'text-slate-600'}`}>
              {option}
            </Text>
            {isSelected && (
              <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center ml-4">
                <Text className="text-white text-xs font-bold">✓</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
