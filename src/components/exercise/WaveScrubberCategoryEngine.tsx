import React, { useEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import Svg, { Circle, Line, Polyline } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readNumber,
  readRecord,
  readString,
  readStringArray,
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

const DEFAULT_PHASES: ScrubberPhase[] = [
  {
    label: "EARLY RISE",
    body: "The alarm is switching on.\nThe sensations can build quickly.",
    tone: "olive",
    until: 2.0,
  },
  {
    label: "PEAK",
    body: "The alarm is at its strongest.\n\nStrong sensations can feel convincing, even when they aren't proof of danger.",
    tone: "olive",
    until: 3.8,
  },
  {
    label: "SETTLING",
    body: "The surge is beginning to ease.\n\nYour body may still feel activated while the alarm comes down.",
    tone: "olive",
    until: 6.0,
  },
  {
    label: "ANOTHER RISE",
    body: "A sensation or worried thought can push the alarm upward again.\n\nAnother rise doesn't mean you're back at the beginning.",
    tone: "olive",
    until: 7.5,
  },
  {
    label: "SETTLING AGAIN",
    body: "The alarm is easing again.\n\nWaves can rise and fall more than once.",
    tone: "olive",
    until: 10,
  },
];

export function WaveScrubberCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const parsedPhases = readScrubberPhases(content.phases);
  const phases = parsedPhases.length > 0 ? parsedPhases : DEFAULT_PHASES;

  const [minute, setMinute] = useState<number>(() => readNumber(saved?.minute) ?? 0);
  const savedVisited = readStringArray(saved?.visitedPhases);
  const [visitedPhases, setVisitedPhases] = useState<Set<string>>(
    () => new Set(savedVisited.length ? savedVisited : [phases[0]?.label ?? "EARLY RISE"]),
  );
  const [isComplete, setIsComplete] = useState<boolean>(
    () => saved?.isComplete === true,
  );

  const phase = useMemo(() => findPhase(phases, minute), [phases, minute]);
  const marker = useMemo(() => getWavePosition(minute), [minute]);
  const lastHapticPhaseRef = useRef<string>(phase.label);

  // ponytail: record initial idle state on mount
  useEffect(() => {
    if (!saved) {
      onInteraction(
        createResponse({
          minute: 0,
          hasInteracted: false,
          isComplete: false,
          visitedPhases: [phases[0]?.label ?? "EARLY RISE"],
        }),
        false,
      );
    }
  }, [saved, onInteraction, phases]);

  const handleSliderChange = (nextMinute: number) => {
    setMinute(nextMinute);

    const currentPhase = findPhase(phases, nextMinute);
    // ponytail: light haptic only when crossing phase boundaries
    if (currentPhase && currentPhase.label !== lastHapticPhaseRef.current) {
      Haptics.selectionAsync();
      lastHapticPhaseRef.current = currentPhase.label;
    }

    const nextVisited = new Set(visitedPhases);
    if (currentPhase) nextVisited.add(currentPhase.label);
    setVisitedPhases(nextVisited);

    // Consider wave explored when user visits 3+ phases or scrubs through to recovery
    const explored = isComplete || nextVisited.size >= 3 || nextMinute >= 7.5;
    if (explored && !isComplete) {
      setIsComplete(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    onInteraction(
      createResponse({
        minute: nextMinute,
        hasInteracted: true,
        isComplete: explored,
        visitedPhases: Array.from(nextVisited),
      }),
      explored,
    );
  };

  return (
    <View className="flex-1 -mt-6 px-2 pb-8 pt-0">
      <View className="mb-4">
        <CourseExerciseHeading
          title={readString(content.title) ?? "One wave, up close"}
          instruction={
            readString(content.instruction) ??
            "Drag through the wave to see how it changes."
          }
        />
      </View>

      {/* ponytail: graph card is informational, not tactile */}
      <View className="rounded-[24px] border border-[#EBDDC8] bg-[#FAF6F0] p-4 shadow-sm shadow-black/5">
        <Text className="happy-font-body-bold mb-2 text-[11px] uppercase tracking-wider text-[#82796A]">
          ALARM INTENSITY
        </Text>

        <Svg
          height={136}
          width="100%"
          viewBox="0 0 300 126"
          accessibilityLabel="An anxiety wave showing rise, peak, settling, second rise, and recovery"
        >
          <Line
            x1="12"
            y1="112"
            x2="290"
            y2="112"
            stroke="#E5DFD7"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <Polyline
            points={CURVE_POINTS}
            fill="none"
            stroke="#5F7F58"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Subtle cursor guide line and intersection dot */}
          <Line
            x1={marker.x}
            y1="14"
            x2={marker.x}
            y2="112"
            stroke="#CCD9C7"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <Circle cx={marker.x} cy={marker.y} r="5" fill="#5F7F58" />
        </Svg>

        <View className="mt-2">
          <Slider
            accessibilityLabel="Wave progression"
            accessibilityValue={{ text: phase.label }}
            minimumTrackTintColor="#5F7F58"
            maximumTrackTintColor="#E5DFD7"
            minimumValue={0}
            maximumValue={10}
            step={0.1}
            thumbTintColor="#5F7F58"
            value={minute}
            onValueChange={handleSliderChange}
            style={{ height: 36, width: "100%" }}
          />
          <View className="flex-row justify-between px-1">
            <Text className="happy-font-body-bold text-[11.5px] tracking-wider text-[#82796A]">
              START
            </Text>
            <Text className="happy-font-body-bold text-[11.5px] tracking-wider text-[#82796A]">
              LATER
            </Text>
          </View>
        </View>
      </View>

      {/* ponytail: flat phase explanation without second card wrapper */}
      <View className="mt-5 px-1">
        <Text className="happy-font-body-bold text-[12px] uppercase tracking-wider text-[#5F7F58]">
          {phase.label}
        </Text>
        <Text className="happy-font-body mt-1.5 text-[15px] leading-[22px] text-[#201E1D]">
          {phase.body}
        </Text>
      </View>

      {/* ponytail: revealed once user has explored the wave */}
      {isComplete ? (
        <View className="mt-6 rounded-[20px] border border-[#E5DFD7] bg-[#F9F7F2] p-4">
          <Text className="happy-font-body-bold text-[12px] uppercase tracking-wider text-[#5F7F58]">
            THE PATTERN
          </Text>
          <Text className="happy-font-body-bold mt-1.5 text-[15px] leading-5 text-[#201E1D]">
            A surge changes over time.
          </Text>
          <Text className="happy-font-body mt-1 text-[14px] leading-5 text-[#5A524A]">
            It can rise quickly, peak, ease, and sometimes rise again before settling.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.WaveScrubber,
    phase: "scrub",
    minute: 0,
    hasInteracted: false,
    isComplete: false,
    visitedPhases: [],
    ...extra,
  };
}

function findPhase(phases: ScrubberPhase[], minute: number): ScrubberPhase {
  return phases.find((p) => minute < p.until) ?? phases.at(-1) ?? DEFAULT_PHASES[0];
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

