import React, { useCallback, useEffect, useMemo, useRef } from "react";
import * as Haptics from "expo-haptics";
import {
  View,
  SafeAreaView,
  Pressable,
  Alert,
  BackHandler,
  Text as RNText,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { Text } from "@/src/components/ui/Text";
import { Host, Button as SwiftUIButton } from "@expo/ui/swift-ui";
import { buttonStyle, labelStyle, controlSize, tint } from "@expo/ui/swift-ui/modifiers";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { useRouter } from "expo-router";
import { useNavigation } from "expo-router/react-navigation";
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

// ─── Animated step transition wrapper ────────────────────────────────────────

function AnimatedStepContainer({
  stepIndex,
  className,
  children,
}: {
  stepIndex: number;
  className: string;
  children: React.ReactNode;
}) {
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const prevStepRef = useRef(stepIndex);

  useEffect(() => {
    if (prevStepRef.current === stepIndex) return;
    const isForward = stepIndex > prevStepRef.current;
    prevStepRef.current = stepIndex;

    // Enter: slide and fade smoothly (matching OnboardingScreen exactly)
    opacity.value = 0;
    translateX.value = isForward ? 18 : -18;

    translateX.value = withTiming(0, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(1, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
  }, [stepIndex]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View className={className} style={animStyle}>
      {children}
    </Animated.View>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

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
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-base font-bold text-blue-500">Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const { entry: existingEntry, isLoading: isLoadingEntry } =
    useSingleExerciseEntry(entryId ?? null);

  if (isLoadingEntry && entryId) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-base text-slate-400">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <ResolvedExerciseFlowScreen
      config={config}
      existingEntry={existingEntry}
      readOnly={readOnly}
    />
  );
};

import { LessonScreen } from "@/src/components/ui/LessonScreen";
import { SAGE, OTTER_BLUE, PARROT_ORANGE, MACAW_PURPLE, BRAND_SURFACE } from "@/lib/tokens";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { CheckmarkCircle01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { useXPOptional } from "@/src/context/XPContext";
import { XPActionType } from "@/src/types/xp";

interface ResolvedExerciseFlowScreenProps {
  config: ExerciseConfig<any>;
  existingEntry?: any;
  readOnly: boolean;
}

const ResolvedExerciseFlowScreen: React.FC<ResolvedExerciseFlowScreenProps> = ({
  config,
  existingEntry,
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

  // ─── Flow state ───────────────────────────────────────────────────
  const flow = useExerciseFlow(config as ExerciseConfig<any>, existingEntry, readOnly);

  // ─── Mutation ─────────────────────────────────────────────────────
  const { save, isSaving } = useExerciseMutation();
  const xp = useXPOptional();

  // ─── AI ───────────────────────────────────────────────────────────
  const currentStep = config?.steps[flow.currentStepIndex];
  const ai = useExerciseAI({
    steps: config.steps,
    currentStepIndex: flow.currentStepIndex,
    response: flow.response,
    readOnly,
  });
  const isFinalStep = flow.currentStepIndex === flow.totalSteps - 1;

  const exitScreen = useCallback(() => {
    isConfirmedExitRef.current = true;
    router.back();
  }, [router]);

  // Trigger AI when entering a step with AI config (now handled internally by useExerciseAI)

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
            await save(payload, existingEntry?.id);
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
  }, [readOnly, flow, existingEntry, save, exitScreen]);

  const handleSave = useCallback(async () => {
    try {
      const payload = flow.getSavePayload("completed");
      await save(payload, existingEntry?.id);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      if (!existingEntry || existingEntry.status !== "completed") {
        xp?.awardXP(XPActionType.EXERCISE_COMPLETE, {
          customDescription: config.title || "Exercise completed",
        });
      }

      exitScreen();
    } catch (err) {
      Alert.alert("Save failed", "Please try again.");
    }
  }, [flow, existingEntry, save, config.title, xp, exitScreen]);

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
      aiLoadingMessage: ai.loadingMessage,
      isSaving,
      readOnly,
    }),
    [
      flow,
      ai.suggestions,
      ai.isLoading,
      ai.loadingMessage,
      isSaving,
      readOnly,
      handleClose,
      handleSave,
      isFinalStep,
    ],
  );

  // ─── Guards ───────────────────────────────────────────────────────
  // (Loading is now handled by the parent component)

  const pct = Math.round(flow.progress * 100);
  const primaryLabel = currentStep?.nextLabel || (isFinalStep ? "Finish" : "Continue");
  
  // In readOnly mode, the primary button is always "Done" and just closes the screen
  const onPrimaryPress = readOnly ? handleClose : isFinalStep ? handleSave : flow.goNext;

  return (
    <LessonScreen
      className="flex-1"
      style={{ backgroundColor: config.backgroundColor ?? "#FFFFFF" }}
      hideHeader={currentStep?.hideHeader || readOnly}
      hideFooter={currentStep?.hideFooter || readOnly}
      progress={flow.progress}
      onClose={handleClose}
      backButtonVariant="close-icon"
      primaryLabel={primaryLabel}
      onPrimaryPress={onPrimaryPress}
      primaryDisabled={!flow.isCurrentStepValid || isSaving}
      primaryLoading={isSaving}
      primaryRightIcon={
        isFinalStep && !isSaving ? (
          <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} color={BRAND_SURFACE} strokeWidth={2} />
        ) : undefined
      }
      secondaryLabel={isFinalStep ? (currentStep?.secondaryLabel || "Edit answers") : (flow.canGoBack ? "Back" : undefined)}
      onSecondaryPress={flow.canGoBack ? flow.goBack : undefined}
    >
      {readOnly && (
        <SafeAreaView className="absolute top-0 left-0 z-50" pointerEvents="box-none">
          <View className="m-5 mt-2">
            {isLiquidGlassAvailable() ? (
              <Host matchContents>
                <SwiftUIButton
                  onPress={handleClose}
                  label="Close"
                  modifiers={[
                    labelStyle('iconOnly'),
                    buttonStyle('glassProminent'),
                    controlSize('regular'),
                    tint("#1E293B")
                  ]}
                  systemImage="xmark"
                />
              </Host>
            ) : (
              <Pressable
                onPress={handleClose}
                className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 active:opacity-70"
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={22} color="#64748B" strokeWidth={2.5} />
              </Pressable>
            )}
          </View>
        </SafeAreaView>
      )}

      <AnimatedStepContainer
        stepIndex={flow.currentStepIndex}
        className="flex-1"
      >
        {StepComponent ? (
          <StepComponent {...stepProps} />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-slate-400">Unknown step</Text>
          </View>
        )}
      </AnimatedStepContainer>
    </LessonScreen>
  );
};

ExerciseFlowScreen.displayName = "ExerciseFlowScreen";
ResolvedExerciseFlowScreen.displayName = "ResolvedExerciseFlowScreen";
