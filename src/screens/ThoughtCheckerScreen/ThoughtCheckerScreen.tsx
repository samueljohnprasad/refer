import React, { useCallback } from "react";
import { View, ScrollView, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useThoughtCheckerFlow } from "./hooks/useThoughtCheckerFlow";
import { useThoughtCatcherMutation } from "../ThoughtCatcherScreen/hooks/useThoughtCatcherMutation";
import { useSingleThoughtCatcherQuery } from "../ThoughtCatcherScreen/hooks/useThoughtCatcherQuery";
import { RealityCheckStep } from "./steps/RealityCheckStep";
import { BalancedThoughtStep } from "./steps/BalancedThoughtStep";
import { CheckerSummaryStep } from "./steps/CheckerSummaryStep";

export default function ThoughtCheckerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const entryId = Array.isArray(id) ? id[0] : id;

  const { entry, isLoading } = useSingleThoughtCatcherQuery(entryId ?? null);
  const { saveChecker, isSavingChecker } = useThoughtCatcherMutation();

  const initialData = React.useMemo(() => {
    if (!entry) return undefined;
    return {
      isTrue: entry.is_true as any,
      balancedThought: entry.balanced_thought || "",
    };
  }, [entry]);

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
  } = useThoughtCheckerFlow(initialData);

  const handleClose = useCallback(() => {
    Alert.alert(
      "Discard checking?",
      "You have unsaved progress. Are you sure you want to leave?",
      [
        { text: "Keep going", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => {
            reset();
            router.back();
          },
        },
      ],
    );
  }, [reset]);

  const handleBalancedNext = useCallback(async () => {
    if (!entryId) return;
    try {
      await saveChecker({ id: entryId, formState });
      goNext(); // Advance to summary step
    } catch {
      Alert.alert(
        "Error",
        "Failed to save your balanced thought. Please try again.",
      );
    }
  }, [entryId, formState, saveChecker, goNext]);

  const handleDone = useCallback(() => {
    // Navigate back to Exercises Screen or close
    router.replace("/tabs/exercises");
  }, []);

  if (isLoading || !entry) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator
          size="large"
          color="#3B82F6"
        />
      </SafeAreaView>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case "is_true":
        return (
          <RealityCheckStep
            value={formState.isTrue}
            automaticThought={entry.automatic_thought || ""}
            onChange={(val) => dispatch({ type: "SET_IS_TRUE", payload: val })}
            onNext={goNext}
            onBack={goBack}
            canGoBack={canGoBack}
            isValid={isCurrentStepValid}
            progress={progress}
            onClose={handleClose}
          />
        );
      case "balanced_thought":
        return (
          <BalancedThoughtStep
            value={formState.balancedThought}
            onChange={(text) =>
              dispatch({ type: "SET_BALANCED_THOUGHT", payload: text })
            }
            onNext={handleBalancedNext}
            onBack={goBack}
            canGoBack={canGoBack}
            isValid={isCurrentStepValid}
            progress={progress}
            onClose={handleClose}
            isSaving={isSavingChecker}
          />
        );
      case "checker_summary":
        return (
          <CheckerSummaryStep
            situation={entry.situation || ""}
            automaticThought={entry.automatic_thought || ""}
            intensity={entry.intensity || 0}
            isTrue={formState.isTrue || ""}
            balancedThought={formState.balancedThought}
            onDone={handleDone}
            onClose={handleDone}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={["top", "bottom"]}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingBottom: 24,
          paddingTop: 16,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderStep()}
      </ScrollView>
    </SafeAreaView>
  );
}
