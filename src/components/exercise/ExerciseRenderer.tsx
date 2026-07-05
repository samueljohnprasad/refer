import React from 'react';
import { View, Text } from 'react-native';
import { ExercisePayload } from '../../../types/exercises';
import { ExerciseRegistry } from './ExerciseRegistry';

interface ExerciseRendererProps {
  payload: ExercisePayload;
  savedResponse?: any;
  onInteraction: (response: any) => void;
}

export const ExerciseRenderer: React.FC<ExerciseRendererProps> = ({ 
  payload,
  savedResponse,
  onInteraction 
}) => {
  const Component = ExerciseRegistry[payload.type];

  if (!Component) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-xl font-bold text-slate-800 mb-2">
          Update Required
        </Text>
        <Text className="text-center text-slate-500">
          This lesson uses a new interaction type ({payload.type}) that is not supported in your current version.
        </Text>
      </View>
    );
  }

  return (
    <Component 
      payload={payload} 
      savedResponse={savedResponse}
      onInteraction={onInteraction} 
    />
  );
};
