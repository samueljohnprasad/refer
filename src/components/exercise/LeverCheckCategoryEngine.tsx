import React, { useEffect } from "react";
import { Pressable, Text, View, AccessibilityInfo } from "react-native";
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readNumber,
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

interface Lever {
  id: string;
  label: string;
  remainingPercent: number; // Ignored for UI, but kept for parsing
  explanation: string;
  tone: "orange" | "olive";
}

export function LeverCheckCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const levers = readLevers(content.levers);
  const pulledLeverIds = readStringArray(saved?.pulledLeverIds);
  const reduceMotion = useReducedMotion();
  
  const totalCount = levers.length > 0 ? levers.length : 2;
  const pulledCount = pulledLeverIds.length;
  const allPulled = levers.length > 0 && pulledCount >= levers.length;

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  const pullLever = (lever: Lever) => {
    if (pulledLeverIds.includes(lever.id)) return;
    const nextIds = [...pulledLeverIds, lever.id];
    
    // Accessibility announcement
    const direction = lever.tone === "olive" ? "lower" : "higher";
    AccessibilityInfo.announceForAccessibility(`${lever.label} shifted alertness ${direction}. ${lever.explanation}`);

    onInteraction(
      createResponse({ ...saved, pulledLeverIds: nextIds }),
      nextIds.length >= levers.length
    );
  };

  return (
    <View className="flex-1 px-5 pt-2 pb-8">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Identify the Levers"}
        instruction={readString(content.instruction) ?? "Pull each lever to see which way it shifts alertness."}
      />

      {/* Scale Indicator */}
      <View className="mb-6 mt-2">
        <Text className="text-[11px] font-semibold tracking-widest text-ink-muted uppercase text-center mb-1.5">
          Alertness
        </Text>
        <View className="flex-row justify-between items-center">
          <Text className="text-[11px] font-medium text-ink-soft">LOW</Text>
          <View className="flex-1 h-[1px] bg-sage-200 mx-2" />
          <Text className="text-[11px] font-medium text-ink-soft">HIGH</Text>
        </View>
      </View>

      {/* Levers List */}
      <View className="gap-6">
        {levers.map((lever) => (
          <LeverRow
            key={lever.id}
            lever={lever}
            pulled={pulledLeverIds.includes(lever.id)}
            onPress={() => pullLever(lever)}
            reduceMotion={reduceMotion}
          />
        ))}
      </View>

      {/* Progress or Completion */}
      {allPulled ? (
        <Animated.View 
          entering={reduceMotion ? undefined : FadeIn.duration(400)}
          className="mt-8 rounded-[20px] bg-sage-50 border border-sage-100 px-5 py-5"
        >
          <Text className="text-[12px] font-bold tracking-widest text-sage-600 mb-2 uppercase">
            {readString(content.rule) ?? "The Idea"}
          </Text>
          <Text className="text-[15px] leading-[22px] text-ink">
            {readString(content.takeaway)}
          </Text>
          {content.note ? (
            <Text className="text-[14px] leading-[20px] text-ink-soft mt-3">
              {readString(content.note)}
            </Text>
          ) : null}
        </Animated.View>
      ) : pulledCount > 0 ? (
        <Animated.View entering={FadeIn}>
          <Text className="text-center text-ink-muted text-[13.5px] mt-6">
            {pulledCount} of {totalCount} explored
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

function LeverRow({
  lever,
  pulled,
  onPress,
  reduceMotion,
}: {
  lever: Lever;
  pulled: boolean;
  onPress: () => void;
  reduceMotion: boolean;
}) {
  const isOlive = lever.tone === "olive";
  const position = useSharedValue(50); // Start at 50% center

  useEffect(() => {
    if (pulled) {
      // Shift left (20%) for olive/down, shift right (80%) for orange/up
      const target = isOlive ? 20 : 80;
      position.value = reduceMotion ? target : withTiming(target, { duration: 350 });
    } else {
      position.value = 50;
    }
  }, [pulled, isOlive, reduceMotion, position]);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      left: `${position.value}%`,
      marginLeft: -10, // Half of w-5 (20px) to truly center it
    };
  });

  return (
    <View>
      <Text className="text-ink font-semibold text-[15px] mb-2.5">
        {lever.label}
      </Text>
      
      {/* Track */}
      <View className="h-3 rounded-full bg-sage-200 w-full justify-center relative">
        {/* Center notch */}
        <View className="absolute left-1/2 w-0.5 h-full bg-sage-300" style={{ transform: [{ translateX: -1 }] }} />
        
        {/* Thumb */}
        <Animated.View
          className={`absolute h-5 w-5 rounded-full shadow-sm border ${
            !pulled 
              ? "bg-cream-100 border-sage-300" 
              : isOlive 
                ? "bg-sage-600 border-sage-700" 
                : "bg-[#FF9600] border-[#E58133]" // Orange
          }`}
          style={indicatorStyle}
        />
      </View>

      {/* Interaction / Explanation */}
      {pulled ? (
        <Animated.View entering={reduceMotion ? undefined : FadeIn.delay(100).duration(300)}>
          <Text className="text-ink-soft text-[14px] leading-[20px] mt-3">
            {lever.explanation}
          </Text>
        </Animated.View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${lever.label}. Try this lever.`}
          onPress={onPress}
          className="mt-3.5 bg-transparent border border-sage-300 py-2.5 rounded-full items-center active:bg-sage-100/50"
        >
          <Text className="text-ink text-[14.5px] font-medium tracking-wide">
            Try this lever
          </Text>
        </Pressable>
      )}
    </View>
  );
}

function readLevers(value: unknown): Lever[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    const lever = readRecord(item);
    const id = readString(lever?.id);
    const label = readString(lever?.label);
    const remainingPercent = readNumber(lever?.remainingPercent) ?? 50;
    const explanation = readString(lever?.explanation);
    if (!id || !label || !explanation) return [];
    return [
      {
        id,
        label,
        remainingPercent,
        explanation,
        tone: lever?.tone === "olive" ? "olive" : "orange",
      },
    ];
  });
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.LeverCheck,
    phase: "lever",
    pulledLeverIds: [],
    isCorrect: true,
    ...extra,
  };
}
