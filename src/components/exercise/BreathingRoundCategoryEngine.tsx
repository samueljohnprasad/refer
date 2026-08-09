import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

type BreathPhase = "idle" | "inhale" | "exhale" | "done";

interface BreathingStep {
  number: string;
  label: string;
}

const INHALE_SECONDS = 4;
const EXHALE_SECONDS = 8;
const ROUND_SECONDS = INHALE_SECONDS + EXHALE_SECONDS;

export function BreathingRoundCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const reduceMotion = useReducedMotion();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scale = useSharedValue(0.72);
  const [phase, setPhase] = useState<BreathPhase>(
    saved?.completedRound === true ? "done" : "idle",
  );
  const [count, setCount] = useState<number | null>(null);
  const running = phase === "inhale" || phase === "exhale";
  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), true);
  }, [onInteraction, saved]);

  useEffect(() => clearRoundTimers, []);

  const startRound = () => {
    if (running) return;
    clearRoundTimers();
    onInteraction(createResponse({ ...saved, completedRound: false }), true);

    if (reduceMotion) {
      finishRound();
      return;
    }

    setPhase("inhale");
    setCount(INHALE_SECONDS);
    scale.value = 0.72;
    scale.value = withTiming(1, {
      duration: INHALE_SECONDS * 1000,
      easing: Easing.linear,
    });

    for (let elapsed = 1; elapsed <= ROUND_SECONDS; elapsed += 1) {
      timers.current.push(
        setTimeout(() => updateRound(elapsed), elapsed * 1000),
      );
    }
  };

  const updateRound = (elapsed: number) => {
    if (elapsed < INHALE_SECONDS) {
      setCount(INHALE_SECONDS - elapsed);
      return;
    }
    if (elapsed === INHALE_SECONDS) {
      setPhase("exhale");
      setCount(EXHALE_SECONDS);
      scale.value = withTiming(0.72, {
        duration: EXHALE_SECONDS * 1000,
        easing: Easing.linear,
      });
      return;
    }
    if (elapsed < ROUND_SECONDS) {
      setCount(ROUND_SECONDS - elapsed);
      return;
    }
    finishRound();
  };

  const finishRound = () => {
    setPhase("done");
    setCount(null);
    scale.value = 0.72;
    onInteraction(createResponse({ ...saved, completedRound: true }), true);
  };

  function clearRoundTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "The 4–8 exhale"}
        instruction={readString(content.instruction) ?? "Try one round."}
      />

      <View className="mb-3 flex-row flex-wrap gap-1.5">
        <Tag label={readString(content.useFor)} tone="olive" />
        <Tag label={readString(content.notFor)} tone="orange" />
      </View>

      <View className="mb-3 flex-row gap-2">
        {readBreathingSteps(content.steps).map((step) => (
          <View
            key={step.label}
            className="flex-1 items-center rounded-[18px] bg-[#F9F4ED] px-1 py-3 shadow-sm shadow-black/10"
          >
            <Text className="happy-font-heading-bold text-[26px] text-[#29452A]">
              {step.number}
            </Text>
            <Text className="happy-font-body-bold mt-0.5 text-center text-[10.5px] tracking-[0.5px] text-[#82796A]">
              {step.label}
            </Text>
          </View>
        ))}
      </View>

      <Text className="happy-font-body mb-3.5 text-[13.5px] leading-[21px] text-[#3F3A34]">
        {readString(content.mechanism)}
      </Text>

      <View className="items-center gap-3 rounded-[24px] bg-[#F9F4ED] p-[22px] shadow-md shadow-black/10">
        <View className="h-[118px] items-center justify-center">
          <Animated.View
            accessibilityLabel={getPhaseLabel(phase)}
            className="h-[110px] w-[110px] items-center justify-center rounded-full bg-[#5F7F58] shadow-md shadow-black/10"
            style={circleStyle}
          >
            <Text className="happy-font-heading-bold text-[30px] text-[#F9F4ED]">
              {phase === "done" ? "✓" : count}
            </Text>
          </Animated.View>
        </View>
        <Text className="happy-font-body-bold min-h-[18px] text-center text-[12.5px] tracking-[0.6px] text-[#29452A]">
          {getPhaseLabel(phase)}
        </Text>
        <Pressable
          accessibilityRole="button"
          disabled={running}
          onPress={startRound}
          className={
            running
              ? "min-h-11 w-full items-center justify-center rounded-full bg-[#EBDDC5] px-5 opacity-60"
              : "min-h-11 w-full items-center justify-center rounded-full border-[1.5px] border-[#DCD3C4] bg-[#F9F4ED] px-5 active:translate-y-0.5"
          }
        >
          <Text className="happy-font-body-bold text-sm text-[#201E1D]">
            {phase === "done" ? "Try another round" : "Try one round"}
          </Text>
        </Pressable>
      </View>

      <Text className="happy-font-body mt-3.5 border-t-[1.5px] border-dashed border-[#DCD3C4] pt-2.5 text-center text-[12.5px] leading-[18px] text-[#82796A]">
        {readString(content.variation)}
      </Text>
    </View>
  );
}

function Tag({
  label,
  tone,
}: {
  label: string | null;
  tone: "olive" | "orange";
}) {
  return (
    <View
      className={
        tone === "olive"
          ? "rounded-full border-[1.5px] border-[#ABC0A2] bg-[#F2F8EF] px-3 py-1.5"
          : "rounded-full border-[1.5px] border-[#ABC0A2] bg-[#F2F8EF] px-3 py-1.5"
      }
    >
      <Text
        className={
          tone === "olive"
            ? "happy-font-body-bold text-xs text-[#29452A]"
            : "happy-font-body-bold text-xs text-[#29452A]"
        }
      >
        {label}
      </Text>
    </View>
  );
}

function readBreathingSteps(value: unknown): BreathingStep[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const step = readRecord(item);
    const number = readString(step?.number);
    const label = readString(step?.label);
    return number && label ? [{ number, label }] : [];
  });
}

function getPhaseLabel(phase: BreathPhase): string {
  if (phase === "inhale") return "BREATHE IN THROUGH YOUR NOSE";
  if (phase === "exhale") return "BREATHE OUT SLOWLY";
  if (phase === "done") return "ONE ROUND COMPLETE";
  return "ONE ROUND · ~12 SECONDS";
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.BreathingRound,
    phase: "tool",
    completedRound: false,
    isCorrect: true,
    ...extra,
  };
}
