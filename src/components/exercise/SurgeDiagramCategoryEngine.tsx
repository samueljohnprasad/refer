import React, { useEffect, useRef, useState, useMemo } from "react";
import { Text, View, AccessibilityInfo } from "react-native";
import Slider from "@react-native-community/slider";
import Svg, { Circle, Line, Path } from "react-native-svg";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn } from "react-native-reanimated";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readNumber,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";

type SurgePhase = "beginning" | "rising" | "peak" | "easing" | "complete";

interface PhaseConfig {
  tag: string;
  caption: string;
  tagColor: string;
  tagBg: string;
}

const PHASE_CONFIGS: Record<SurgePhase, PhaseConfig> = {
  beginning: {
    tag: "BEGINNING",
    caption: "Move through time.",
    tagColor: "#6B6B6B",
    tagBg: "#EAE8E3",
  },
  rising: {
    tag: "RISING",
    caption: "The alarm is getting stronger.",
    tagColor: "#C76F00",
    tagBg: "#FEF3C7",
  },
  peak: {
    tag: "PEAK",
    caption: "This is the most intense point in this example.",
    tagColor: "#C2410C",
    tagBg: "#FFEDD5",
  },
  easing: {
    tag: "EASING",
    caption: "The intensity is changing.",
    tagColor: "#29452A",
    tagBg: "#E5EDE1",
  },
  complete: {
    tag: "EASING",
    caption: "The intensity is changing.",
    tagColor: "#29452A",
    tagBg: "#E5EDE1",
  },
};

const SURGE_CURVE_POINTS: [number, number][] = [
  [0.0, 108],
  [0.08, 106],
  [0.16, 94],
  [0.26, 68],
  [0.36, 38],
  [0.44, 24],
  [0.5, 20],
  [0.56, 24],
  [0.64, 40],
  [0.72, 62],
  [0.8, 80],
  [0.88, 94],
  [0.94, 101],
  [1.0, 104],
];

function getSurgePoint(t: number): { x: number; y: number } {
  const clamped = Math.max(0, Math.min(1, t));
  const x = 24 + clamped * 252;
  let y = 104;

  if (clamped <= 0) {
    y = SURGE_CURVE_POINTS[0][1];
  } else if (clamped >= 1) {
    y = SURGE_CURVE_POINTS[SURGE_CURVE_POINTS.length - 1][1];
  } else {
    for (let i = 0; i < SURGE_CURVE_POINTS.length - 1; i++) {
      const [t0, y0] = SURGE_CURVE_POINTS[i];
      const [t1, y1] = SURGE_CURVE_POINTS[i + 1];
      if (clamped >= t0 && clamped <= t1) {
        const r = (clamped - t0) / (t1 - t0);
        const s = r * r * (3 - 2 * r);
        y = y0 + (y1 - y0) * s;
        break;
      }
    }
  }

  return { x, y };
}

function buildPathString(maxT: number): string {
  const steps = Math.max(2, Math.round(maxT * 60));
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * maxT;
    const pt = getSurgePoint(t);
    if (i === 0) {
      d += `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
    } else {
      d += ` L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
    }
  }
  return d;
}

const FULL_GHOST_PATH = buildPathString(1.0);

function getPhase(t: number): SurgePhase {
  if (t < 0.12) return "beginning";
  if (t < 0.44) return "rising";
  if (t <= 0.6) return "peak";
  if (t < 0.95) return "easing";
  return "complete";
}

