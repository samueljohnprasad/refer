import React, { useCallback, useEffect, useRef } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useThoughtReframingFlow } from './hooks/useThoughtReframingFlow';
import { useThoughtReframingMutation } from './hooks/useThoughtReframingMutation';
import { useThoughtReframingAI } from './hooks/useThoughtReframingAI';
import type { EmotionName, CognitiveDistortionKey } from './types';

// Steps
import { ThoughtReframingIntro } from './steps/ThoughtReframingIntro';
import { SituationStep } from './steps/SituationStep';
import { AutomaticThoughtStep } from './steps/AutomaticThoughtStep';
import { EmotionStep } from './steps/EmotionStep';
import { CognitiveDistortionStep } from './steps/CognitiveDistortionStep';
import { EvidenceForStep } from './steps/EvidenceForStep';
import { EvidenceAgainstStep } from './steps/EvidenceAgainstStep';
import { BalancedThoughtStep } from './steps/BalancedThoughtStep';
import { ReEvaluateStep } from './steps/ReEvaluateStep';
import { SummaryStep } from './steps/SummaryStep';

/**
 * Container component that orchestrates the multi-step Thought Reframing flow.
 * Wires AI suggestions and voice input across all steps.
 */
const ThoughtReframingScreen: React.FC = () => {
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
  } = useThoughtReframingFlow();

  const { saveEntry, isSaving } = useThoughtReframingMutation();

  const {
    suggestedDistortions,
    suggestedEmotions,
    suggestedBalancedThoughts,
    isDetectingDistortions,
    isDetectingEmotions,
    isSuggestingBalanced,
    detectDistortions,
    detectEmotions,
    suggestBalancedThoughts,
    clearSuggestions,
  } = useThoughtReframingAI();

  // Track whether AI analysis has been triggered for current thought
  const aiTriggeredRef = useRef<boolean>(false);
  const balancedAiTriggeredRef = useRef<boolean>(false);

  // ─── AI Triggers ───────────────────────────────────────────────────

  // Trigger AI when entering emotions step (after automatic thought is filled)
  useEffect(() => {
    if (currentStep === 'emotions' && !aiTriggeredRef.current) {
      const { automaticThought, situation } = formState;
      if (automaticThought.trim().length > 0) {
        aiTriggeredRef.current = true;
        // Fire both AI detections in parallel
        detectDistortions(automaticThought, situation);
        detectEmotions(automaticThought, situation);
      }
    }
  }, [currentStep, formState.automaticThought, formState.situation, detectDistortions, detectEmotions]);

  // Trigger balanced thought suggestions when entering balanced thought step
  useEffect(() => {
    if (currentStep === 'balanced_thought' && !balancedAiTriggeredRef.current) {
      const { automaticThought, situation, evidenceFor, evidenceAgainst } = formState;
      if (automaticThought.trim().length > 0) {
        balancedAiTriggeredRef.current = true;
        suggestBalancedThoughts(automaticThought, situation, evidenceFor, evidenceAgainst);
      }
    }
  }, [currentStep, formState, suggestBalancedThoughts]);

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
            clearSuggestions();
            reset();
            router.back();
          },
        },
      ]
    );
  }, [isIntro, isSummary, reset, clearSuggestions]);

  const handleSave = useCallback(async (): Promise<void> => {
    try {
      await saveEntry({ formState });
      Alert.alert('Saved!', 'Your thought reframing has been saved.', [
        { text: 'OK', onPress: (): void => router.back() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to save. Please try again.');
    }
  }, [formState, saveEntry]);

  const handleDone = useCallback((): void => {
    clearSuggestions();
    reset();
    router.back();
  }, [reset, clearSuggestions]);

  // ─── Dispatch Helpers ──────────────────────────────────────────────
  const setSituation = useCallback(
    (text: string): void => dispatch({ type: 'SET_SITUATION', payload: text }),
    [dispatch]
  );

  const setAutomaticThought = useCallback(
    (text: string): void =>
      dispatch({ type: 'SET_AUTOMATIC_THOUGHT', payload: text }),
    [dispatch]
  );

  const toggleEmotion = useCallback(
    (name: EmotionName): void =>
      dispatch({ type: 'TOGGLE_EMOTION', payload: name }),
    [dispatch]
  );

  const setEmotionIntensity = useCallback(
    (name: EmotionName, intensity: number): void =>
      dispatch({ type: 'SET_EMOTION_INTENSITY', payload: { name, intensity } }),
    [dispatch]
  );

  const setEmotionFinalIntensity = useCallback(
    (name: EmotionName, intensity: number): void =>
      dispatch({
        type: 'SET_EMOTION_FINAL_INTENSITY',
        payload: { name, intensity },
      }),
    [dispatch]
  );

  const toggleDistortion = useCallback(
    (key: CognitiveDistortionKey): void =>
      dispatch({ type: 'TOGGLE_DISTORTION', payload: key }),
    [dispatch]
  );

  const addEvidenceFor = useCallback(
    (item: string): void =>
      dispatch({ type: 'ADD_EVIDENCE_FOR', payload: item }),
    [dispatch]
  );

  const removeEvidenceFor = useCallback(
    (index: number): void =>
      dispatch({ type: 'REMOVE_EVIDENCE_FOR', payload: index }),
    [dispatch]
  );

  const addEvidenceAgainst = useCallback(
    (item: string): void =>
      dispatch({ type: 'ADD_EVIDENCE_AGAINST', payload: item }),
    [dispatch]
  );

  const removeEvidenceAgainst = useCallback(
    (index: number): void =>
      dispatch({ type: 'REMOVE_EVIDENCE_AGAINST', payload: index }),
    [dispatch]
  );

  const setBalancedThought = useCallback(
    (text: string): void =>
      dispatch({ type: 'SET_BALANCED_THOUGHT', payload: text }),
    [dispatch]
  );

  // ─── Step Rendering ────────────────────────────────────────────────
  const renderStep = (): React.ReactNode => {
    switch (currentStep) {
      case 'intro':
        return <ThoughtReframingIntro onBegin={goNext} />;

      case 'situation':
        return (
          <SituationStep
            value={formState.situation}
            onChange={setSituation}
            onNext={goNext}
            onBack={goBack}
            canGoBack={canGoBack}
            isValid={isCurrentStepValid}
            progress={progress}
          />
        );

      case 'automatic_thought':
        return (
          <AutomaticThoughtStep
            value={formState.automaticThought}
            onChange={setAutomaticThought}
            onNext={goNext}
            onBack={goBack}
            canGoBack={canGoBack}
            isValid={isCurrentStepValid}
            progress={progress}
          />
        );

      case 'emotions':
        return (
          <EmotionStep
            selectedEmotions={formState.selectedEmotions}
            onToggleEmotion={toggleEmotion}
            onSetIntensity={setEmotionIntensity}
            onNext={goNext}
            onBack={goBack}
            canGoBack={canGoBack}
            isValid={isCurrentStepValid}
            progress={progress}
            aiSuggestedEmotions={suggestedEmotions}
            isDetectingEmotions={isDetectingEmotions}
          />
        );

      case 'distortions':
        return (
          <CognitiveDistortionStep
            selectedDistortions={formState.selectedDistortions}
            onToggle={toggleDistortion}
            onNext={goNext}
            onBack={goBack}
            canGoBack={canGoBack}
            isValid={isCurrentStepValid}
            progress={progress}
            aiSuggestedDistortions={suggestedDistortions}
            isDetectingDistortions={isDetectingDistortions}
          />
        );

      case 'evidence_for':
        return (
          <EvidenceForStep
            items={formState.evidenceFor}
            onAdd={addEvidenceFor}
            onRemove={removeEvidenceFor}
            onNext={goNext}
            onBack={goBack}
            canGoBack={canGoBack}
            isValid={isCurrentStepValid}
            progress={progress}
          />
        );

      case 'evidence_against':
        return (
          <EvidenceAgainstStep
            items={formState.evidenceAgainst}
            onAdd={addEvidenceAgainst}
            onRemove={removeEvidenceAgainst}
            onNext={goNext}
            onBack={goBack}
            canGoBack={canGoBack}
            isValid={isCurrentStepValid}
            progress={progress}
          />
        );

      case 'balanced_thought':
        return (
          <BalancedThoughtStep
            value={formState.balancedThought}
            automaticThought={formState.automaticThought}
            onChange={setBalancedThought}
            onNext={goNext}
            onBack={goBack}
            canGoBack={canGoBack}
            isValid={isCurrentStepValid}
            progress={progress}
            aiSuggestions={suggestedBalancedThoughts}
            isSuggestingBalanced={isSuggestingBalanced}
          />
        );

      case 're_evaluate':
        return (
          <ReEvaluateStep
            selectedEmotions={formState.selectedEmotions}
            onSetFinalIntensity={setEmotionFinalIntensity}
            onNext={goNext}
            onBack={goBack}
            canGoBack={canGoBack}
            isValid={isCurrentStepValid}
            progress={progress}
          />
        );

      case 'summary':
        return (
          <SummaryStep
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
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderStep()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ThoughtReframingScreen;
