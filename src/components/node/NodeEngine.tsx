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
  
  const initialExercise = exercises[0];
  const initialSavedResponse = initialSavedResponses[initialExercise?.id];

  // Track if the current exercise has received valid input
  const [isCurrentExerciseReady, setIsCurrentExerciseReady] = useState(initialSavedResponse !== undefined);
  const [currentResponse, setCurrentResponse] = useState<any>(initialSavedResponse !== undefined ? initialSavedResponse : null);
  const [checkStatus, setCheckStatus] = useState<"idle" | "success" | "error">("idle");

  const currentExercise = exercises[currentIndex];
  const currentSavedResponse = localResponses[currentExercise?.id];

  const handleContinuePress = () => {
    // If scored and we haven't checked yet
    if (currentExercise.isScored && checkStatus === "idle") {
      if (currentResponse?.isCorrect) {
        setCheckStatus("success");
      } else {
        setCheckStatus("error");
      }
      return;
    }

    // 1. Save the response
    const newResponses = {
      ...localResponses,
      [currentExercise.id]: currentResponse
    };
    setLocalResponses(newResponses);

    // 2. Advance or complete
    if (currentIndex < exercises.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextExercise = exercises[nextIndex];
      const nextSavedResponse = newResponses[nextExercise.id];
      
      setCurrentIndex(nextIndex);
      setCheckStatus("idle");
      
      if (nextSavedResponse !== undefined) {
        setIsCurrentExerciseReady(true);
        setCurrentResponse(nextSavedResponse);
      } else {
        setIsCurrentExerciseReady(false);
        setCurrentResponse(null);
      }
    } else {
      onNodeComplete(newResponses);
    }
  };

  if (exercises.length === 0) return null;

  const handleInteraction = React.useCallback((response: any, isReady = true) => {
    setCurrentResponse(response);
    setIsCurrentExerciseReady(isReady);
  }, []);

  return (
    <LessonScreen
      progress={(currentIndex + 1) / exercises.length}
      onClose={onClose || (() => onNodeComplete(localResponses))}
      primaryLabel={
        currentExercise.isScored && checkStatus === "idle"
          ? "Check"
          : (currentIndex === exercises.length - 1 ? "Finish" : "Continue")
      }
      primaryDisabled={!isCurrentExerciseReady}
      onPrimaryPress={handleContinuePress}
      status={checkStatus === "idle" ? "default" : checkStatus}
    >
      <ExerciseRenderer 
        key={currentExercise.id} 
        payload={currentExercise} 
        savedResponse={currentSavedResponse}
        onInteraction={handleInteraction} 
      />
    </LessonScreen>
  );
};
