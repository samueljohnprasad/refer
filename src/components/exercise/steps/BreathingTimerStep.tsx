import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Pressable, Animated } from "react-native";
import { Text } from "@/components/ui/text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { WellnessIcon } from "@hugeicons/core-free-icons";
import { StepLayout } from "./StepLayout";
import type { StepProps, BreathingPattern } from "@/src/types/exerciseFlow";

type Phase = "inhale" | "holdIn" | "exhale" | "holdOut";

const PHASE_LABELS: Record<Phase, string> = {
  inhale: "Breathe In",
  holdIn: "Hold",
  exhale: "Breathe Out",
  holdOut: "Hold",
};

interface BreathingTimerStepProps extends StepProps {
  title: string;
  subtitle: string;
  pattern: BreathingPattern;
  completedFieldKey: string;
}

export const BreathingTimerStep: React.FC<BreathingTimerStepProps> = React.memo(
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
    pattern,
    completedFieldKey,
    isSaving,
  }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [currentRound, setCurrentRound] = useState(0);
    const [currentPhase, setCurrentPhase] = useState<Phase>("inhale");
    const [phaseTime, setPhaseTime] = useState(0);
    const scaleAnim = useRef(new Animated.Value(0.6)).current;
    const currentScaleRef = useRef(0.6);
    const completed =
      (response as Record<string, any>)[completedFieldKey] === true;
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const getPhaseSequence = useCallback((): {
      phase: Phase;
      duration: number;
    }[] => {
      const seq: { phase: Phase; duration: number }[] = [];
      if (pattern.inhale > 0)
        seq.push({ phase: "inhale", duration: pattern.inhale });
      if (pattern.holdIn > 0)
        seq.push({ phase: "holdIn", duration: pattern.holdIn });
      if (pattern.exhale > 0)
        seq.push({ phase: "exhale", duration: pattern.exhale });
      if (pattern.holdOut > 0)
        seq.push({ phase: "holdOut", duration: pattern.holdOut });
      return seq;
    }, [pattern]);

    useEffect(() => {
      if (!isRunning || completed) return;

      const seq = getPhaseSequence();
      let roundIdx = currentRound;
      let phaseIdx = 0;
      let timer = 0;

      const setPhaseState = () => {
        setCurrentPhase(seq[phaseIdx].phase);
        setPhaseTime(seq[phaseIdx].duration);

        // Animate scale
        const targetScale =
          seq[phaseIdx].phase === "inhale"
            ? 1.0
            : seq[phaseIdx].phase === "exhale"
              ? 0.6
              : currentScaleRef.current;
        currentScaleRef.current = targetScale;
        Animated.timing(scaleAnim, {
          toValue: targetScale,
          duration: seq[phaseIdx].duration * 1000,
          useNativeDriver: true,
        }).start();
      };

      setPhaseState();

      intervalRef.current = setInterval(() => {
        timer += 1;
        setPhaseTime((prev) => prev - 1);

        if (timer >= seq[phaseIdx].duration) {
          timer = 0;
          phaseIdx += 1;

          if (phaseIdx >= seq.length) {
            phaseIdx = 0;
            roundIdx += 1;
            setCurrentRound(roundIdx);

            if (roundIdx >= pattern.rounds) {
              clearInterval(intervalRef.current!);
              setIsRunning(false);
              onUpdate({ [completedFieldKey]: true } as any);
              return;
            }
          }

          setPhaseState();
        }
      }, 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, [isRunning, completed]);

    const circleSize =
      pattern.visual === "square" ? "rounded-2xl" : "rounded-full";

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
          {/* Animated breathing visual */}
          <Animated.View
            className={`w-52 h-52 ${circleSize} items-center justify-center mb-8`}
            style={{
              backgroundColor: completed ? "#D1FAE5" : "#E0F2FE",
              borderWidth: 3,
              borderColor: completed ? "#58CC02" : "#93C5FD",
              transform: [{ scale: scaleAnim }],
            }}
          >
            {completed ? (
              <Text className="text-4xl">✓</Text>
            ) : isRunning ? (
              <View className="items-center">
                <Text className="text-2xl font-extrabold text-slate-900">
                  {phaseTime}s
                </Text>
                <Text className="text-base font-bold text-blue-600 mt-1">
                  {PHASE_LABELS[currentPhase]}
                </Text>
              </View>
            ) : (
              <HugeiconsIcon
                icon={WellnessIcon}
                size={48}
                color="#64748B"
                strokeWidth={1.6}
              />
            )}
          </Animated.View>

          {/* Round indicator */}
          {isRunning && (
            <Text className="text-xs text-slate-400 mb-4">
              Round {currentRound + 1} / {pattern.rounds}
            </Text>
          )}

          {/* Start button */}
          {!isRunning && !completed && (
            <Pressable
              onPress={() => setIsRunning(true)}
              accessibilityRole="button"
              accessibilityLabel="Start breathing exercise"
              className="h-14 w-full rounded-2xl items-center justify-center active:opacity-90"
              style={{ backgroundColor: "#58CC02" }}
            >
              <Text className="text-base font-extrabold text-white uppercase tracking-wider">
                Start Breathing
              </Text>
            </Pressable>
          )}
        </View>
      </StepLayout>
    );
  },
);

BreathingTimerStep.displayName = "BreathingTimerStep";
