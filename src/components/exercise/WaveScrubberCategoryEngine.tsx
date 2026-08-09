import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import Svg, { Circle, Line, Polyline } from "react-native-svg";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readNumber,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import {
  readScrubberPhases,
  type ScrubberPhase,
} from "@/src/components/exercise/courseExerciseSeventhBatchContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

const WAVE_POINTS: [number, number][] = [
  [0, 0.06],
  [1, 0.08],
  [1.6, 0.45],
  [2.2, 0.85],
  [2.5, 1],
  [3, 0.95],
  [3.8, 0.62],
  [4.6, 0.4],
  [5.5, 0.3],
  [6, 0.26],
  [6.5, 0.42],
  [7, 0.3],
  [8, 0.17],
  [9, 0.1],
  [10, 0.07],
];

const CURVE_POINTS = WAVE_POINTS.map(
  ([minute, intensity]) =>
    `${toX(minute).toFixed(1)},${toY(intensity).toFixed(1)}`,
).join(" ");

export function WaveScrubberCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const minute = readNumber(saved?.minute) ?? 0;
  const phases = readScrubberPhases(content.phases);
  const phase = findPhase(phases, minute);
  const marker = getWavePosition(minute);

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), true);
  }, [onInteraction, saved]);

  const updateMinute = (nextMinute: number) => {
    onInteraction(createResponse({ minute: nextMinute }), true);
  };

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "One wave, up close"}
        instruction={
          readString(content.instruction) ?? "Drag through the wave."
        }
      />

      <View className="rounded-[24px] bg-[#F9F4ED] px-[18px] pb-3.5 pt-5 shadow-md shadow-black/10">
        <Svg
          height={146}
          width="100%"
          viewBox="0 0 300 130"
          accessibilityLabel="An anxiety wave over ten minutes: climb, peak, fade, one aftershock"
        >
          <Line
            x1="12"
            y1="112"
            x2="290"
            y2="112"
            stroke="#DCD3C4"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <Polyline
            points={CURVE_POINTS}
            fill="none"
            stroke="#5F7F58"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Line
            x1={marker.x}
            y1="14"
            x2={marker.x}
            y2="118"
            stroke="#5F7F58"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <Circle cx={marker.x} cy={marker.y} r="6" fill="#5F7F58" />
        </Svg>
        <Slider
          accessibilityLabel="Minutes into the wave"
          minimumTrackTintColor="#5F7F58"
          maximumTrackTintColor="#DCD3C4"
          minimumValue={0}
          maximumValue={10}
          step={0.25}
          thumbTintColor="#5F7F58"
          value={minute}
          onValueChange={updateMinute}
          style={{ height: 44, width: "100%" }}
        />
        <View className="flex-row justify-between">
          <Text className="happy-font-body text-[11.5px] text-[#82796A]">
            minute 0
          </Text>
          <Text className="happy-font-body text-[11.5px] text-[#82796A]">
            minute 10
          </Text>
        </View>
      </View>

      <View className="mt-3 min-h-[88px] rounded-[20px] bg-[#F9F4ED] px-4 py-[13px] shadow-sm shadow-black/10">
        <Text className={getPhasePillClassName(phase?.tone)}>
          min {formatMinute(minute)} · {phase?.label}
        </Text>
        <Text className="happy-font-body mt-2 text-[13.5px] leading-5 text-[#201E1D]">
          {phase?.body}
        </Text>
      </View>
    </View>
  );
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.WaveScrubber,
    phase: "scrub",
    minute: 0,
    isCorrect: true,
    ...extra,
  };
}

function findPhase(
  phases: ScrubberPhase[],
  minute: number,
): ScrubberPhase | undefined {
  return phases.find((phase) => minute < phase.until) ?? phases.at(-1);
}

function getWavePosition(minute: number): { x: number; y: number } {
  let intensity = WAVE_POINTS.at(-1)?.[1] ?? 0;
  for (let index = 1; index < WAVE_POINTS.length; index += 1) {
    const previous = WAVE_POINTS[index - 1];
    const next = WAVE_POINTS[index];
    if (minute <= next[0]) {
      const progress = (minute - previous[0]) / (next[0] - previous[0] || 1);
      intensity = previous[1] + (next[1] - previous[1]) * progress;
      break;
    }
  }
  return { x: toX(minute), y: toY(intensity) };
}

function toX(minute: number): number {
  return 14 + (minute / 10) * 272;
}

function toY(intensity: number): number {
  return 112 - intensity * 92;
}

function formatMinute(minute: number): string {
  return Number.isInteger(minute)
    ? String(minute)
    : minute.toFixed(2).replace(/0$/, "");
}

function getPhasePillClassName(
  tone: ScrubberPhase["tone"] | undefined,
): string {
  if (tone === "orange") {
    return "happy-font-body-bold self-start rounded-full bg-[#F2F8EF] px-3 py-1 text-xs text-[#29452A]";
  }
  if (tone === "olive") {
    return "happy-font-body-bold self-start rounded-full bg-[#F2F8EF] px-3 py-1 text-xs text-[#29452A]";
  }
  return "happy-font-body-bold self-start rounded-full bg-[#EEE8DD] px-3 py-1 text-xs text-[#3F3A34]";
}
