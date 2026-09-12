import React, { useEffect, useRef } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, { FadeInDown, ReduceMotion } from "react-native-reanimated";
import { ArrowDown } from "lucide-react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

const ANIMATION = FadeInDown.duration(250).reduceMotion(ReduceMotion.System);

export function CommonTrapCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const phase = readString(saved?.phase) || "trap";

  const trapTitle = readString(content.trapTitle);
  const trapBody = readString(content.trapBody);
  const shortTermPayoff =
    readString(content.shortTermPayoff) || readString(content.relief);
  const hiddenCostRaw = content.hiddenCost ?? content.rebound;
  const hiddenCost =
    readStringArray(hiddenCostRaw).length > 0
      ? readStringArray(hiddenCostRaw)
      : readString(hiddenCostRaw)
        ? [readString(hiddenCostRaw)!]
        : [];

  const counterMoveObj = readRecord(content.counterMove);
  const counterMoveBodyRaw = counterMoveObj?.body ?? content.counterMove;
  const counterMoveBody =
    readStringArray(counterMoveBodyRaw).length > 0
      ? readStringArray(counterMoveBodyRaw)
      : readString(counterMoveBodyRaw)
        ? [readString(counterMoveBodyRaw)!]
        : [];

  useEffect(() => {
    if (!saved || !saved.phase) {
      onInteraction(
        { format: CourseExerciseCategoryEnum.CommonTrap, phase: "trap" },
        true,
      );
    } else {
      onInteraction(
        { format: CourseExerciseCategoryEnum.CommonTrap, phase },
        true,
      );
    }
  }, [saved?.phase, phase]);

  const isPayoffVisible = ["payoff", "cost", "complete"].includes(phase);
  const isCostVisible = ["cost", "complete"].includes(phase);
  const isComplete = phase === "complete";

  const handleNext = (nextPhase: string) => {
    onInteraction(
      { format: CourseExerciseCategoryEnum.CommonTrap, phase: nextPhase },
      true,
    );
  };

  return (
    <View className="flex-1 px-4 pt-2 pb-16">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Recognizing Common Traps"}
        instruction={
          readString(content.instruction) ??
          "See why the trap feels helpful — then learn the counter move."
        }
      />

      <View className="mt-4 flex-col">
        {/* Trap */}
        <Animated.View entering={ANIMATION} className="mb-10 items-start">
          <Text className="text-[11px] font-semibold tracking-wider text-forest-700/60 mb-2">
            THE TRAP
          </Text>
          {trapTitle && (
            <Text className="text-xl font-bold text-forest-900 mb-1">
              {trapTitle}
            </Text>
          )}
          {trapBody && (
            <Text className="text-base text-forest-800 leading-relaxed mb-4">
              {trapBody}
            </Text>
          )}

          {phase === "trap" && (
            <Pressable
              onPress={() => handleNext("payoff")}
              className="py-3 px-5 border border-sage-300 rounded-full bg-white active:bg-sage-50"
            >
              <Text className="text-forest-800 font-semibold text-sm">
                AND THEN WHAT HAPPENS?
              </Text>
            </Pressable>
          )}
        </Animated.View>

        {/* Payoff */}
        {isPayoffVisible && (
          <Animated.View entering={ANIMATION} className="mb-8 items-start">
            <Text className="text-[11px] font-semibold tracking-wider text-forest-700/60 mb-2">
              WHY IT FEELS SAFE
            </Text>
            {shortTermPayoff && (
              <Text className="text-base text-forest-800 leading-relaxed mb-4">
                {shortTermPayoff}
              </Text>
            )}

            {phase === "payoff" && (
              <Pressable
                onPress={() => handleNext("cost")}
                className="py-3 px-5 border border-sage-300 rounded-full bg-white active:bg-sage-50"
              >
                <Text className="text-forest-800 font-semibold text-sm">
                  SEE WHAT IT TURNS INTO
                </Text>
              </Pressable>
            )}
          </Animated.View>
        )}

        {/* Cost (Causal Chain) */}
        {isCostVisible && (
          <Animated.View entering={ANIMATION} className="mb-10 w-full flex-col">
            <ArrowDown
              size={20}
              color="#5f7f58"
              className="mb-6 opacity-60 self-center"
            />

            <Text className="text-[11px] font-semibold tracking-wider text-forest-700/60 mb-6 text-left">
              WHAT IT TURNS INTO
            </Text>

            <View className="items-center mb-6">
              {hiddenCost.map((cost, idx) => (
                <Animated.View
                  key={idx}
                  entering={FadeInDown.duration(200)
                    .delay(idx * 200)
                    .reduceMotion(ReduceMotion.System)}
                  className="items-center w-full"
                >
                  {idx > 0 && (
                    <ArrowDown
                      size={20}
                      color="#5f7f58"
                      className="my-3 opacity-60"
                    />
                  )}
                  <Text className="text-base font-medium text-forest-800 text-center leading-relaxed">
                    {cost}
                  </Text>
                </Animated.View>
              ))}
            </View>

            {phase === "cost" && (
              <Pressable
                onPress={() => handleNext("complete")}
                className="py-3 px-5 border border-sage-300 rounded-full bg-white active:bg-sage-50 self-start"
              >
                <Text className="text-forest-800 font-semibold text-sm">
                  WHAT CAN I DO INSTEAD?
                </Text>
              </Pressable>
            )}
          </Animated.View>
        )}

        {/* Counter */}
        {isComplete && (
          <Animated.View
            entering={ANIMATION}
            className="items-center w-full flex-col"
          >
            <ArrowDown size={20} color="#5f7f58" className="mb-6 opacity-60" />

            <View className="bg-[#f8fbf6] p-5 rounded-3xl w-full">
              <Text className="text-[11px] font-semibold tracking-wider text-forest-700/60 mb-2 text-left">
                TRY THIS INSTEAD
              </Text>
              <View className="gap-2">
                {counterMoveBody.map((move, idx) => (
                  <Text
                    key={idx}
                    className="text-base text-forest-800 leading-relaxed"
                  >
                    {move}
                  </Text>
                ))}
              </View>
            </View>
          </Animated.View>
        )}
      </View>
    </View>
  );
}