export function SurgeDiagramCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const initialProgress = readNumber(saved?.progress) ?? 0;
  const isPreviouslyCompleted = Boolean(saved?.isComplete);

  const [progress, setProgress] = useState(initialProgress);
  const [hasCompleted, setHasCompleted] = useState(isPreviouslyCompleted);
  const prevPhaseRef = useRef<SurgePhase>(getPhase(initialProgress));
  const reduceMotion = useReducedMotion();

  const currentPhase = getPhase(progress);
  const isComplete = hasCompleted || currentPhase === "complete";
  const marker = useMemo(() => getSurgePoint(progress), [progress]);
  const activePath = useMemo(() => buildPathString(Math.max(0.01, progress)), [progress]);
  const phaseConfig = PHASE_CONFIGS[currentPhase];

  useEffect(() => {
    if (!saved) {
      onInteraction(
        {
          format: CourseExerciseCategoryEnum.SurgeDiagram,
          phase: "diagram",
          progress: 0,
          hasInteracted: false,
          isComplete: false,
          isCorrect: true,
        },
        false,
      );
    }
  }, [onInteraction, saved]);

  const handleValueChange = (val: number) => {
    setProgress(val);
    const nextPhase = getPhase(val);
    const willBeComplete = hasCompleted || nextPhase === "complete";

    if (!hasCompleted && nextPhase === "complete") {
      setHasCompleted(true);
      Haptics.selectionAsync();
      AccessibilityInfo.announceForAccessibility(
        "Easing. Reached the end. The pattern: A surge can feel endless, but intensity changes over time.",
      );
    } else if (nextPhase !== prevPhaseRef.current) {
      if (nextPhase === "peak" || (prevPhaseRef.current === "rising" && nextPhase === "peak")) {
        Haptics.selectionAsync();
      }
      AccessibilityInfo.announceForAccessibility(
        `${PHASE_CONFIGS[nextPhase].tag}. ${PHASE_CONFIGS[nextPhase].caption}`,
      );
    }
    prevPhaseRef.current = nextPhase;

    onInteraction(
      {
        ...saved,
        format: CourseExerciseCategoryEnum.SurgeDiagram,
        phase: "diagram",
        progress: val,
        hasInteracted: true,
        isComplete: willBeComplete,
        isCorrect: true,
      },
      willBeComplete,
    );
  };

  return (
    <View className="px-5 pb-8 pt-0">
      <CourseExerciseHeading
        title={readString(content.title) ?? "An alarm changes over time"}
        instruction={readString(content.instruction) ?? "Follow the shape of a surge."}
      />

      {/* Interactive Graph Card */}
      <View className="mt-3 rounded-[24px] bg-[#FAFAF8] px-5 py-4 border border-[#E2E8DF]">
        {/* Phase Header */}
        <View className="flex-row items-start mb-2 min-h-[42px]">
          <View
            style={{ backgroundColor: phaseConfig.tagBg }}
            className="rounded-full px-2.5 py-0.5 mr-2 mt-0.5"
          >
            <Text
              style={{ color: phaseConfig.tagColor }}
              className="text-[11px] font-bold tracking-wider"
            >
              {phaseConfig.tag}
            </Text>
          </View>
          <Text className="happy-font-body-medium text-[13.5px] leading-[19px] text-ink flex-1">
            {phaseConfig.caption}
          </Text>
        </View>

        {/* SVG Curve Canvas */}
        <View className="relative my-1">
          <Svg
            width="100%"
            height={130}
            viewBox="0 0 300 126"
            accessibilityLabel="Surge intensity curve showing beginning, rise, peak, and easing over time"
          >
            {/* Baseline axis */}
            <Line
              x1="18"
              y1="112"
              x2="282"
              y2="112"
              stroke="#E2DDD5"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Ghost unexplored track */}
            <Path
              d={FULL_GHOST_PATH}
              fill="none"
              stroke="#E2DDD5"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Active explored curve */}
            <Path
              d={activePath}
              fill="none"
              stroke="#5F7F58"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Movable thumb marker */}
            <Circle
              cx={marker.x}
              cy={marker.y}
              r={7}
              fill="#5F7F58"
              stroke="#FFFFFF"
              strokeWidth={2.5}
            />
          </Svg>

          {/* Quiet Axis Label */}
          <Text className="happy-font-body absolute bottom-0 right-2 text-[11px] text-[#8A8A85]">
            {readString(content.axisLabel) ?? "Time passing"}
          </Text>
        </View>

        {/* Scrubber slider */}
        <View className="mt-2">
          <Slider
            minimumValue={0}
            maximumValue={1}
            step={0.01}
            value={progress}
            onValueChange={handleValueChange}
            minimumTrackTintColor="#5F7F58"
            maximumTrackTintColor="#E2DDD5"
            thumbTintColor="#5F7F58"
            style={{ height: 40, width: "100%" }}
            accessibilityRole="adjustable"
            accessibilityLabel="Surge timeline"
            accessibilityValue={{ text: phaseConfig.tag }}
            accessibilityActions={[
              { name: "increment", label: "Forward in time" },
              { name: "decrement", label: "Backward in time" },
            ]}
            onAccessibilityAction={(event) => {
              if (event.nativeEvent.actionName === "increment") {
                handleValueChange(Math.min(1, progress + 0.2));
              } else if (event.nativeEvent.actionName === "decrement") {
                handleValueChange(Math.max(0, progress - 0.2));
              }
            }}
          />
        </View>
      </View>

      {/* Completed Takeaway Insight */}
      {isComplete ? (
        <Animated.View
          entering={reduceMotion ? undefined : FadeIn.delay(180).duration(350)}
          className="mt-6 rounded-[20px] bg-[#F5F8F4] px-5 py-4 border border-[#D8E2D5]"
          accessible
          accessibilityRole="summary"
        >
          <Text className="text-[12px] font-bold tracking-widest text-sage-600 mb-1.5 uppercase">
            {readString(content.rule) ?? "THE PATTERN"}
          </Text>
          <Text className="text-[15px] leading-[22px] text-ink">
            {readString(content.takeaway) ??
              "A surge can feel endless while you’re inside it.\n\nBut intensity can change over time."}
          </Text>
        </Animated.View>
      ) : null}

      {/* Illustrative Qualifier Footnote */}
      <Text className="happy-font-body mt-4 text-center text-[12px] text-[#8A8A85]">
        {readString(content.note) ?? "Illustrative pattern — timing and intensity vary."}
      </Text>
    </View>
  );
}
