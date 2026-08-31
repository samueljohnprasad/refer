import React, { useEffect } from "react";
import { LayoutAnimation, Pressable, Text, View } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readNumber,
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

interface Lever {
  id: string;
  label: string;
  remainingPercent: number;
  explanation: string;
  tone: "orange" | "olive";
}

export function LeverCheckCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const levers = readLevers(content.levers);
  const pulledLeverIds = readStringArray(saved?.pulledLeverIds);
  const reduceMotion = useReducedMotion();
  const allPulled = levers.length > 0 && pulledLeverIds.length >= levers.length;

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  const pullLever = (leverId: string) => {
    if (pulledLeverIds.includes(leverId)) return;
    if (!reduceMotion) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    const nextIds = [...pulledLeverIds, leverId];
    onInteraction(
      createResponse({ ...saved, pulledLeverIds: nextIds }),
      nextIds.length >= levers.length,
    );
  };

  return (
    <View className="px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Big lever, small lever"}
        instruction={readString(content.instruction) ?? "Pull each lever."}
      />

      <View className="gap-[18px]">
        {levers.map((lever) => (
          <LeverRow
            key={lever.id}
            lever={lever}
            pulled={pulledLeverIds.includes(lever.id)}
            onPress={() => pullLever(lever.id)}
          />
        ))}
      </View>

      {allPulled ? (
        <View className="mt-3.5 rounded-[24px] bg-[#F9F4ED] px-[22px] py-5 shadow-md shadow-black/10">
          <Text className="happy-font-heading-bold text-[19px] leading-[25px] text-[#29452A]">
            {readString(content.rule)}
          </Text>
          <Text className="happy-font-body mt-1.5 text-sm leading-[22px] text-[#201E1D]">
            {readString(content.takeaway)}
          </Text>
        </View>
      ) : null}

      <Text className="happy-font-body mt-3 text-center text-[12.5px] leading-[18px] text-[#82796A]">
        {readString(content.note)}
      </Text>
    </View>
  );
}

function LeverRow({
  lever,
  pulled,
  onPress,
}: {
  lever: Lever;
  pulled: boolean;
  onPress: () => void;
}) {
  const isOlive = lever.tone === "olive";

  return (
    <View>
      <Text className="happy-font-body-bold mb-1.5 text-[13.5px] leading-[19px] text-[#201E1D]">
        {lever.label}
      </Text>
      <View className="h-[22px] overflow-hidden rounded-[10px] bg-[#EBDDC5]">
        <View
          className="h-full bg-[#7E9874]"
          style={{ width: `${pulled ? lever.remainingPercent : 100}%` }}
        >
          {pulled ? (
            <Text
              numberOfLines={1}
              className="happy-font-body-bold pl-2 text-[11px] leading-[22px] text-[#201E1D]"
            >
              {lever.remainingPercent}% of the load still there
            </Text>
          ) : null}
        </View>
      </View>
      <Text className="happy-font-body-bold mt-1 min-h-4 text-xs leading-[17px] text-[#82796A]">
        {pulled ? lever.explanation : " "}
      </Text>
      {!pulled ? (
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          className="mt-1.5 min-h-[44px] items-center justify-center rounded-full border-[1.5px] border-[#DCD3C4] bg-[#F9F4ED] px-5 shadow-sm shadow-black/10 active:translate-y-0.5"
        >
          <Text className="happy-font-body-bold text-[13px] text-[#201E1D]">
            Pull this lever
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function readLevers(value: unknown): Lever[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    const lever = readRecord(item);
    const id = readString(lever?.id);
    const label = readString(lever?.label);
    const remainingPercent = readNumber(lever?.remainingPercent);
    const explanation = readString(lever?.explanation);
    if (!id || !label || remainingPercent === null || !explanation) return [];
    return [
      {
        id,
        label,
        remainingPercent,
        explanation,
        tone: lever?.tone === "olive" ? "olive" : "orange",
      },
    ];
  });
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.LeverCheck,
    phase: "lever",
    pulledLeverIds: [],
    isCorrect: true,
    ...extra,
  };
}
