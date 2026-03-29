import React, { useCallback, useState } from 'react';
import { View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useThoughtCatcherFlow } from './hooks/useThoughtCatcherFlow';
import { useThoughtCatcherMutation } from './hooks/useThoughtCatcherMutation';
import { SituationStep } from './steps/SituationStep';
import { AutomaticThoughtStep } from './steps/AutomaticThoughtStep';
import { IntensityStep } from './steps/IntensityStep';
import { CatcherSummaryStep } from './steps/CatcherSummaryStep';

export default function ThoughtCatcherScreen() {
  const {
    currentStep,
    formState,
    dispatch,
    isCurrentStepValid,
    goNext,
    goBack,
    canGoBack,
    progress,
    reset,
  } = useThoughtCatcherFlow();

  const { saveCatcher, isSavingCatcher } = useThoughtCatcherMutation();
  const [entryId, setEntryId] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    Alert.alert(
      'Leave exercise?',
      'If you leave now, your progress on this step may not be saved. You can resume later from "My Log".',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save & Exit',
          style: 'destructive',
          onPress: () => {
            reset();
            router.back();
          },
        },
      ]
    );
  }, [reset]);

  const handleIntensityNext = useCallback(async () => {
    try {
      // Save the catcher entry
      const entry = await saveCatcher({ formState });
      if (entry) {
        setEntryId(entry.id);
        goNext(); // Advance to summary step
      }
    } catch {
      Alert.alert('Error', 'Failed to save your thought. Please try again.');
    }
  }, [formState, saveCatcher, goNext]);

  const handleCheckIt = useCallback(() => {
    if (entryId) {
      // Navigate to Checker with the ID
      router.replace(`/tabs/screens/thought-checker?id=${entryId}`);
    } else {
       router.back(); 
    }
  }, [entryId]);

  const renderStep = () => {
    switch (currentStep) {
      case 'situation':
        return (
          <SituationStep
            value={formState.situation}
            onChange={(text) => dispatch({ type: 'SET_SITUATION', payload: text })}
            onNext={goNext}
            onBack={goBack}
            canGoBack={canGoBack}
            isValid={isCurrentStepValid}
            progress={progress}
            onClose={handleClose}
          />
        );
      case 'automatic_thought':
        return (
          <AutomaticThoughtStep
            value={formState.automaticThought}
            onChange={(text) => dispatch({ type: 'SET_AUTOMATIC_THOUGHT', payload: text })}
            onNext={goNext}
            onBack={goBack}
            canGoBack={canGoBack}
            isValid={isCurrentStepValid}
            progress={progress}
            onClose={handleClose}
          />
        );
      case 'intensity':
        return (
          <IntensityStep
            value={formState.intensity}
            onChange={(val) => dispatch({ type: 'SET_INTENSITY', payload: val })}
            onNext={handleIntensityNext} // Custom handleNext to save
            onBack={goBack}
            canGoBack={canGoBack}
            isValid={isCurrentStepValid && !isSavingCatcher}
            progress={progress}
            onClose={handleClose}
          />
        );
      case 'catcher_summary':
        return (
          <CatcherSummaryStep 
            onCheckIt={handleCheckIt} 
            onClose={() => router.back()} // They dropped off early but its saved.
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50/20" edges={['top', 'bottom']}>
      {/* Loading Overlay */}
      {isSavingCatcher && (
        <View className="absolute inset-0 z-50 items-center justify-center bg-white/50">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      )}
      
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: 24, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderStep()}
      </ScrollView>
    </SafeAreaView>
  );
}
