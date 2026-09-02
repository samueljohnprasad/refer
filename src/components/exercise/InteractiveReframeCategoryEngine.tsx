import React, { useState, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeOut, FadeInUp, FadeOutDown, LinearTransition } from "react-native-reanimated";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { InteractiveReframeStagger } from "./InteractiveReframeStagger";
import { readRecord } from "@/src/components/exercise/courseExerciseContent";

export function InteractiveReframeCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const [step, setStep] = useState(0);
  const [selectedPath, setSelectedPath] = useState<'correct' | 'wrong' | null>(null);
  const [cascadeDone, setCascadeDone] = useState(false);
  const saved = readRecord(savedResponse);

  useEffect(() => {
    if (!saved) {
      onInteraction(
        { format: CourseExerciseCategoryEnum.InteractiveReframe, phase: "interaction", step: 0 },
        false
      );
    } else if (saved.step === 0 && step !== 0) {
      // The footer requested a reset
      setStep(0);
      setSelectedPath(null);
      setCascadeDone(false);
    }
  }, [saved, onInteraction, step]);

  const handleChoice = (path: 'correct' | 'wrong') => {
    if (step > 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedPath(path);
    setStep(1);
    setCascadeDone(false);
    
    // Notify the engine that we made a choice, but lock the footer while the cascade animates
    onInteraction(
      { 
        format: CourseExerciseCategoryEnum.InteractiveReframe, 
        phase: "interaction", 
        step: 1,
        isWrong: path === 'wrong',
      },
      false
    );
  };

  useEffect(() => {
    if (cascadeDone) {
      if (selectedPath === 'correct') {
        // Automatically transition to final state after correct cascade finishes
        setTimeout(() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setStep(2);
          onInteraction(
            { format: CourseExerciseCategoryEnum.InteractiveReframe, phase: "complete", step: 2, isCorrect: true, isWrong: false },
            true
          );
        }, 800);
      } else if (selectedPath === 'wrong') {
        // Unlock the footer so the user can click "Try another reading"
        onInteraction(
          { format: CourseExerciseCategoryEnum.InteractiveReframe, phase: "interaction", step: 1, isWrong: true },
          true
        );
      }
    }
  }, [cascadeDone, selectedPath]);

  const title = exercise.content?.title || "After a hard night...";
  const heroWrongText = exercise.content?.heroWrongText || "“My body is broken.”";
  const question = exercise.content?.question || "What should you look at first?";
  const correctOption = exercise.content?.correctOption || "What might have changed";
  const wrongOption = exercise.content?.wrongOption || "Whether I need to try harder";
  const wrongPathTitle = exercise.content?.wrongPathTitle || "Whether I need to try harder";
  const correctFinale = exercise.content?.correctFinale || "Same night.\nDifferent story.";

  return (
    <View className="px-4 pb-16 pt-0">
      <CourseExerciseHeading title={title} />

      <Animated.View layout={LinearTransition} className="mt-8 items-center w-full">
        {/* The Evolving Hero Box */}
        <Animated.View layout={LinearTransition} className="w-full">
          <View 
            className={`w-full p-8 rounded-3xl border-2 items-center justify-center ${
              step === 0 || selectedPath === 'wrong'
                ? "border-[#EBDDC5] bg-[#FDF9F5]" 
                : "border-[#29452A] bg-[#E1EAD9]"
            }`}
            style={selectedPath === 'correct' ? { paddingBottom: 24, paddingTop: 24 } : {}}
          >
            {selectedPath !== 'correct' ? (
              <Animated.Text key="broken" entering={FadeIn} exiting={FadeOut} layout={LinearTransition} className="happy-font-heading-bold text-[24px] text-center text-[#A74141]">
                {heroWrongText}
              </Animated.Text>
            ) : null}

            {/* Cascade inside the box */}
            {step >= 1 && selectedPath && (
              <InteractiveReframeStagger 
                path={selectedPath} 
                onComplete={() => setCascadeDone(true)}
                content={exercise.content}
              />
            )}
          </View>
        </Animated.View>

        {/* Step 0: The Choices */}
        {step === 0 && (
          <Animated.View entering={FadeInUp} exiting={FadeOutDown} className="items-center mt-8 w-full">
            <Text className="happy-font-body-bold text-[12px] tracking-[1px] text-[#82796A] uppercase mb-4 text-center">
              {question}
            </Text>
            
            <Pressable
              disabled={step > 0}
              onPress={() => handleChoice('correct')}
              className="w-full min-h-[56px] items-center justify-center rounded-[28px] bg-white border border-[#EBDDC5] mb-3 active:bg-[#F8F1E7]"
            >
              <Text className="happy-font-body-bold text-[15px] text-[#3F3A34] text-center">
                {correctOption}
              </Text>
            </Pressable>

            <Pressable
              disabled={step > 0}
              onPress={() => handleChoice('wrong')}
              className="w-full min-h-[56px] items-center justify-center rounded-[28px] bg-white border border-[#EBDDC5] active:bg-[#F8F1E7]"
            >
              <Text className="happy-font-body-bold text-[15px] text-[#3F3A34] text-center">
                {wrongOption}
              </Text>
            </Pressable>
          </Animated.View>
        )}

        {/* Wrong Path UI */}
        {step >= 1 && selectedPath === 'wrong' && (
          <Animated.View entering={FadeInUp} exiting={FadeOutDown} className="items-center mt-8 w-full">
            <View className="w-full min-h-[56px] items-center justify-center rounded-[28px] bg-[#FDF9F5] border-2 border-[#A74141] mb-8 relative">
              <View className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#A74141] px-2 py-0.5 rounded-full flex-row items-center">
                <Text className="happy-font-body-bold text-[10px] text-white tracking-[0.5px]">× YOUR ANSWER</Text>
              </View>
              <Text className="happy-font-body-bold text-[15px] text-[#A74141] text-center mt-1">
                {wrongPathTitle}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Correct Path UI */}
        {step === 2 && selectedPath === 'correct' && (
          <Animated.View entering={FadeInUp} className="w-full mt-10 items-center">
            <Text className="happy-font-heading-bold text-[20px] tracking-[1px] text-[#29452A] uppercase text-center">
              {correctFinale}
            </Text>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}
