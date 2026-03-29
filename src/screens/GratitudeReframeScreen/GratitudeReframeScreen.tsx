import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useGratitudeFlow } from "./hooks/useGratitudeFlow";
import { useGratitudeMutation } from "./hooks/useGratitudeMutation";
import { useGratitudeAI } from "./hooks/useGratitudeAI";
import { useSingleGratitudeQuery } from "./hooks/useSingleGratitudeQuery";
import type { EmotionName } from "../ThoughtReframingScreen/types";
import type { GratitudeStep, GratitudeFormState } from "./types";

// Steps
import { GratitudeIntro } from "./steps/GratitudeIntro";
import { MoodStep } from "./steps/MoodStep";
import { PromptsStep } from "./steps/PromptsStep";
import { ReflectionStep } from "./steps/ReflectionStep";
import { GratitudeReEvaluateStep } from "./steps/GratitudeReEvaluateStep";
import { GratitudeSummaryStep } from "./steps/GratitudeSummaryStep";

/**
 * Container component that orchestrates the multi-step Gratitude Reframe flow.
 * Wires AI prompt generation across steps.
 */
const GratitudeReframeScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: existingEntry, isLoading: isLoadingEntry } =
    useSingleGratitudeQuery(id);

  // Track the entry ID independently to support upsert even for new entries
  const [entryId, setEntryId] = useState<string | undefined>(id);

  // ─── Hydration ──────────────────────────────────────────────────────
  const hydratedData = useMemo<GratitudeFormState | undefined>(() => {
    if (!existingEntry) return undefined;
    return {
      currentMood: existingEntry.current_mood as EmotionName,
      moodIntensity: existingEntry.initial_intensity || 0,
      selectedPrompt: existingEntry.selected_prompt || "",
      gratitudeEntries: existingEntry.gratitude_entries || [],
      finalMoodIntensity: existingEntry.final_intensity || 0,
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
  } = useGratitudeFlow(hydratedData, existingEntry?.status as GratitudeStep);

  const { saveEntry, isSaving } = useGratitudeMutation();

  const { aiPrompts, isGenerating, generatePrompts, clearPrompts } =
    useGratitudeAI();

  // Track whether AI generation has been triggered
  const aiTriggeredRef = useRef<boolean>(false);

  // ─── Auto-Save ──────────────────────────────────────────────────────
  const handleAutoSave = useCallback(
    async (nextStep?: GratitudeStep) => {
      // Only save if we have at least a mood
      if (formState.currentMood) {
        try {
          const result = await saveEntry({
            id: entryId,
            formState,
            status: nextStep || currentStep,
            completed: nextStep === "summary",
          });
          if (result?.id && !entryId) {
            setEntryId(result.id);
          }
        } catch (err) {
          console.error("Gratitude auto-save failed:", err);
        }
      }
    },
    [formState, currentStep, entryId, saveEntry],
  );

  const handleNext = useCallback(async () => {
    await handleAutoSave();
    goNext();
  }, [handleAutoSave, goNext]);

  // ─── AI Triggers ───────────────────────────────────────────────────
  // Generate prompts when entering the prompts step
  useEffect(() => {
    if (currentStep === "prompts" && !aiTriggeredRef.current) {
      if (formState.currentMood) {
        aiTriggeredRef.current = true;
        generatePrompts(formState.currentMood, formState.moodIntensity);
      }
    }
  }, [
    currentStep,
    formState.currentMood,
    formState.moodIntensity,
    generatePrompts,
  ]);

  // ─── Navigation Handlers ───────────────────────────────────────────
  const handleClose = useCallback((): void => {
    if (isIntro || isSummary) {
      router.back();
      return;
    }
    Alert.alert(
      "Leave exercise?",
      'Your progress is being saved automatically. You can resume later from "My Log".',
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Save & Exit",
          style: "destructive",
          onPress: () => {
            clearPrompts();
            router.back();
          },
        },
      ],
    );
  }, [isIntro, isSummary, reset, clearPrompts]);

  const handleSave = useCallback(async (): Promise<void> => {
    try {
      await saveEntry({
        id: entryId,
        formState,
        completed: true,
        status: "summary",
      });
      Alert.alert("Saved!", "Your gratitude reflection has been saved.", [
        { text: "OK", onPress: (): void => router.back() },
      ]);
    } catch {
      Alert.alert("Error", "Failed to save. Please try again.");
    }
  }, [formState, saveEntry, entryId]);

  const handleDone = useCallback((): void => {
    clearPrompts();
    reset();
    router.back();
  }, [reset, clearPrompts]);

  // ─── Dispatch Helpers ──────────────────────────────────────────────
  const setMood = useCallback(
    (mood: EmotionName): void => dispatch({ type: "SET_MOOD", payload: mood }),
    [dispatch],
  );

  const setMoodIntensity = useCallback(
    (intensity: number): void =>
      dispatch({ type: "SET_MOOD_INTENSITY", payload: intensity }),
    [dispatch],
  );

  const setSelectedPrompt = useCallback(
    (prompt: string): void =>
      dispatch({ type: "SET_SELECTED_PROMPT", payload: prompt }),
    [dispatch],
  );

  const addGratitudeEntry = useCallback(
    (text: string): void =>
      dispatch({ type: "ADD_GRATITUDE_ENTRY", payload: text }),
    [dispatch],
  );

  const removeGratitudeEntry = useCallback(
    (index: number): void =>
      dispatch({ type: "REMOVE_GRATITUDE_ENTRY", payload: index }),
    [dispatch],
  );

  const updateGratitudeEntry = useCallback(
    (index: number, text: string): void =>
      dispatch({ type: "UPDATE_GRATITUDE_ENTRY", payload: { index, text } }),
    [dispatch],
  );

  const setFinalMoodIntensity = useCallback(
    (intensity: number): void =>
      dispatch({ type: "SET_FINAL_MOOD_INTENSITY", payload: intensity }),
    [dispatch],
  );

  // ─── Step Rendering ────────────────────────────────────────────────
  const renderStep = (): React.ReactNode => {
    switch (currentStep) {
      case "intro":
        return <GratitudeIntro onBegin={goNext} />;

      case "mood":
        return (
          <MoodStep
            currentMood={formState.currentMood}
            moodIntensity={formState.moodIntensity}
            onSelectMood={setMood}
            onSetIntensity={setMoodIntensity}
            onNext={handleNext}
            onBack={goBack}
            canGoBack={canGoBack}
            isValid={isCurrentStepValid}
            progress={progress}
          />
        );

      case "prompts":
        return (
          <PromptsStep
            selectedPrompt={formState.selectedPrompt}
            onSelectPrompt={setSelectedPrompt}
            aiPrompts={aiPrompts}
            isGenerating={isGenerating}
            onNext={handleNext}
            onBack={goBack}
            canGoBack={canGoBack}
            isValid={isCurrentStepValid}
            progress={progress}
          />
        );

      case "reflection":
        return (
          <ReflectionStep
            selectedPrompt={formState.selectedPrompt}
            gratitudeEntries={formState.gratitudeEntries}
            onAddEntry={addGratitudeEntry}
            onRemoveEntry={removeGratitudeEntry}
            onUpdateEntry={updateGratitudeEntry}
            onNext={handleNext}
            onBack={goBack}
            canGoBack={canGoBack}
            isValid={isCurrentStepValid}
            progress={progress}
          />
        );

      case "reevaluate":
        return (
          <GratitudeReEvaluateStep
            currentMood={formState.currentMood!}
            initialIntensity={formState.moodIntensity}
            finalIntensity={formState.finalMoodIntensity}
            onSetFinalIntensity={setFinalMoodIntensity}
            onNext={handleNext}
            onBack={goBack}
            canGoBack={canGoBack}
            isValid={isCurrentStepValid}
            progress={progress}
          />
        );

      case "summary":
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

  if (isLoadingEntry) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8FAFC] items-center justify-center">
        {/* You could add a spinner here */}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={["top", "bottom"]}
    >
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
