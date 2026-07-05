import React, { useState, useEffect } from 'react';
import { Exercise } from '@/src/types/journeyV5';
import { ExerciseRenderer } from '../exercise/ExerciseRenderer';
import { LessonScreen } from '@/src/components/ui/LessonScreen';

interface NodeEngineProps {
  nodeId: string;
  exercises: Exercise[];
  initialSavedResponses?: Record<string, any>;
  onNodeComplete: (responses: Record<string, any>) => void;
  onClose?: () => void;
}

export const NodeEngine: React.FC<NodeEngineProps> = ({ 
  nodeId, 
  exercises, 
  initialSavedResponses = {},
  onNodeComplete,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localResponses, setLocalResponses] = useState<Record<string, any>>(initialSavedResponses);
  
  // Track if the current exercise has received valid input
  const [isCurrentExerciseReady, setIsCurrentExerciseReady] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<any>(null);

  const currentExercise = exercises[currentIndex];
  const currentSavedResponse = localResponses[currentExercise?.id];

  // Whenever the exercise changes, reset the readiness state (unless there's a saved response)
  useEffect(() => {
    if (currentSavedResponse !== undefined) {
      setIsCurrentExerciseReady(true);
      setCurrentResponse(currentSavedResponse);
    } else {
      setIsCurrentExerciseReady(false);
      setCurrentResponse(null);
    }
  }, [currentIndex, currentSavedResponse]);

  const handleContinuePress = () => {
    // 1. Save the response
    const newResponses = {
      ...localResponses,
      [currentExercise.id]: currentResponse
    };
    setLocalResponses(newResponses);

    // 2. Advance or complete
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onNodeComplete(newResponses);
    }
  };

  if (exercises.length === 0) return null;

  return (
    <LessonScreen
      progress={(currentIndex + 1) / exercises.length}
      onClose={onClose || (() => onNodeComplete(localResponses))}
      primaryLabel={currentIndex === exercises.length - 1 ? "Finish" : "Continue"}
      primaryDisabled={!isCurrentExerciseReady}
      onPrimaryPress={handleContinuePress}
    >
      <ExerciseRenderer 
        key={currentExercise.id} 
        payload={currentExercise} 
        savedResponse={currentSavedResponse}
        onInteraction={(response) => {
          setCurrentResponse(response);
          setIsCurrentExerciseReady(true);
        }} 
      />
    </LessonScreen>
  );
};
