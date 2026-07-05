import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { ConceptPayload, ExerciseComponentProps } from '../../../types/exercises';

export const ConceptExercise: React.FC<ExerciseComponentProps<ConceptPayload>> = ({ 
  payload, 
  savedResponse,
  onInteraction 
}) => {
  // Concept is read-only. It is instantly ready to continue.
  useEffect(() => {
    onInteraction(true);
  }, []);

  return (
    <View className="flex-1 p-6 justify-center">
      <Text className="text-3xl font-bold text-slate-800 mb-4">
        {payload.content.title}
      </Text>
      <Text className="text-lg text-slate-600 leading-relaxed">
        {payload.content.content}
      </Text>
    </View>
  );
};
