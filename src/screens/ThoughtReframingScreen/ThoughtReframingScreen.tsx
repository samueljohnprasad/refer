import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useThoughtReframingFlow } from './hooks/useThoughtReframingFlow';
import { useThoughtReframingMutation } from './hooks/useThoughtReframingMutation';
import { useThoughtReframingAI } from './hooks/useThoughtReframingAI';
import { useSingleThoughtReframingQuery } from './hooks/useSingleThoughtReframingQuery';
import type { EmotionName, CognitiveDistortionKey, ThoughtReframingStep, ThoughtReframingFormState } from './types';

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
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: existingEntry, isLoading: isLoadingEntry } = useSingleThoughtReframingQuery(id);
  
  // Track the entry ID independently to support upsert even for new entries
  const [entryId, setEntryId] = useState<string | undefined>(id);

  // ─── Hydration ──────────────────────────────────────────────────────
  const hydratedData = useMemo<ThoughtReframingFormState | undefined>(() => {
    if (!existingEntry) return undefined;
    return {
      situation: existingEntry.situation || '',
      automaticThought: existingEntry.automatic_thought || '',
      selectedEmotions: existingEntry.emotions || [],
      selectedDistortions: existingEntry.cognitive_distortions || [],
      evidenceFor: existingEntry.evidence_for || [],
      evidenceAgainst: existingEntry.evidence_against || [],
      balancedThought: existingEntry.balanced_thought || '',
    };
  }, [existingEntry]);

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
  } = useThoughtReframingFlow(hydratedData, existingEntry?.status as ThoughtReframingStep);

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

  // ─── Auto-Save ──────────────────────────────────────────────────────
  const handleAutoSave = useCallback(async (nextStep?: ThoughtReframingStep) => {
    // Only save if we have at least a situation
    if (formState.situation.trim().length > 0) {
      try {
        const result = await saveEntry({
          id: entryId,
          formState,
          status: nextStep || currentStep,
          completed: nextStep === 'summary',
        });
        if (result?.id && !entryId) {
          setEntryId(result.id);
        }
      } catch (err) {
        console.error('Auto-save failed:', err);
      }
    }
  }, [formState, currentStep, entryId, saveEntry]);

  const handleNext = useCallback(async () => {
    // Determine the next step name
    // We'll actually do the save THEN goNext
    await handleAutoSave(); // We can't easily predict the next step without STEP_ORDER here
    goNext();
  }, [handleAutoSave, goNext]);

  // ─── AI Triggers ───────────────────────────────────────────────────

  // Trigger AI when entering emotions step (after automatic thought is filled)
  useEffect(() => {
    if (currentStep === 'emotions' && !aiTriggeredRef.current) {
      const { automaticThought, situation } = formState;
      if (automaticThought.trim().length > 0) {
        aiTriggeredRef.current = true;
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
    // With auto-save, we don't necessarily NEED to alert, but it's good practice
    // unless the user prefers "silent" exit. Let's keep it but mention it was saved.
    Alert.alert(
      'Leave exercise?',
      'Your progress is being saved automatically. You can resume later from "My Log".',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Save & Exit', 
          style: 'destructive',
          onPress: () => {
            clearSuggestions();
            reset();
            router.back();
          }
        },
      ]
    );
  }, [isIntro, isSummary, reset, clearSuggestions]);

  const handleSave = useCallback(async (): Promise<void> => {
    try {
      await saveEntry({ 
        id: entryId,
        formState, 
        completed: true,
        status: 'summary'
      });
      Alert.alert('Saved!', 'Your thought reframing has been saved.', [
        { text: 'OK', onPress: (): void => router.back() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to save. Please try again.');
    }
  }, [formState, saveEntry, entryId]);

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
            onNext={handleNext}
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
            onNext={handleNext}
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
            onNext={handleNext}
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
            onNext={handleNext}
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
            onNext={handleNext}
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
            onNext={handleNext}
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
            onNext={handleNext}
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
            onNext={handleNext}
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

  if (isLoadingEntry) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        {/* Spinner could be added here */}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-indigo-50/30" edges={['top', 'bottom']}>
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
