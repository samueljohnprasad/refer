import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown, ReduceMotion } from "react-native-reanimated";
import { Button } from "@/src/components/ui/Button";
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
  const shortTermPayoff = readString(content.shortTermPayoff) || readString(content.relief); // fallback
  const hiddenCostRaw = content.hiddenCost ?? content.rebound;
  const hiddenCost = readStringArray(hiddenCostRaw).length > 0
    ? readStringArray(hiddenCostRaw)
    : (readString(hiddenCostRaw) ? [readString(hiddenCostRaw)!] : []);
    
  const counterMoveObj = readRecord(content.counterMove);
  const counterMoveBodyRaw = counterMoveObj?.body ?? content.counterMove;
  const counterMoveBody = readStringArray(counterMoveBodyRaw).length > 0 
    ? readStringArray(counterMoveBodyRaw) 
    : (readString(counterMoveBodyRaw) ? [readString(counterMoveBodyRaw)!] : []);

  // ponytail: remove legacy fields isCorrect/revealed from payload
  useEffect(() => {
    if (!saved || !saved.phase) {
      onInteraction(
        {
          format: CourseExerciseCategoryEnum.CommonTrap,
          phase: "trap",
        },
        false,
      );
    } else if (phase === "counter") {
      onInteraction(
        {
          format: CourseExerciseCategoryEnum.CommonTrap,
          phase: "counter",
        },
        true,
      );
    }
  }, [onInteraction, saved?.phase, phase]);

  const handleNextPhase = (nextPhase: string) => {
    onInteraction(
      {
        format: CourseExerciseCategoryEnum.CommonTrap,
        phase: nextPhase,
      },
      nextPhase === "counter",
    );
  };

  const isPayoffVisible = ["payoff", "cost", "counter", "complete"].includes(phase);
  const isCostVisible = ["cost", "counter", "complete"].includes(phase);
  const isCounterVisible = ["counter", "complete"].includes(phase);

  return (
    <View className="flex-1 px-4 pt-2 pb-6">
      <CourseExerciseHeading
        title={readString(content.title) ?? "The trap that makes sense"}
        instruction={readString(content.instruction) ?? "Tap through."}
      />

      <View className="gap-4">
        {/* Trap */}
        <Animated.View entering={ANIMATION} className="bg-cream p-5 rounded-3xl">
          <Text className="text-[11px] font-bold tracking-wider text-forest-700/60 mb-2">THE TRAP</Text>
          {trapTitle && <Text className="text-xl font-bold text-forest-900 mb-2">{trapTitle}</Text>}
          {trapBody && <Text className="text-base text-forest-800 leading-relaxed">{trapBody}</Text>}
        </Animated.View>

        {phase === "trap" && (
          <Animated.View entering={ANIMATION}>
            <Button variant="primary" label="AND THEN WHAT HAPPENS?" onPress={() => handleNextPhase("payoff")} />
          </Animated.View>
        )}

        {/* Payoff */}
        {isPayoffVisible && (
          <Animated.View entering={ANIMATION} className="bg-cream p-5 rounded-3xl">
            <Text className="text-[11px] font-bold tracking-wider text-forest-700/60 mb-2">WHY IT FEELS SAFE</Text>
            {shortTermPayoff && <Text className="text-base text-forest-800 leading-relaxed">{shortTermPayoff}</Text>}
          </Animated.View>
        )}

        {phase === "payoff" && (
          <Animated.View entering={ANIMATION}>
            <Button variant="primary" label="SEE WHAT IT TURNS INTO" onPress={() => handleNextPhase("cost")} />
          </Animated.View>
        )}

        {/* Cost */}
        {isCostVisible && (
          <Animated.View entering={ANIMATION} className="bg-cream p-5 rounded-3xl">
            <Text className="text-[11px] font-bold tracking-wider text-forest-700/60 mb-2">WHAT IT TURNS INTO</Text>
            <View className="gap-2">
              {hiddenCost.map((cost, idx) => (
                <Text key={idx} className="text-base text-forest-800 leading-relaxed">• {cost}</Text>
              ))}
            </View>
          </Animated.View>
        )}

        {phase === "cost" && (
          <Animated.View entering={ANIMATION}>
            <Button variant="primary" label="WHAT CAN I DO INSTEAD?" onPress={() => handleNextPhase("counter")} />
          </Animated.View>
        )}

        {/* Counter */}
        {isCounterVisible && (
          <Animated.View entering={ANIMATION} className="bg-sage-50 p-5 rounded-3xl">
            <Text className="text-[11px] font-bold tracking-wider text-forest-700 mb-2">TRY THIS INSTEAD</Text>
            <View className="gap-2">
              {counterMoveBody.map((move, idx) => (
                <Text key={idx} className="text-base text-forest-800 leading-relaxed">{move}</Text>
              ))}
            </View>
          </Animated.View>
        )}
      </View>
    </View>
  );
}
