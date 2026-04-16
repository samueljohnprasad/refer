import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { StepLayout } from "./StepLayout";
import type { StepProps, TimerStepConfig } from "@/src/types/exerciseFlow";

interface CountdownTimerStepProps extends StepProps {
  title: string;
  subtitle: string;
  timerConfig: TimerStepConfig;
  completedFieldKey: string;
  /** Optional field to increment on each tap during the timer (e.g. mind wandering count) */
  tapCountFieldKey?: string;
}

export const CountdownTimerStep: React.FC<CountdownTimerStepProps> = React.memo(
  ({
    response,
    onUpdate,
    onNext,
    onBack,
    canGoBack,
    isValid,
    progress,
    stepIndex,
    totalSteps,
    title,
    subtitle,
    timerConfig,
    completedFieldKey,
    tapCountFieldKey,
    isSaving,
  }) => {
    const [remaining, setRemaining] = useState(timerConfig.durationMs);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const completed =
      (response as Record<string, any>)[completedFieldKey] === true;

    useEffect(() => {
      if (isRunning && remaining > 0) {
        intervalRef.current = setInterval(() => {
          setRemaining((prev) => {
            const next = prev - 100;
            if (next <= 0) {
              clearInterval(intervalRef.current!);
              setIsRunning(false);
              onUpdate({ [completedFieldKey]: true } as any);
              return 0;
            }
            return next;
          });
        }, 100);
      }
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, [isRunning, remaining, completedFieldKey, onUpdate]);

    const startTimer = useCallback(() => setIsRunning(true), []);

    const handleTap = useCallback(() => {
      if (tapCountFieldKey && isRunning) {
        const current =
          (response as Record<string, any>)[tapCountFieldKey] ?? 0;
        onUpdate({ [tapCountFieldKey]: current + 1 } as any);
      }
    }, [tapCountFieldKey, isRunning, response, onUpdate]);

    const handleSkip = useCallback(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsRunning(false);
      setRemaining(0);
      onUpdate({ [completedFieldKey]: true } as any);
    }, [completedFieldKey, onUpdate]);

    const totalSec = Math.ceil(remaining / 1000);
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    const progressPct = 1 - remaining / timerConfig.durationMs;

    return (
      <StepLayout
        title={title}
        subtitle={subtitle}
        progress={progress}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        canGoBack={canGoBack}
        isValid={isValid}
        onBack={onBack}
        onNext={onNext}
        isLoading={isSaving}
      >
        <View className="flex-1 justify-center items-center">
          {/* Circular timer display */}
          <View
            className="w-48 h-48 rounded-full items-center justify-center mb-8"
            style={{
              backgroundColor: completed ? "#D1FAE5" : "#F8FAFC",
              borderWidth: 4,
              borderColor: completed ? "#58CC02" : "#E2E8F0",
            }}
          >
            {completed ? (
              <Text className="text-4xl">✓</Text>
            ) : (
              <Text className="text-4xl font-extrabold text-slate-900">
                {minutes}:{seconds.toString().padStart(2, "0")}
              </Text>
            )}
          </View>

          {/* Timer progress bar */}
          {isRunning && (
            <View className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
              <View
                className="h-full rounded-full bg-green-500"
                style={{ width: `${progressPct * 100}%` }}
              />
            </View>
          )}

          {timerConfig.label && isRunning && (
            <Text className="text-sm text-slate-500 mb-4">
              {timerConfig.label}
            </Text>
          )}

          {/* Tap zone during timer */}
          {tapCountFieldKey && isRunning && (
            <Pressable
              onPress={handleTap}
              accessibilityRole="button"
              accessibilityLabel="Tap when mind wanders"
              className="bg-slate-100 rounded-xl px-6 py-3 mb-4"
            >
              <Text className="text-sm font-medium text-slate-600">
                Tap here (
                {(response as Record<string, any>)[tapCountFieldKey] ?? 0})
              </Text>
            </Pressable>
          )}

          {/* Start / Skip buttons */}
          {!isRunning && !completed && (
            <Pressable
              onPress={startTimer}
              accessibilityRole="button"
              accessibilityLabel="Start timer"
              className="h-14 w-full rounded-2xl items-center justify-center active:opacity-90"
              style={{ backgroundColor: "#58CC02" }}
            >
              <Text className="text-base font-extrabold text-white uppercase tracking-wider">
                Start
              </Text>
            </Pressable>
          )}

          {isRunning && timerConfig.skippable && (
            <Pressable
              onPress={handleSkip}
              accessibilityRole="button"
              accessibilityLabel="Skip timer"
              className="mt-2"
            >
              <Text className="text-sm font-medium text-slate-400">Skip</Text>
            </Pressable>
          )}
        </View>
      </StepLayout>
    );
  },
);

CountdownTimerStep.displayName = "CountdownTimerStep";
