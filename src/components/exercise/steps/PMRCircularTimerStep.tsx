import React, { useCallback, useRef, useState, useEffect } from "react";
import { View, Pressable, ScrollView } from "react-native";
import * as Haptics from "expo-haptics";
import { Text } from "@/src/components/ui/Text";
import { StepLayout } from "./StepLayout";
import { CircularProgressTimer } from "@/src/components/ui/CircularProgressTimer";
import type { StepProps } from "@/src/types/exerciseFlow";
import { SAGE, INK, INK_MUTED } from "@/lib/tokens";

export interface PMRAreaConfig {
  value: string;
  label: string;
  instruction: string;
  defaultDurationSec?: number;
}

export interface PMRCircularTimerStepProps extends StepProps {
  title: string;
  subtitle?: string;
  fieldKey: string;
  areas: PMRAreaConfig[];
  minCompleted?: number;
}

export const PMRCircularTimerStep: React.FC<PMRCircularTimerStepProps> = React.memo(
  ({
    response,
    onUpdate,
    onNext,
    onBack,
    onClose,
    canGoBack,
    isValid,
    progress,
    stepIndex,
    totalSteps,
    title,
    subtitle,
    fieldKey,
    areas,
    minCompleted = 5,
    setPrimaryOverride,
  }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const currentArea = areas[currentIndex] || areas[0];
    const durationSec = currentArea.defaultDurationSec ?? 5;
    const durationMs = durationSec * 1000;

    const [remainingMs, setRemainingMs] = useState(durationMs);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const remainingRef = useRef(durationMs);

    const completedList: string[] = Array.isArray((response as any)[fieldKey])
      ? (response as any)[fieldKey]
      : [];
    const isCurrentCompleted = completedList.includes(currentArea.value);

    // Reset remaining time when current area changes
    useEffect(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const newDuration = (areas[currentIndex]?.defaultDurationSec ?? 5) * 1000;
      setRemainingMs(newDuration);
      remainingRef.current = newDuration;
    }, [currentIndex, areas]);

    const markCurrentCompleted = useCallback(() => {
      if (!isCurrentCompleted) {
        onUpdate({
          [fieldKey]: [...completedList, currentArea.value],
        } as any);
      }
    }, [isCurrentCompleted, onUpdate, fieldKey, completedList, currentArea.value]);

    useEffect(() => {
      if (isRunning && remainingRef.current > 0) {
        intervalRef.current = setInterval(() => {
          remainingRef.current -= 100;
          if (remainingRef.current <= 0) {
            remainingRef.current = 0;
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
            markCurrentCompleted();
          }
          setRemainingMs(remainingRef.current);
        }, 100);
      }
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, [isRunning, markCurrentCompleted]);

    const handleToggleTimer = useCallback(() => {
      if (isRunning) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
      } else {
        Haptics.selectionAsync().catch(() => {});
        if (remainingRef.current <= 0) {
          remainingRef.current = durationMs;
          setRemainingMs(durationMs);
        }
        setIsRunning(true);
      }
    }, [isRunning, durationMs]);

    const handleNextArea = useCallback(() => {
      Haptics.selectionAsync().catch(() => {});
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (currentIndex < areas.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsRunning(true);
      } else {
        setIsRunning(false);
        onNext();
      }
    }, [currentIndex, areas.length, onNext]);

    const handleSkipCurrent = useCallback(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsRunning(false);
      remainingRef.current = 0;
      setRemainingMs(0);
      markCurrentCompleted();
      if (currentIndex < areas.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }, [currentIndex, areas.length, markCurrentCompleted]);

    useEffect(() => {
      if (setPrimaryOverride) {
        if (!isRunning && !isCurrentCompleted) {
          setPrimaryOverride({
            label: "Start Timer",
            action: handleToggleTimer,
            disabled: false,
          });
        } else if (isRunning) {
          setPrimaryOverride({
            label: "Pause Timer",
            action: handleToggleTimer,
            disabled: false,
          });
        } else if (isCurrentCompleted) {
          setPrimaryOverride({
            label: currentIndex < areas.length - 1 ? "Next Area" : "Finish",
            action: currentIndex < areas.length - 1 ? handleNextArea : onNext,
            disabled: false,
          });
        }
      }
    }, [isRunning, isCurrentCompleted, handleToggleTimer, handleNextArea, onNext, currentIndex, areas.length, setPrimaryOverride]);

    const timerProgress = Math.max(0, Math.min(1, 1 - remainingMs / durationMs));
    const secondsDisplay = Math.ceil(remainingMs / 1000);

    return (
      <StepLayout
        title={title}
        subtitle={subtitle ?? "Tense and release each muscle group using the timer."}
        progress={progress}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        canGoBack={canGoBack}
        isValid={isValid || completedList.length >= minCompleted}
        onBack={onBack}
        onNext={onNext}
        onClose={onClose}
      >
        {/* Horizontal area navigation pills */}
        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 2 }}
          >
            {areas.map((area, idx) => {
              const active = idx === currentIndex;
              const done = completedList.includes(area.value);
              return (
                <Pressable
                  key={area.value}
                  onPress={() => {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    setIsRunning(false);
                    setCurrentIndex(idx);
                  }}
                  className={`px-3.5 py-2 rounded-full border flex-row items-center space-x-1.5 ${
                    active
                      ? "bg-sage-selected border-sage-500"
                      : done
                      ? "bg-sage-50 border-sage-300"
                      : "bg-brand-surface border-brand-border"
                  }`}
                >
                  {done && (
                    <Text className="text-sage-600 font-bold text-xs">✓</Text>
                  )}
                  <Text
                    variant="caption"
                    className={`text-xs font-medium ${
                      active
                        ? "text-sage-700 font-semibold"
                        : done
                        ? "text-sage-600"
                        : "text-ink-muted"
                    }`}
                  >
                    {idx + 1}. {area.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Current area instruction */}
        <View className="bg-brand-surface border border-brand-border rounded-2xl p-4 mb-2">
          <Text variant="body" className="text-sm text-ink font-medium leading-relaxed">
            {currentArea.instruction}
          </Text>
        </View>

        {/* Skia Circular Progress Timer */}
        <View className="items-center justify-center my-6 h-[260px]">
          <CircularProgressTimer
            progress={timerProgress}
            size={210}
            strokeWidth={8}
            color={SAGE[500]}
            trackColor="rgba(0,0,0,0.06)"
          >
            <View className="items-center justify-center">
              <Text className="font-bold text-5xl text-ink tracking-tight">
                {secondsDisplay}
              </Text>
              <Text variant="caption" className="text-xs text-ink-muted mt-2 uppercase tracking-widest font-semibold">
                {isRunning ? "Tensing Muscles..." : isCurrentCompleted ? "Released!" : "Seconds"}
              </Text>
            </View>
          </CircularProgressTimer>
        </View>

        {/* Controls */}
        <View className="mt-2 space-y-3">
          <View className="flex-row items-center justify-between pt-2">
            <Pressable onPress={handleSkipCurrent} className="py-2 px-3">
              <Text className="text-xs font-medium text-ink-muted underline">
                {isCurrentCompleted ? "Run Timer Again" : "Skip Timer & Mark Released"}
              </Text>
            </Pressable>

            <Text className="text-xs font-medium text-sage-600">
              {completedList.length} of {areas.length} areas released
            </Text>
          </View>
        </View>
      </StepLayout>
    );
  },
);

PMRCircularTimerStep.displayName = "PMRCircularTimerStep";
