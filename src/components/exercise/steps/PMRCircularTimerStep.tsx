import React, { useCallback, useRef, useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Text } from "@/src/components/ui/Text";
import { Button } from "@/src/components/ui/Button";
import { StepLayout } from "./StepLayout";
import { CircularDraggableSlider } from "@/src/animations/pomodoro-timer/src/components/draggable-slider";
import type { CircularDraggableSliderRefType } from "@/src/animations/pomodoro-timer/src/components/draggable-slider";
import { AnimatedCount } from "@/src/animations/pomodoro-timer/src/components/animated-count/animated-count";
import type { StepProps } from "@/src/types/exerciseFlow";
import { SAGE, BRAND_BORDER, INK, INK_MUTED } from "@/lib/tokens";

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
  }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const currentArea = areas[currentIndex] || areas[0];
    const defaultSec = currentArea.defaultDurationSec ?? 5;

    const animatedNumber = useSharedValue(defaultSec);
    const circularSliderRef = useRef<CircularDraggableSliderRefType>(null);

    const completedList: string[] = Array.isArray((response as any)[fieldKey])
      ? (response as any)[fieldKey]
      : [];
    const isCurrentCompleted = completedList.includes(currentArea.value);

    const markCurrentCompleted = useCallback(() => {
      if (!isCurrentCompleted) {
        onUpdate({
          [fieldKey]: [...completedList, currentArea.value],
        } as any);
      }
    }, [isCurrentCompleted, onUpdate, fieldKey, completedList, currentArea.value]);

    const handleStartTimer = useCallback(() => {
      if (isRunning) {
        circularSliderRef.current?.stopTimer();
        setIsRunning(false);
        return;
      }
      Haptics.selectionAsync().catch(() => {});
      setIsRunning(true);
      const targetDuration = animatedNumber.value > 0 ? animatedNumber.value : defaultSec;
      circularSliderRef.current?.runTimer(targetDuration);
    }, [isRunning, animatedNumber, defaultSec]);

    const handleTimerCompletion = useCallback(() => {
      setIsRunning(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      markCurrentCompleted();
    }, [markCurrentCompleted]);

    const handleNextArea = useCallback(() => {
      Haptics.selectionAsync().catch(() => {});
      if (isRunning) {
        circularSliderRef.current?.stopTimer();
        setIsRunning(false);
      }
      if (currentIndex < areas.length - 1) {
        setCurrentIndex(currentIndex + 1);
        animatedNumber.value = areas[currentIndex + 1].defaultDurationSec ?? 5;
        circularSliderRef.current?.resetTimer();
      } else {
        onNext();
      }
    }, [isRunning, currentIndex, areas, animatedNumber, onNext]);

    const handleSkipCurrent = useCallback(() => {
      if (isRunning) {
        circularSliderRef.current?.stopTimer();
        setIsRunning(false);
      }
      markCurrentCompleted();
      if (currentIndex < areas.length - 1) {
        setCurrentIndex(currentIndex + 1);
        animatedNumber.value = areas[currentIndex + 1].defaultDurationSec ?? 5;
        circularSliderRef.current?.resetTimer();
      }
    }, [isRunning, markCurrentCompleted, currentIndex, areas, animatedNumber]);

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
                    if (isRunning) {
                      circularSliderRef.current?.stopTimer();
                      setIsRunning(false);
                    }
                    setCurrentIndex(idx);
                    animatedNumber.value = area.defaultDurationSec ?? 5;
                    circularSliderRef.current?.resetTimer();
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

        {/* Circular Draggable Timer Zone */}
        <View className="items-center justify-center my-6 h-[300px]">
          <CircularDraggableSlider
            ref={circularSliderRef}
            radius={130}
            containerMode="inline"
            linesAmount={120}
            maxLineHeight={24}
            minLineHeight={16}
            bigLineIndexOffset={10}
            indicatorColor={SAGE[500]}
            lineColor={BRAND_BORDER}
            bigLineColor={SAGE[300]}
            onProgressChange={(seconds) => {
              animatedNumber.value = seconds;
            }}
            onCompletion={handleTimerCompletion}
          />
          <View className="absolute items-center justify-center pointer-events-none">
            <AnimatedCount
              count={animatedNumber}
              maxDigits={2}
              fontSize={44}
              textDigitHeight={54}
              textDigitWidth={28}
              color={INK}
              gradientAccentColor="#FFFFFF"
            />
            <Text variant="caption" className="text-xs text-ink-muted mt-1 uppercase tracking-wider font-semibold">
              {isRunning ? "Tensing..." : "Seconds (Drag to set)"}
            </Text>
          </View>
        </View>

        {/* Controls */}
        <View className="mt-2 space-y-3">
          <Button
            label={
              isRunning
                ? "Stop Timer"
                : isCurrentCompleted
                ? "Timer Finished — Run Again"
                : `Start ${animatedNumber.value || defaultSec}s Tension Timer`
            }
            onPress={handleStartTimer}
            variant={isRunning ? "secondary" : "primary"}
            size="lg"
            fullWidth
          />

          <View className="flex-row items-center justify-between pt-2">
            <Pressable onPress={handleSkipCurrent} className="py-2 px-3">
              <Text className="text-xs font-medium text-ink-muted underline">
                {isCurrentCompleted ? "Next Area →" : "Skip Timer & Mark Released"}
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
