import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, ReduceMotion } from "react-native-reanimated";
import { Button } from "@/src/components/ui/Button";

// ponytail: modular presentational components for wave ordering exercise

export interface WaveOrderSlotProps {
  index: number;
  stage: string | undefined;
  mark?: boolean;
  phase: "entry" | "feedback" | "complete";
  locked: boolean;
  onPress: () => void;
}

export function WaveOrderSlot({
  index,
  stage,
  mark,
  phase,
  locked,
  onPress,
}: WaveOrderSlotProps) {
  const isEvaluated = phase === "feedback" || phase === "complete";
  const isCorrect = isEvaluated && mark === true;
  const isEmpty = !stage;

  // Empty destination slot placeholder
  if (isEmpty) {
    return (
      <View
        className="w-full flex-row items-center gap-3 rounded-[22px] border-2 border-dashed border-[#D5CEC2] bg-[#FAF8F4] min-h-[56px] px-4.5 py-3"
      >
        <View className="h-6 w-6 items-center justify-center rounded-full bg-[#EDE8DE]">
          <Text className="happy-font-body-bold text-[12px] text-[#7A7265]">
            {index + 1}
          </Text>
        </View>
        <Text className="happy-font-body flex-1 text-[15px] leading-5 text-[#8C8477]">
          Tap a chip to place it here
        </Text>
      </View>
    );
  }

  // Evaluated correct: flat informational sage card with checkmark
  if (isCorrect) {
    return (
      <View
        className="w-full flex-row items-center gap-3 rounded-[22px] border-[1.5px] border-[#5F7F58] bg-[#F2F8EF] min-h-[56px] px-4.5 py-3"
      >
        <View className="h-6 w-6 items-center justify-center rounded-full bg-[#D9E6D5]">
          <Text className="happy-font-body-bold text-[12px] text-[#29452A]">
            {index + 1}
          </Text>
        </View>
        <Text className="happy-font-body-bold flex-1 text-[16px] leading-[22px] text-[#1B3B2B]">
          {stage}
        </Text>
        <Text className="happy-font-body-bold text-base text-[#29452A]">✓</Text>
      </View>
    );
  }

  // Placed slot: uses the canonical 3D tactile Button component
  return (
    <Button
      label={stage}
      variant="secondary"
      size="lg"
      fullWidth
      disabled={locked || phase === "complete"}
      onPress={onPress}
      accessibilityLabel={`Slot ${index + 1}: ${stage}. Tap to remove.`}
      leftIcon={
        <View className="h-6 w-6 items-center justify-center rounded-full bg-[#E8E2D6]">
          <Text className="happy-font-body-bold text-[12px] text-[#4A453F]">
            {index + 1}
          </Text>
        </View>
      }
    />
  );
}

// ponytail: use existing 3D tactile button component from UI library (same as footer)
export function WaveOrderChip({
  stage,
  disabled,
  onPress,
}: {
  stage: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Button
      label={stage}
      variant="secondary"
      size="lg"
      fullWidth
      disabled={disabled}
      onPress={onPress}
    />
  );
}

export function WaveOrderFeedbackCard({
  isCorrect,
  feedbackText,
  rightCount,
  total,
}: {
  isCorrect: boolean;
  feedbackText: string | null;
  rightCount: number;
  total: number;
}) {
  if (isCorrect) {
    return (
      <Animated.View
        entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
        className="rounded-[20px] border border-[#D9E5D5] bg-[#F2F8EF] p-4.5"
        accessible
        accessibilityRole="summary"
      >
        <Text className="text-[11.5px] font-bold uppercase tracking-wider text-[#2D5A32] mb-1">
          THE PATTERN
        </Text>
        <Text className="happy-font-heading-bold text-[16px] leading-[22px] text-[#1B3B2B]">
          A panic surge changes over time.
        </Text>
        <Text className="happy-font-body text-[14px] leading-5 text-[#201E1D] mt-1.5">
          {feedbackText ??
            "The alarm rises, reaches a peak, and then begins to settle."}
        </Text>
      </Animated.View>
    );
  }

  // Flat informational wrong-state feedback card (neutral, NO green fill/border)
  return (
    <Animated.View
      entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
      className="rounded-[20px] border border-[#E5E0D7] bg-[#FAF8F5] p-4.5"
      accessible
      accessibilityRole="alert"
    >
      <Text className="happy-font-heading-bold text-[15.5px] leading-5 text-[#1B3B2B]">
        Try the order again
      </Text>
      <Text className="happy-font-body text-[14px] leading-5 text-[#5A524A] mt-1.5">
        {feedbackText ??
          `${rightCount} of ${total} in the right place. Reorder the remaining ${
            total - rightCount
          }.`}
      </Text>
    </Animated.View>
  );
}

export function WaveOrderClueCard({ clue }: { clue: string }) {
  return (
    <Animated.View
      entering={FadeIn.duration(180).reduceMotion(ReduceMotion.System)}
      className="flex-row items-start gap-2.5 rounded-[18px] border border-[#EAE4DC] bg-[#FAF7F2] px-4 py-3.5"
      accessible
    >
      <View className="h-5 w-5 rounded-full bg-[#E5DFD4] items-center justify-center mt-0.5">
        <Text className="happy-font-body-bold text-[11px] text-[#5F7F58]">?</Text>
      </View>
      <Text className="happy-font-body text-[13.5px] leading-[19px] text-[#3F3A34] flex-1">
        <Text className="happy-font-body-bold text-[#201E1D]">Clue: </Text>
        {clue}
      </Text>
    </Animated.View>
  );
}
