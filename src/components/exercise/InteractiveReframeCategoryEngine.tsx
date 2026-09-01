import React, { useState, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeOut, FadeInUp, FadeOutDown, LinearTransition } from "react-native-reanimated";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";

export function InteractiveReframeCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!savedResponse) {
      onInteraction(
        { format: CourseExerciseCategoryEnum.InteractiveReframe, phase: "interaction", step: 0 },
        false
      );
    }
  }, []);

  const handleTapThought = () => {
    if (step > 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep(1);
  };

  const handleReframe = () => {
    if (step > 1) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep(2);
  };

  const handleFollowReading = () => {
    if (step > 2) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setStep(3);
    onInteraction(
      { format: CourseExerciseCategoryEnum.InteractiveReframe, phase: "complete", step: 3, isCorrect: true },
      true
    );
  };

  return (
    <View className="px-4 pb-16 pt-0">
      <CourseExerciseHeading title="After a hard night..." />

      <Animated.View layout={LinearTransition} className="mt-8 items-center w-full">
        {/* The Evolving Hero Box */}
        <Pressable 
          disabled={step > 0} 
          onPress={handleTapThought}
          className={`w-full p-8 rounded-3xl border-2 items-center justify-center ${step === 0 ? "border-[#A74141] bg-[#FDF9F5]" : step === 1 ? "border-[#A74141] bg-[#F8F1E7]" : "border-[#29452A] bg-[#E1EAD9]"}`}
        >
          {step < 2 ? (
            <Animated.Text key="broken" entering={FadeIn} exiting={FadeOut} className="happy-font-heading-bold text-[24px] text-center text-[#A74141]">
              “My body is broken.”
            </Animated.Text>
          ) : (
            <Animated.Text key="shifted" entering={FadeIn} exiting={FadeOut} className="happy-font-heading-bold text-[24px] text-center text-[#29452A]">
              “A sleep lever may have shifted.”
            </Animated.Text>
          )}
        </Pressable>

        {/* Step 0: The CTA underneath the box */}
        {step === 0 && (
          <Animated.View entering={FadeInUp} exiting={FadeOutDown} className="items-center mt-6">
            <Text className="happy-font-body-bold text-[11px] tracking-[1px] text-[#82796A] uppercase">
              What is this thought doing?
            </Text>
            <Text className="happy-font-body-bold text-[10px] tracking-[1px] text-[#A74141] uppercase text-center mt-2">
              (Tap the thought)
            </Text>
          </Animated.View>
        )}

        {/* Step 1: Implication Cascade */}
        {step === 1 && (
          <Animated.View entering={FadeInUp} layout={LinearTransition} className="items-center mt-6 w-full">
            <Text className="happy-font-body text-[16px] text-[#A74141] mb-2">↓</Text>
            <Text className="happy-font-body text-[18px] text-[#A74141] mb-2">“Something is wrong with me.”</Text>
            <Text className="happy-font-body text-[16px] text-[#A74141] mb-2">↓</Text>
            <Text className="happy-font-body text-[18px] text-[#A74141] mb-6">“I need to FIX this.”</Text>
            
            <View className="bg-[#F8F1E7] p-4 rounded-2xl w-full mb-8">
              <Text className="happy-font-heading-bold text-[13px] tracking-[1px] text-[#A74141] mb-2 uppercase text-center">
                The Result
              </Text>
              <Text className="happy-font-body text-[15px] leading-[22px] text-[#3F3A34] text-center">
                This reading turns a bad night into a verdict about you.
              </Text>
            </View>

            <Text className="happy-font-body-bold text-[11px] tracking-[1px] text-[#82796A] uppercase mb-4">
              Can we read the same night differently?
            </Text>

            <Pressable
              accessibilityRole="button"
              onPress={handleReframe}
              className="w-full min-h-[56px] items-center justify-center rounded-[28px] bg-[#3F3A34] active:opacity-80"
            >
              <Text className="happy-font-heading-bold text-[15px] text-white uppercase tracking-[1px]">
                Reframe It
              </Text>
            </Pressable>
          </Animated.View>
        )}
        
        {/* Step 2: Notice what changed */}
        {step === 2 && (
          <Animated.View entering={FadeInUp} layout={LinearTransition} className="items-center mt-8 w-full">
            <Text className="happy-font-body-bold text-[11px] tracking-[1px] text-[#82796A] uppercase mb-4 text-center">
              Notice what changed
            </Text>
            
            <View className="flex-row w-full justify-between mb-8">
              <View className="flex-1 mr-2 bg-[#F8F1E7] p-4 rounded-2xl">
                <Text className="happy-font-body-bold text-[11px] tracking-[0.5px] text-[#A74141] uppercase mb-2">
                  Broken
                </Text>
                <Text className="happy-font-body text-[14px] leading-[20px] text-[#3F3A34]">
                  → sounds permanent
                </Text>
              </View>
              <View className="flex-1 ml-2 bg-[#E1EAD9] p-4 rounded-2xl">
                <Text className="happy-font-body-bold text-[11px] tracking-[0.5px] text-[#29452A] uppercase mb-2">
                  Shifted
                </Text>
                <Text className="happy-font-body text-[14px] leading-[20px] text-[#3F3A34]">
                  → sounds changeable
                </Text>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={handleFollowReading}
              className="w-full min-h-[56px] items-center justify-center rounded-[28px] bg-[#3F3A34] active:opacity-80"
            >
              <Text className="happy-font-heading-bold text-[15px] text-white uppercase tracking-[1px]">
                Follow the new reading
              </Text>
            </Pressable>
          </Animated.View>
        )}

        {/* Step 3: Consequence and Insight */}
        {step === 3 && (
          <Animated.View entering={FadeInUp} layout={LinearTransition} className="items-center mt-6 w-full">
            <Text className="happy-font-body text-[16px] text-[#29452A] mb-2">↓</Text>
            <Text className="happy-font-body text-[18px] text-[#29452A] mb-2">“What changed?”</Text>
            <Text className="happy-font-body text-[16px] text-[#29452A] mb-2">↓</Text>
            <Text className="happy-font-body text-[16px] text-[#29452A] text-center mb-2 leading-[24px]">
              nap?{"\n"}timing?{"\n"}stress?{"\n"}light?{"\n"}routine?
            </Text>
            <Text className="happy-font-body text-[16px] text-[#29452A] mb-2">↓</Text>
            <Text className="happy-font-body text-[18px] text-[#29452A] mb-8">something I can investigate</Text>

            <View className="bg-[#D3E0CD] px-4 py-2 rounded-full mb-8">
              <Text className="happy-font-body-bold text-[11px] tracking-[1px] text-[#29452A] uppercase">
                ✓ Same night. Different reading.
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
    </View>
  );
}
