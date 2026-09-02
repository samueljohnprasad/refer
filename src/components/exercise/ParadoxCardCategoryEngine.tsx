import React, { useEffect, useState } from "react";
import { Text, View, AccessibilityInfo } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { useAnimatedStyle, withTiming, Easing, FadeInUp, LinearTransition, FadeOutDown, useReducedMotion } from "react-native-reanimated";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { readRecord } from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function ParadoxCardCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const saved = readRecord(savedResponse);
  const stage = (saved?.stage as string) || "ready";
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!saved) {
      onInteraction(
        {
          format: CourseExerciseCategoryEnum.ParadoxCard,
          phase: "paradox",
          stage: "ready",
          isCorrect: true,
        },
        false
      );
    }
  }, [onInteraction, saved]);

  const alarmValue = stage === "ready" ? 25 : 75;

  const alarmStyle = useAnimatedStyle(() => {
    return {
      left: withTiming(`${alarmValue}%`, {
        duration: reducedMotion ? 0 : 600,
        easing: Easing.out(Easing.quad),
      }),
    };
  }, [alarmValue, reducedMotion]);

  useEffect(() => {
    if (stage === "result") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      AccessibilityInfo.announceForAccessibility("Body alertness increased toward wired");
    } else if (stage === "explanation") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      AccessibilityInfo.announceForAccessibility("Explanation revealed");
    }
  }, [stage]);

  const title = exercise.content?.title || "Try harder to sleep";
  const expectationHeading = exercise.content?.expectationHeading || "Expectation";
  const expectationText = exercise.content?.expectationText || "More effort → sleep faster";
  const resultHeading = exercise.content?.resultHeading || "What happened";
  const resultText = exercise.content?.resultText || "More effort → more alertness";
  const gaugeHeading = exercise.content?.gaugeHeading || "Body alertness";
  const gaugeLeftLabel = exercise.content?.gaugeLeftLabel || "Calm";
  const gaugeRightLabel = exercise.content?.gaugeRightLabel || "Wired";
  const explanationHeading = exercise.content?.explanationHeading || "Why this happens";
  const explanationText = exercise.content?.explanationText || "Sleep is an involuntary process. The more you try to force it, the more your brain treats being awake as a threat, which triggers your fight-or-flight response and keeps you awake.";

  return (
    <View className="px-4 pb-16 pt-0">
      <CourseExerciseHeading title={title} />

      <Animated.View layout={LinearTransition} className="mt-8 items-center w-full">
        <View 
          className="w-full p-6 rounded-3xl border-2 border-[#EBDDC5] bg-[#FDF9F5] items-center justify-center mb-6"
        >
          {stage === "ready" ? (
            <Animated.View key="ready-expectation" entering={FadeInUp} exiting={FadeOutDown} layout={LinearTransition} className="items-center">
              <Text className="happy-font-body-bold text-[12px] tracking-[1px] text-[#82796A] uppercase mb-2 text-center">
                {expectationHeading}
              </Text>
              <Text className="happy-font-heading-bold text-[18px] text-center text-[#3F3A34]">
                {expectationText}
              </Text>
            </Animated.View>
          ) : (
            <Animated.View key="result-expectation" entering={FadeInUp} layout={LinearTransition} className="items-center">
              <Text className="happy-font-body-bold text-[12px] tracking-[1px] text-[#A74141] uppercase mb-2 text-center">
                {resultHeading}
              </Text>
              <Text className="happy-font-heading-bold text-[18px] text-center text-[#A74141]">
                {resultText}
              </Text>
            </Animated.View>
          )}
        </View>

        <Animated.View layout={LinearTransition} className="w-full mb-8 px-2">
          <Text className="happy-font-body-bold text-[11px] tracking-[1px] text-[#82796A] uppercase mb-3 text-center" accessibilityRole="header">
            {gaugeHeading}
          </Text>
          <View className="flex-row justify-between items-center w-full relative" accessible={true} accessibilityLabel={`${gaugeHeading} is ${stage === 'ready' ? `near ${gaugeLeftLabel}` : `near ${gaugeRightLabel}`}`}>
            <Text className="happy-font-body-bold text-[11px] text-[#82796A] uppercase z-10 bg-[#FAF7F2] pr-3">{gaugeLeftLabel}</Text>
            
            <View className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#EBDDC5]" />
            
            <Animated.View 
              style={[
                { position: 'absolute', top: '50%', width: 16, height: 16, borderRadius: 8, backgroundColor: '#A74141', transform: [{ translateY: -8 }, { translateX: -8 }] },
                alarmStyle
              ]} 
            />

            <Text className="happy-font-body-bold text-[11px] text-[#A74141] uppercase z-10 bg-[#FAF7F2] pl-3">{gaugeRightLabel}</Text>
          </View>
        </Animated.View>

        {stage === "explanation" && (
          <Animated.View entering={FadeInUp} layout={LinearTransition} className="w-full mt-2 p-6 rounded-3xl bg-[#D3E0CD]">
            <Text className="happy-font-heading-bold text-[16px] tracking-[1px] text-[#29452A] uppercase mb-3">
              {explanationHeading}
            </Text>
            <Text className="happy-font-body text-[16px] leading-[24px] text-[#29452A]">
              {explanationText}
            </Text>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}
