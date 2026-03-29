import React, { useCallback, useEffect, useRef } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useGratitudeFlow } from './hooks/useGratitudeFlow';
import { useGratitudeMutation } from './hooks/useGratitudeMutation';
import { useGratitudeAI } from './hooks/useGratitudeAI';
import type { EmotionName } from '../ThoughtReframingScreen/types';

// Steps
import { GratitudeIntro } from './steps/GratitudeIntro';
import { MoodStep } from './steps/MoodStep';
import { PromptsStep } from './steps/PromptsStep';
import { ReflectionStep } from './steps/ReflectionStep';
import { GratitudeReEvaluateStep } from './steps/GratitudeReEvaluateStep';
import { GratitudeSummaryStep } from './steps/GratitudeSummaryStep';

/**
 * Container component that orchestrates the multi-step Gratitude Reframe flow.
 * Wires AI prompt generation across steps.
 */
const GratitudeReframeScreen: React.FC = () => {
  const {
    currentStep,
    formState,
    dispatch,
    isCurrentStepValid,
    goNext,
    goBack,
    canGoBack,
    isSummary,
    isIntro,
    progress,
    reset,
  } = useGratitudeFlow();

  const { saveEntry, isSaving } = useGratitudeMutation();

  const {
    aiPrompts,
    isGenerating,
    generatePrompts,
    clearPrompts,
  } = useGratitudeAI();

  // Track whether AI generation has been triggered
  const aiTriggeredRef = useRef<boolean>(false);

  // ─── AI Triggers ───────────────────────────────────────────────────
  // Generate prompts when entering the prompts step
  useEffect(() => {
    if (currentStep === 'prompts' && !aiTriggeredRef.current) {
      if (formState.currentMood) {
        aiTriggeredRef.current = true;
        generatePrompts(formState.currentMood, formState.moodIntensity);
      }
    }
  }, [currentStep, formState.currentMood, formState.moodIntensity, generatePrompts]);

  // ─── Navigation Handlers ───────────────────────────────────────────
  const handleClose = useCallback((): void => {
    if (isIntro || isSummary) {
      router.back();
      return;
    }
    Alert.alert(
      'Discard exercise?',
      'You have unsaved progress. Are you sure you want to leave?',
      [
        { text: 'Keep going', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: (): void => {
            clearPrompts();
            reset();
            router.back();
          },
        },
      ]
    );
  }, [isIntro, isSummary, reset, clearPrompts]);

  const handleSave = useCallback(async (): Promise<void> => {
    try {
      await saveEntry({ formState });
      Alert.alert('Saved!', 'Your gratitude reflection has been saved.', [
        { text: 'OK', onPress: (): void => router.back() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to save. Please try again.');
    }
  }, [formState, saveEntry]);

  const handleDone = useCallback((): void => {
    clearPrompts();
    reset();
    router.back();
  }, [reset, clearPrompts]);

  // ─── Dispatch Helpers ──────────────────────────────────────────────
  const setMood = useCallback(
    (mood: EmotionName): void => dispatch({ type: 'SET_MOOD', payload: mood }),
    [dispatch]
  );

  const setMoodIntensity = useCallback(
    (intensity: number): void =>
      dispatch({ type: 'SET_MOOD_INTENSITY', payload: intensity }),
    [dispatch]
  );

  const setSelectedPrompt = useCallback(
    (prompt: string): void =>
      dispatch({ type: 'SET_SELECTED_PROMPT', payload: prompt }),
    [dispatch]
  );

  const addGratitudeEntry = useCallback(
    (text: string): void =>
      dispatch({ type: 'ADD_GRATITUDE_ENTRY', payload: text }),
    [dispatch]
  );

  const removeGratitudeEntry = useCallback(
    (index: number): void =>
      dispatch({ type: 'REMOVE_GRATITUDE_ENTRY', payload: index }),
    [dispatch]
  );

  const updateGratitudeEntry = useCallback(
    (index: number, text: string): void =>
      dispatch({ type: 'UPDATE_GRATITUDE_ENTRY', payload: { index, text } }),
    [dispatch]
  );

  const setFinalMoodIntensity = useCallback(
    (intensity: number): void =>
      dispatch({ type: 'SET_FINAL_MOOD_INTENSITY', payload: intensity }),
    [dispatch]
  );

  // ─── Step Rendering ────────────────────────────────────────────────
  const renderStep = (): React.ReactNode => {
    switch (currentStep) {
      case 'intro':
        return <GratitudeIntro onBegin={goNext} />;

      case 'mood':
        return (
          <MoodStep
            currentMood={formState.currentMood}
            moodIntensity={formState.moodIntensity}
            onSelectMood={setMood}
            onSetIntensity={setMoodIntensity}
            onNext={goNext}
            onBack={goBack}
            canGoBack={canGoBack}
            isValid={isCurrentStepValid}
            progress={progress}
          />
        );

      case 'prompts':
        return (
          <PromptsStep
            selectedPrompt={formState.selectedPrompt}
            onSelectPrompt={setSelectedPrompt}
            aiPrompts={aiPrompts}
            isGenerating={isGenerating}
            onNext={goNext}
            onBack={goBack}
            canGoBack={canGoBack}
            isValid={isCurrentStepValid}
            progress={progress}
          />
        );

      case 'reflection':
        return (
          <ReflectionStep
            selectedPrompt={formState.selectedPrompt}
            gratitudeEntries={formState.gratitudeEntries}
            onAddEntry={addGratitudeEntry}
            onRemoveEntry={removeGratitudeEntry}
            onUpdateEntry={updateGratitudeEntry}
            onNext={goNext}
            onBack={goBack}
            canGoBack={canGoBack}
            isValid={isCurrentStepValid}
            progress={progress}
          />
        );

      case 'reevaluate':
        return (
          <GratitudeReEvaluateStep
            currentMood={formState.currentMood!}
            initialIntensity={formState.moodIntensity}
            finalIntensity={formState.finalMoodIntensity}
            onSetFinalIntensity={setFinalMoodIntensity}
            onNext={goNext}
            onBack={goBack}
            canGoBack={canGoBack}
            isValid={isCurrentStepValid}
            progress={progress}
          />
        );

      case 'summary':
        return (
          <GratitudeSummaryStep
            formState={formState}
            onSave={handleSave}
            onDone={handleDone}
            isSaving={isSaving}
          />
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top', 'bottom']}>
      <ScrollView
        contentContainerClassName="flex-grow px-5 pb-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderStep()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default GratitudeReframeScreen;
