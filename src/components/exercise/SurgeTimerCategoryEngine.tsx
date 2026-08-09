import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readNumber,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function SurgeTimerCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const minute = readNumber(saved?.minute) ?? 0;
  const remainingPercent = calculateRemainingPercent(minute);

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), true);
  }, [onInteraction, saved]);

  const updateMinute = (nextMinute: number) => {
    onInteraction(createResponse({ minute: nextMinute }), true);
  };

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "The surge has a timer"}
        instruction={readString(content.instruction) ?? "Move the slider."}
      />

      <View className="gap-3.5 rounded-[24px] bg-[#F9F4ED] p-[22px] shadow-md shadow-black/10">
        <View className="flex-row items-center gap-[18px]">
          <View className="h-24 w-[62px] justify-end overflow-hidden rounded-[14px] border-2 border-[#DCD3C4] bg-[#EBDDC5]">
            <View
              className="w-full bg-[#C67139]"
              style={{ height: `${remainingPercent}%` }}
            />
          </View>
          <View className="flex-1">
            <Text className="happy-font-heading-bold text-[36px] leading-[38px] text-[#8C491A]">
              {remainingPercent}%
            </Text>
            <Text className="happy-font-body mt-1.5 text-[13px] leading-[19.5px] text-[#3F3A34]">
              {getRemainingDescription(remainingPercent)}
            </Text>
          </View>
        </View>

        <View>
          <Text className="happy-font-body-bold mb-0.5 text-[13.5px] text-[#201E1D]">
            {formatTimeLabel(minute)}
          </Text>
          <Slider
            accessibilityLabel="Minutes since the peak"
            accessibilityRole="adjustable"
            accessibilityValue={{ min: 0, max: 10, now: minute }}
            minimumTrackTintColor="#C67139"
            maximumTrackTintColor="#DCD3C4"
            minimumValue={0}
            maximumValue={10}
            step={0.5}
            thumbTintColor="#C67139"
            value={minute}
            onValueChange={updateMinute}
            style={{ height: 44, width: "100%" }}
          />
          <View className="flex-row justify-between">
            <Text className="happy-font-body text-[11.5px] text-[#82796A]">
              at the peak
            </Text>
            <Text className="happy-font-body text-[11.5px] text-[#82796A]">
              10 minutes on
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-3 rounded-[20px] border-[1.5px] border-[#C9D9AF] bg-[#F0FAE1] px-4 py-[13px]">
        <Text className="happy-font-body text-[13.5px] leading-5 text-[#56633F]">
          <Text className="happy-font-body-bold">The number to keep: </Text>
          {readString(content.numberToKeep)}
        </Text>
      </View>
    </View>
  );
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.SurgeTimer,
    phase: "timer",
    minute: 0,
    isCorrect: true,
    ...extra,
  };
}

function calculateRemainingPercent(minute: number): number {
  return Math.round(100 * Math.pow(0.5, minute / 3));
}

function formatTimeLabel(minute: number): string {
  if (minute === 0) return "At the peak";
  return `${formatMinute(minute)} minute${minute === 1 ? "" : "s"} after the peak`;
}

function formatMinute(minute: number): string {
  return Number.isInteger(minute) ? String(minute) : minute.toFixed(1);
}

function getRemainingDescription(remainingPercent: number): string {
  if (remainingPercent >= 80) {
    return "of the surge still washing through — heart loud, hands buzzing. This is the part that feels endless.";
  }
  if (remainingPercent >= 45) {
    return "still circulating. Past the peak — the fade has already started, whether it feels like it or not.";
  }
  if (remainingPercent >= 20) {
    return "left. The shakes now are the tide going out, not a new wave.";
  }
  return "left — chemistry nearly cleared. The body did this on its own; no technique required.";
}
