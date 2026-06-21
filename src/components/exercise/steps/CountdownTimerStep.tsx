import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Button } from "@/src/components/ui/Button";
import { StepLayout } from "./StepLayout";
import { PsychoeducationCard } from "@/src/components/exercise/PsychoeducationCard";
import type { StepProps, TimerStepConfig } from "@/src/types/exerciseFlow";

interface CountdownTimerStepProps extends StepProps {
  title: string;
  subtitle: string;
  timerConfig: TimerStepConfig;
  completedFieldKey: string;
  /** Optional field to increment on each tap during the timer (e.g. mind wandering count) */
  tapCountFieldKey?: string;
  psychoeducationText?: string;
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
    psychoeducationText,
  }) => {
    const [remaining, setRemaining] = useState(timerConfig.durationMs);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const remainingRef = useRef(timerConfig.durationMs);

    // Sync when config changes (e.g. stepping back and forth)
    useEffect(() => {
      setRemaining(timerConfig.durationMs);
      remainingRef.current = timerConfig.durationMs;
      setIsRunning(false);
    }, [timerConfig.durationMs]);

    const completed =
      (response as Record<string, any>)[completedFieldKey] === true;

    useEffect(() => {
      if (isRunning && remainingRef.current > 0) {
        intervalRef.current = setInterval(() => {
          remainingRef.current -= 100;
          
          if (remainingRef.current <= 0) {
            remainingRef.current = 0;
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            onUpdate({ [completedFieldKey]: true } as any);
          }
          setRemaining(remainingRef.current);
        }, 100);
      }
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, [isRunning, completedFieldKey, onUpdate]);

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
      remainingRef.current = 0;
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
        <PsychoeducationCard content={psychoeducationText ?? ""} />

        <View className="flex-1 justify-center items-center">
          {/* Circular timer display */}
          <View
            className="w-48 h-48 rounded-full items-center justify-center mb-8 border-4"
            style={{
              backgroundColor: completed ? "#D1FAE5" : "#F8FAFC",
              borderColor: completed ? "#10B981" : "#E2E8F0",
            }}
          >
            {completed ? (
              <Text variant="display" className="text-emerald-600 text-5xl">
                ✓
              </Text>
            ) : (
              <Text
                variant="counter"
                className="text-ink text-[40px] font-bold"
              >
                {minutes}:{seconds.toString().padStart(2, "0")}
              </Text>
            )}
          </View>

          {/* Timer progress bar */}
          {isRunning && (
            <View className="w-full h-3.5 bg-brand-border/60 rounded-full overflow-hidden mb-4">
              <View
                className="h-full rounded-full bg-sage-500"
                style={{ width: `${progressPct * 100}%` }}
              />
            </View>
          )}

          {timerConfig.label && isRunning && (
            <Text variant="body" className="text-sm text-center mb-4">
              {timerConfig.label}
            </Text>
          )}

          {/* Tap zone during timer */}
          {tapCountFieldKey && isRunning && (
            <Pressable
              onPress={handleTap}
              accessibilityRole="button"
              accessibilityLabel="Tap when mind wanders"
              className="bg-slate-100 active:bg-slate-200 rounded-xl px-6 py-3 mb-4 border-b-2 border-slate-200"
            >
              <Text variant="body-bold" className="text-sm text-slate-700">
                Tap here (
                {(response as Record<string, any>)[tapCountFieldKey] ?? 0})
              </Text>
            </Pressable>
          )}

          {/* Start / Skip buttons */}
          {!isRunning && !completed && (
            <Button
              label="Start"
              onPress={startTimer}
              variant="primary"
              size="lg"
              fullWidth={true}
            />
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
