import React, { useState, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeOut, FadeInUp, FadeOutDown, LinearTransition } from "react-native-reanimated";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { InteractiveReframeStagger } from "./InteractiveReframeStagger";

export function InteractiveReframeCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const [step, setStep] = useState(0);
  const [selectedPath, setSelectedPath] = useState<'correct' | 'wrong' | null>(null);
  const [cascadeDone, setCascadeDone] = useState(false);

  useEffect(() => {
    if (!savedResponse) {
      onInteraction(
        { format: CourseExerciseCategoryEnum.InteractiveReframe, phase: "interaction", step: 0 },
        false
      );
    }
  }, []);

  const handleChoice = (path: 'correct' | 'wrong') => {
    if (step > 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedPath(path);
    setStep(1);
    setCascadeDone(false);
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep(0);
    setSelectedPath(null);
    setCascadeDone(false);
  };

  useEffect(() => {
    if (cascadeDone && selectedPath === 'correct') {
      // Automatically transition to final state after correct cascade finishes
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setStep(2);
        onInteraction(
          { format: CourseExerciseCategoryEnum.InteractiveReframe, phase: "complete", step: 2, isCorrect: true },
          true
        );
      }, 800);
    }
  }, [cascadeDone, selectedPath]);

  return (
    <View className="px-4 pb-16 pt-0">
      <CourseExerciseHeading title="After a hard night..." />

      <Animated.View layout={LinearTransition} className="mt-8 items-center w-full">
        {/* The Evolving Hero Box */}
        <Animated.View layout={LinearTransition} className="w-full">
          <View 
            className={`w-full p-8 rounded-3xl border-2 items-center justify-center ${
              step === 0 || selectedPath === 'wrong'
                ? "border-[#EBDDC5] bg-[#FDF9F5]" 
                : "border-[#29452A] bg-[#E1EAD9]"
            }`}
          >
            {step < 2 ? (
              <Animated.Text key="broken" entering={FadeIn} exiting={FadeOut} layout={LinearTransition} className="happy-font-heading-bold text-[24px] text-center text-[#A74141]">
                “My body is broken.”
              </Animated.Text>
            ) : (
              <Animated.Text key="shifted" entering={FadeIn} exiting={FadeOut} layout={LinearTransition} className="happy-font-heading-bold text-[24px] text-center text-[#29452A]">
                “Something may have shifted.”
              </Animated.Text>
            )}

            {/* Cascade inside the box */}
            {step >= 1 && selectedPath && (
              <InteractiveReframeStagger 
                path={selectedPath} 
                onComplete={() => setCascadeDone(true)} 
              />
            )}
          </View>
        </Animated.View>

        {/* Step 0: The Choices */}
        {step === 0 && (
          <Animated.View entering={FadeInUp} exiting={FadeOutDown} className="items-center mt-8 w-full">
            <Text className="happy-font-body-bold text-[12px] tracking-[1px] text-[#82796A] uppercase mb-4 text-center">
              What should you investigate first?
            </Text>
            
            <Pressable
              disabled={step > 0}
              onPress={() => handleChoice('correct')}
              className="w-full min-h-[56px] items-center justify-center rounded-[28px] bg-white border border-[#EBDDC5] mb-3 active:bg-[#F8F1E7]"
            >
              <Text className="happy-font-body-bold text-[15px] text-[#3F3A34] text-center">
                What might have shifted
              </Text>
            </Pressable>

            <Pressable
              disabled={step > 0}
              onPress={() => handleChoice('wrong')}
              className="w-full min-h-[56px] items-center justify-center rounded-[28px] bg-white border border-[#EBDDC5] active:bg-[#F8F1E7]"
            >
              <Text className="happy-font-body-bold text-[15px] text-[#3F3A34] text-center">
                Whether I need to try harder
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
                Whether I need to try harder
              </Text>
            </View>

            {cascadeDone && (
              <Animated.View entering={FadeInUp} className="w-full">
                <Pressable
                  accessibilityRole="button"
                  onPress={handleReset}
                  className="w-full min-h-[56px] items-center justify-center rounded-[28px] bg-[#3F3A34] active:opacity-80"
                >
                  <Text className="happy-font-heading-bold text-[15px] text-white uppercase tracking-[1px]">
                    Try Another Reading
                  </Text>
                </Pressable>
              </Animated.View>
            )}
          </Animated.View>
        )}

        {/* Correct Path UI */}
        {step >= 1 && selectedPath === 'correct' && (
          <Animated.View entering={FadeInUp} exiting={FadeOutDown} className="items-center mt-8 w-full">
            <View className="w-full min-h-[56px] items-center justify-center rounded-[28px] bg-[#E1EAD9] border-2 border-[#29452A] mb-8 relative">
              <View className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#29452A] px-2 py-0.5 rounded-full flex-row items-center">
                <Text className="happy-font-body-bold text-[10px] text-white tracking-[0.5px]">✓ CORRECT</Text>
              </View>
              <Text className="happy-font-body-bold text-[15px] text-[#29452A] text-center mt-1">
                What might have shifted
              </Text>
            </View>

            {step === 2 && (
              <Animated.View entering={FadeInUp} className="w-full mt-2">
                <View className="bg-[#D3E0CD] px-4 py-2 rounded-full mb-8 self-center">
                  <Text className="happy-font-body-bold text-[11px] tracking-[1px] text-[#29452A] uppercase text-center">
                    ✓ Same night. Different story.
                  </Text>
                </View>

                <View className="w-full bg-[#FDF9F5] p-5 rounded-2xl border border-[#EBDDC5]">
                  <Text className="happy-font-body-bold text-[11px] tracking-[1px] text-[#82796A] uppercase mb-2">
                    Remember This
                  </Text>
                  <Text className="happy-font-body text-[15px] leading-[22px] text-[#3F3A34]">
                    A rough night is information, not a verdict about you.{"\n\n"}Something in the system may have shifted.
                  </Text>
                </View>
              </Animated.View>
            )}
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}
