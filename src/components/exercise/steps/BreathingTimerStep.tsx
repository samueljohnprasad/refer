import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Pressable, Animated } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Button } from "@/src/components/ui/Button";
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
            className={`w-52 h-52 ${circleSize} items-center justify-center mb-8 border-4`}
            style={{
              backgroundColor: completed ? "#D1FAE5" : isRunning ? "#DDF4FF" : "#F8FAFC",
              borderColor: completed ? "#10B981" : isRunning ? "#84D8FF" : "#E2E8F0",
              transform: [{ scale: scaleAnim }],
            }}
          >
            {completed ? (
              <Text variant="display" className="text-emerald-600 text-5xl">
                ✓
              </Text>
            ) : isRunning ? (
              <View className="items-center">
                <Text variant="display" className="text-ink text-[36px] font-bold">
                  {phaseTime}s
                </Text>
                <Text variant="body-bold" className="text-blue-500 mt-1">
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
            <Text variant="caption-muted" className="mb-4 font-bold text-center">
              Round {currentRound + 1} of {pattern.rounds}
            </Text>
          )}

          {/* Start button */}
          {!isRunning && !completed && (
            <Button
              label="Start Breathing"
              onPress={() => setIsRunning(true)}
              variant="primary"
              size="lg"
              fullWidth={true}
            />
          )}
        </View>
      </StepLayout>
    );
  },
);

BreathingTimerStep.displayName = "BreathingTimerStep";
