import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown, ReduceMotion } from "react-native-reanimated";
import { ArrowDown } from "lucide-react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { CourseExerciseOptionButton } from "@/src/components/exercise/CourseExerciseOptionButton";
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

  const [trapSelectionId, setTrapSelectionId] = useState<string | null>(null);
  const [counterSelectionId, setCounterSelectionId] = useState<string | null>(
    null,
  );

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

  const predictionObj = readRecord(content.prediction);
  const predictionQuestion = readString(predictionObj?.question);
  const predictionOptions = Array.isArray(predictionObj?.options)
    ? predictionObj.options
    : [];

  const counterQuestionObj = readRecord(content.counterMoveQuestion);
  const counterQuestion = readString(counterQuestionObj?.question);
  const counterOptions = Array.isArray(counterQuestionObj?.options)
    ? counterQuestionObj.options
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

  const isPayoffVisible = ["payoff", "complete"].includes(phase);
  const isComplete = phase === "complete";

  const handleTrapSelect = (option: any) => {
    setTrapSelectionId(option.id);
    if (option.isCorrect) {
      setTimeout(() => {
        onInteraction(
          { format: CourseExerciseCategoryEnum.CommonTrap, phase: "payoff" },
          true,
        );
      }, 600);
    }
  };

  const handleCounterSelect = (option: any) => {
    setCounterSelectionId(option.id);
    if (option.isCorrect) {
      setTimeout(() => {
        onInteraction(
          { format: CourseExerciseCategoryEnum.CommonTrap, phase: "complete" },
          true,
        );
      }, 600);
    }
  };

  return (
    <View className="flex-1 px-4 pt-2 pb-6">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Recognizing Common Traps"}
        instruction={
          readString(content.instruction) ??
          "See why the trap feels helpful — then learn the counter move."
        }
      />

      <View className="gap-6 pb-20">
        {/* Trap Block */}
        <Animated.View entering={ANIMATION} className="gap-4">
          <View className="bg-cream p-5 rounded-3xl">
            <Text className="text-[11px] font-bold tracking-wider text-forest-700/60 mb-2">
              THE TRAP
            </Text>
            {trapTitle && (
              <Text className="text-xl font-bold text-forest-900 mb-2">
                {trapTitle}
              </Text>
            )}
            {trapBody && (
              <Text className="text-base text-forest-800 leading-relaxed">
                {trapBody}
              </Text>
            )}
          </View>

          {!isPayoffVisible && predictionOptions.length > 0 && (
            <Animated.View entering={ANIMATION} className="gap-3 mt-2">
              <Text className="text-base font-bold text-forest-900 px-1">
                {predictionQuestion}
              </Text>
              {predictionOptions.map((opt: any) => {
                const isSelected = trapSelectionId === opt.id;
                let result: "correct" | "incorrect" | undefined;
                if (isSelected)
                  result = opt.isCorrect ? "correct" : "incorrect";
                return (
                  <View key={opt.id} className="gap-2">
                    <CourseExerciseOptionButton
                      label={opt.label}
                      selected={isSelected}
                      result={result}
                      onPress={() => handleTrapSelect(opt)}
                      disabled={isSelected && opt.isCorrect}
                    />
                    {isSelected && !opt.isCorrect && opt.feedback && (
                      <Animated.Text
                        entering={ANIMATION}
                        className="text-sm text-forest-700/80 px-2"
                      >
                        {opt.feedback}
                      </Animated.Text>
                    )}
                  </View>
                );
              })}
            </Animated.View>
          )}
        </Animated.View>

        {/* Payoff & Cost (Causal Chain) Block */}
        {isPayoffVisible && (
          <Animated.View entering={ANIMATION} className="gap-4">
            <View className="bg-cream p-5 rounded-3xl">
              <Text className="text-[11px] font-bold tracking-wider text-forest-700/60 mb-4">
                WHAT IT TURNS INTO
              </Text>
              <View className="items-center">
                <Text className="text-base font-bold text-forest-900 text-center">
                  {shortTermPayoff}
                </Text>
                {hiddenCost.map((cost, idx) => (
                  <Animated.View
                    key={idx}
                    entering={FadeInDown.duration(250)
                      .delay((idx + 1) * 200)
                      .reduceMotion(ReduceMotion.System)}
                    className="items-center w-full mt-3"
                  >
                    <ArrowDown
                      size={20}
                      color="#3c4c44"
                      className="mb-3 opacity-40"
                    />
                    <Text className="text-base font-bold text-forest-900 text-center">
                      {cost}
                    </Text>
                  </Animated.View>
                ))}
              </View>
            </View>

            {!isComplete && counterOptions.length > 0 && (
              <Animated.View
                entering={FadeInDown.duration(250)
                  .delay((hiddenCost.length + 1) * 200)
                  .reduceMotion(ReduceMotion.System)}
                className="gap-3 mt-2"
              >
                <Text className="text-base font-bold text-forest-900 px-1">
                  {counterQuestion}
                </Text>
                {counterOptions.map((opt: any) => {
                  const isSelected = counterSelectionId === opt.id;
                  let result: "correct" | "incorrect" | undefined;
                  if (isSelected)
                    result = opt.isCorrect ? "correct" : "incorrect";
                  return (
                    <View key={opt.id} className="gap-2">
                      <CourseExerciseOptionButton
                        label={opt.label}
                        selected={isSelected}
                        result={result}
                        onPress={() => handleCounterSelect(opt)}
                        disabled={isSelected && opt.isCorrect}
                      />
                      {isSelected && !opt.isCorrect && opt.feedback && (
                        <Animated.Text
                          entering={ANIMATION}
                          className="text-sm text-forest-700/80 px-2"
                        >
                          {opt.feedback}
                        </Animated.Text>
                      )}
                    </View>
                  );
                })}
              </Animated.View>
            )}
          </Animated.View>
        )}

        {/* Counter-move Reveal */}
        {isComplete && (
          <Animated.View
            entering={ANIMATION}
            className="bg-sage-50 p-5 rounded-3xl"
          >
            <Text className="text-[11px] font-bold tracking-wider text-forest-700 mb-2">
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
          </Animated.View>
        )}
      </View>
    </View>
  );
}
