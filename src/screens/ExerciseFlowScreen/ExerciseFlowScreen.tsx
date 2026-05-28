import React, { useCallback, useMemo, useRef } from "react";
import * as Haptics from "expo-haptics";
import {
  View,
  SafeAreaView,
  Pressable,
  Alert,
  BackHandler,
  Text as RNText,
} from "react-native";
import { Text } from "@/src/components/ui/Text";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useExerciseFlow } from "@/src/hooks/useExerciseFlow";
import { useExerciseMutation } from "@/src/hooks/useExerciseMutation";
import { useExerciseAI } from "@/src/hooks/useExerciseAI";
import type {
  ExerciseType,
  ExerciseConfig,
  StepProps,
} from "@/src/types/exerciseFlow";
import { useSingleExerciseEntry } from "@/src/hooks/useSingleExerciseEntry";
import { getExerciseConfig } from "@/src/data/exerciseRegistry";

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

  return (
    <ResolvedExerciseFlowScreen
      config={config}
      entryId={entryId}
      readOnly={readOnly}
    />
  );
};

import StageProgressBar from "@/src/components/ui/StageProgressBar";
import { SAGE, OTTER_BLUE, PARROT_ORANGE, MACAW_PURPLE } from "@/lib/tokens";

interface ResolvedExerciseFlowScreenProps {
  config: ExerciseConfig<any>;
  entryId?: string;
  readOnly: boolean;
}

const ResolvedExerciseFlowScreen: React.FC<ResolvedExerciseFlowScreenProps> = ({
  config,
  entryId,
  readOnly,
}) => {
  const router = useRouter();
  const exerciseType = config.type;
  const isConfirmedExitRef = useRef(false);

  // Dynamic category-based accent color mapping matching design philosophy
  const accentColor = useMemo(() => {
    switch (config.category) {
      case "mindfulness":
        return OTTER_BLUE;
      case "anxiety":
        return PARROT_ORANGE;
      case "overthinking":
        return MACAW_PURPLE;
      case "cbt_core":
      default:
        return SAGE[500];
    }
  }, [config.category]);

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

  const exitScreen = useCallback(() => {
    isConfirmedExitRef.current = true;
    router.back();
  }, [router]);

  // Trigger AI when entering a step with AI config
  React.useEffect(() => {
    if (currentStep?.ai && !readOnly) {
      ai.generate(flow.response);
    }
  }, [flow.currentStepIndex]);

  // ─── Handlers ─────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    if (readOnly || flow.currentStepIndex === 0) {
      exitScreen();
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
            exitScreen();
          } catch (err) {
            Alert.alert("Save failed", "Please try again.");
          }
        },
      },
      {
        text: "Discard",
        style: "destructive",
        onPress: () => {
          setTimeout(() => {
            exitScreen();
          }, 100);
        },
      },
    ]);
  }, [readOnly, flow, entryId, save, exitScreen]);

  const handleSave = useCallback(async () => {
    try {
      const payload = flow.getSavePayload("completed");
      await save(payload, entryId);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      exitScreen();
    } catch (err) {
      Alert.alert("Save failed", "Please try again.");
    }
  }, [flow, entryId, save, exitScreen]);

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
      if (isConfirmedExitRef.current) {
        return;
      }

      e.preventDefault();
      handleClose();
    });
    return unsub;
  }, [navigation, handleClose, readOnly, flow.currentStepIndex]);

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

  // ─── Guards ───────────────────────────────────────────────────────
  if (isLoadingEntry && entryId) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-base text-slate-400">Loading...</Text>
      </SafeAreaView>
    );
  }

  const pct = Math.round(flow.progress * 100);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: config.backgroundColor ?? "#FFFFFF" }}
    >
      {!usesEmbeddedHeader ? (
        <View className="flex-row items-center px-5 py-3 gap-2.5">
          <Pressable
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel="Close exercise"
            hitSlop={12}
            className="w-11 h-11 rounded-full items-center justify-center active:bg-slate-100 bg-transparent"
          >
            <Text
              variant="h3"
              className="text-ink-soft text-[20px] font-bold"
            >
              ✕
            </Text>
          </Pressable>

          <View className="flex-1">
            <StageProgressBar
              progress={flow.progress}
              fillColor={accentColor}
              trackColor="#E5E5E5"
              height={12}
              showGlow={true}
            />
          </View>

          <RNText
            className="happy-font-body-bold text-[12px] leading-[16px] text-ink-soft min-w-[36px] text-right ml-2.5"
            style={{ color: accentColor }}
          >
            {pct}%
          </RNText>
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
ResolvedExerciseFlowScreen.displayName = "ResolvedExerciseFlowScreen";
