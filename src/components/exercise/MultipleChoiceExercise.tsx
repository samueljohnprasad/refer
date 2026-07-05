import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';

export const MultipleChoiceExercise = ({ payload, onInteraction }: any) => {
  // Auto-complete placeholder for testing
  useEffect(() => {
    // Uncomment below if you want auto-advance on mount for testing
    // onInteraction(true); 
  }, []);

  return (
    <ScrollView className="flex-1 p-6">
      <View className="bg-slate-100 p-6 rounded-2xl border border-slate-200 mt-10">
        <Text className="text-2xl font-bold text-slate-800 mb-2">
          MultipleChoice Exercise
        </Text>
        <Text className="text-sm text-slate-500 mb-4">
          Type: {payload.type}
        </Text>
        <Text className="text-base text-slate-700 font-mono bg-white p-4 rounded-xl border border-slate-200">
          {JSON.stringify(payload.content, null, 2)}
        </Text>
      </View>
    </ScrollView>
  );
};
