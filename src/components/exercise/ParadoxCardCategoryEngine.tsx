import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { useAnimatedStyle, withTiming, Easing, FadeInUp, LinearTransition, FadeOutDown } from "react-native-reanimated";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { readNumber, readRecord } from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { ParadoxStagger } from "./ParadoxStagger";
import { ParadoxTakeawayStagger } from "./ParadoxTakeawayStagger";

const STARTING_ALARM = 25;
const PUSHED_ALARM = 75;
const STOPPED_ALARM = 50;

export function ParadoxCardCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const saved = readRecord(savedResponse);
  const alarm = readNumber(saved?.alarm) ?? STARTING_ALARM;
  const pushCount = readNumber(saved?.pushCount) ?? 0;
  const revealed = saved?.revealed === true;
  
  // Track if stagger has finished revealing the STOP PUSHING button
  const [showStopAction, setShowStopAction] = useState(false);
  // Track if takeaway has finished revealing everything to enable continue
  const [takeawayDone, setTakeawayDone] = useState(false);
  
  useEffect(() => {
    if (!saved) {
      onInteraction(createResponse(), false);
    }
  }, [onInteraction, saved]);

  useEffect(() => {
    if (takeawayDone && !locked) {
      onInteraction(
        createResponse({
          ...saved,
          revealed: true,
        }),
        true // Unlocks "Continue"
      );
    }
  }, [takeawayDone]);

  const pushHarder = () => {
    if (locked || revealed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onInteraction(
      createResponse({
        ...saved,
        alarm: PUSHED_ALARM,
        pushCount: pushCount + 1,
      }),
      false,
    );
  };

  const stopPushing = () => {
    if (locked || revealed) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onInteraction(
      createResponse({
        ...saved,
        alarm: STOPPED_ALARM,
        pushCount,
        revealed: true,
      }),
      false, // We don't unlock Continue until takeaway is done!
    );
  };

  const alarmStyle = useAnimatedStyle(() => {
    return {
      left: withTiming(`${alarm}%`, { duration: 600, easing: Easing.out(Easing.quad) }),
    };
  }, [alarm]);

  return (
    <View className="px-2 pb-16 pt-0">
      <CourseExerciseHeading
        title="Try harder to sleep"
      />

      <Animated.View layout={LinearTransition}>
        <View className="mt-4 px-2">
          <Text className="happy-font-body text-[16px] text-[#3F3A34] mb-4">
            It's 2:17am.{"\n"}You've been awake for a while.
          </Text>
        </View>

        <View className="mt-6 mb-8 px-2">
          <Text className="happy-font-body-bold text-[11px] tracking-[1px] text-[#82796A] uppercase mb-3 text-center">
            The Alarm
          </Text>
          <View className="flex-row justify-between items-center w-full relative">
            <Text className="happy-font-body-bold text-[11px] text-[#82796A] uppercase z-10 bg-[#FDF9F5] pr-3">Calm</Text>
            
            <View className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#EBDDC5]" />
            
            <Animated.View 
              style={[
                { position: 'absolute', top: '50%', width: 14, height: 14, borderRadius: 7, backgroundColor: '#A74141', transform: [{ translateY: -7 }, { translateX: -7 }] },
                alarmStyle
              ]} 
            />

            <Text className="happy-font-body-bold text-[11px] text-[#A74141] uppercase z-10 bg-[#FDF9F5] pl-3">Wired</Text>
          </View>
        </View>

        {pushCount === 0 && !revealed && (
          <Animated.View entering={FadeInUp} exiting={FadeOutDown} layout={LinearTransition} className="mt-6">
            <Text className="happy-font-body-bold text-[13px] text-[#82796A] mb-3 text-center uppercase tracking-[0.5px]">
              What happens if you push harder?
            </Text>
            <Pressable
              accessibilityRole="button"
              disabled={locked}
              onPress={pushHarder}
              className="w-full min-h-[56px] items-center justify-center rounded-[28px] bg-[#3F3A34] active:opacity-80"
            >
              <Text className="happy-font-heading-bold text-[15px] text-white uppercase tracking-[1px]">
                Try harder to sleep
              </Text>
            </Pressable>
          </Animated.View>
        )}

        {pushCount > 0 && (
          <Animated.View layout={LinearTransition}>
            {!revealed && <ParadoxStagger onComplete={() => setShowStopAction(true)} />}

            {showStopAction && !revealed && (
              <Animated.View entering={FadeInUp} layout={LinearTransition} className="items-center mt-8">
                <Text className="happy-font-body-bold text-[13px] tracking-[1px] text-[#82796A] uppercase mb-3">
                  Try the opposite
                </Text>
                <Pressable
                  accessibilityRole="button"
                  disabled={locked}
                  onPress={stopPushing}
                  className="w-full min-h-[56px] items-center justify-center rounded-[28px] bg-[#D3E0CD] active:opacity-80"
                >
                  <Text className="happy-font-heading-bold text-[15px] text-[#29452A] uppercase tracking-[1px]">
                    Stop pushing
                  </Text>
                </Pressable>
              </Animated.View>
            )}

            {revealed && (
              <ParadoxTakeawayStagger onComplete={() => setTakeawayDone(true)} />
            )}
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.ParadoxCard,
    phase: "paradox",
    alarm: STARTING_ALARM,
    pushCount: 0,
    revealed: false,
    isCorrect: true,
    ...extra,
  };
}
