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

  useEffect(() => {
    if (saved?.running && phase === "idle") {
      startRound();
    }
  }, [saved?.running, phase]);

  const startRound = () => {
    if (running) return;
    clearRoundTimers();

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
    onInteraction(createResponse({ ...saved, completedRound: true, running: false }), true);
  };

  function clearRoundTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  return (
    <View className="px-2 pb-3 pt-6">
      <CourseExerciseHeading
        title={readString(content.title) ?? "One longer exhale"}
        instruction={readString(content.instruction) ?? "One gentle round to ease alertness."}
      />

      <View className="mt-2 items-center">
        <Text className="happy-font-body-semibold text-[18px] text-[#201E1D]">
          {INHALE_SECONDS} in → {EXHALE_SECONDS} out
        </Text>
        <Text className="happy-font-body mt-1 text-[14px] text-[#82796A]">
          1 round · about {ROUND_SECONDS} sec
        </Text>
      </View>

      <View className="mt-8 items-center gap-6">
        <View className="h-[140px] items-center justify-center">
          <Animated.View
            accessibilityLabel={getPhaseLabel(phase)}
            className="h-[130px] w-[130px] items-center justify-center rounded-full bg-[#ABC0A2] shadow-sm shadow-black/5"
            style={circleStyle}
          >
            <Text className="happy-font-heading-bold text-[36px] text-white">
              {phase === "done" ? "✓" : (count ?? "")}
            </Text>
          </Animated.View>
        </View>
        <Text className="happy-font-body-bold min-h-[20px] text-center text-[13px] tracking-[0.5px] text-[#29452A]">
          {getPhaseLabel(phase)}
        </Text>
      </View>

      <Text className="happy-font-body mt-6 text-center text-[14px] leading-[20px] text-[#82796A]">
        {phase === "done"
          ? (readString(content.variation) ?? "The goal is less struggling, not instant sleep.")
          : "Breathe comfortably. Stop if uncomfortable."}
      </Text>
    </View>
  );
}

function getPhaseLabel(phase: BreathPhase): string {
  if (phase === "inhale") return "BREATHE IN";
  if (phase === "exhale") return "BREATHE OUT SLOWLY";
  if (phase === "done") return "ROUND COMPLETE";
  return "";
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
