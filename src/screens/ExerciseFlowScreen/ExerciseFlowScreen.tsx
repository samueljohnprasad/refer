import React, { useCallback, useMemo } from "react";
import {
  View,
  SafeAreaView,
  Pressable,
  Alert,
  BackHandler,
} from "react-native";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useExerciseFlow } from "@/src/hooks/useExerciseFlow";
import { useExerciseMutation } from "@/src/hooks/useExerciseMutation";
import { useExerciseAI } from "@/src/hooks/useExerciseAI";
import { getExerciseConfig } from "@/src/data/exerciseRegistry";
import type {
  ExerciseType,
  ExerciseConfig,
  StepProps,
} from "@/src/types/exerciseFlow";
import { useSingleExerciseEntry } from "@/src/hooks/useSingleExerciseEntry";

interface ExerciseFlowScreenProps {
  exerciseType: ExerciseType;
  entryId?: string;
  readOnly?: boolean;
}

export const ExerciseFlowScreen: React.FC<ExerciseFlowScreenProps> = ({
  exerciseType,
  entryId,
  readOnly = false,
}) => {
  const router = useRouter();
  const config = getExerciseConfig(exerciseType);

  // ─── Resume: load existing entry if entryId provided ──────────────
  const { entry: existingEntry, isLoading: isLoadingEntry } =
    useSingleExerciseEntry(entryId ?? null);

  // ─── Flow state ───────────────────────────────────────────────────
  const flow = useExerciseFlow(config as ExerciseConfig<any>, existingEntry);

  // ─── Mutation ─────────────────────────────────────────────────────
  const { save, isSaving } = useExerciseMutation();

  // ─── AI ───────────────────────────────────────────────────────────
  const currentStep = config?.steps[flow.currentStepIndex];
  const ai = useExerciseAI(currentStep?.ai);
  const isFinalStep = flow.currentStepIndex === flow.totalSteps - 1;
  const usesEmbeddedHeader =
    exerciseType === "abc_analysis";

  // Trigger AI when entering a step with AI config
  React.useEffect(() => {
    if (currentStep?.ai && !readOnly) {
      ai.generate(flow.response);
    }
  }, [flow.currentStepIndex]);

  // ─── Handlers ─────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    if (readOnly || flow.currentStepIndex === 0) {
      router.back();
      return;
    }

    Alert.alert("Exit exercise?", "Your progress will be saved as a draft.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Save & Exit",
        onPress: async () => {
          try {
            const payload = flow.getSavePayload("in_progress");
            await save(payload, entryId);
          } catch {
            /* best effort */
          }
          router.back();
        },
      },
      {
        text: "Discard",
        style: "destructive",
        onPress: () => {
          setTimeout(() => {
            router.back();
          }, 100);
        },
      },
    ]);
  }, [readOnly, flow, entryId, save, router]);

  const handleSave = useCallback(async () => {
    try {
      const payload = flow.getSavePayload("completed");
      await save(payload, entryId);
      router.back();
    } catch (err) {
      Alert.alert("Save failed", "Please try again.");
    }
  }, [flow, entryId, save, router]);

  // ─── Android hardware back button ─────────────────────────────────
  React.useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      handleClose();
      return true;
    });
    return () => sub.remove();
  }, [handleClose]);

  // ─── iOS swipe-back gesture prevention ────────────────────────────
  const navigation = useNavigation();
  React.useEffect(() => {
    if (readOnly || flow.currentStepIndex === 0) return;
    const unsub = navigation.addListener("beforeRemove", (e: any) => {
      e.preventDefault();
      handleClose();
    });
    return unsub;
  }, [navigation, handleClose, readOnly, flow.currentStepIndex]);

  // ─── Guards ───────────────────────────────────────────────────────
  if (!config) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-slate-500">Exercise not found</Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4"
        >
          <Text className="text-base font-bold text-blue-500">Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (isLoadingEntry && entryId) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-base text-slate-400">Loading...</Text>
      </SafeAreaView>
    );
  }

  // ─── Step rendering ───────────────────────────────────────────────
  const StepComponent = currentStep?.component;
  const stepProps: StepProps<any> = useMemo(
    () => ({
      response: flow.response,
      onUpdate: flow.updateResponse,
      onNext: readOnly ? handleClose : isFinalStep ? handleSave : flow.goNext,
      onBack: flow.goBack,
      onClose: handleClose,
      canGoBack: flow.canGoBack,
      isValid: flow.isCurrentStepValid,
      progress: flow.progress,
      stepIndex: flow.currentStepIndex,
      totalSteps: flow.totalSteps,
      aiSuggestions: ai.suggestions,
      isAiLoading: ai.isLoading,
      isSaving,
      readOnly,
    }),
    [
      flow,
      ai.suggestions,
      ai.isLoading,
      isSaving,
      readOnly,
      handleClose,
      handleSave,
      isFinalStep,
    ],
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: config.backgroundColor ?? "#FFFFFF" }}
    >
      {!usesEmbeddedHeader ? (
        <View className="flex-row justify-end px-4 pt-2">
          <Pressable
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel="Close exercise"
            hitSlop={12}
            className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
          >
            <Text className="text-slate-500 text-lg font-bold">✕</Text>
          </Pressable>
        </View>
      ) : null}

      <View className={`flex-1 ${usesEmbeddedHeader ? "px-5 pb-6 pt-4" : "px-5 pb-4"}`}>
        {StepComponent ? (
          <StepComponent {...stepProps} />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-slate-400">Unknown step</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

ExerciseFlowScreen.displayName = "ExerciseFlowScreen";
