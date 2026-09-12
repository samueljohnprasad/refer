import React, { useEffect, useRef, useState } from "react";
import { Text, View, AccessibilityInfo } from "react-native";
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn } from "react-native-reanimated";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readNumber,
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";

type Quadrant = "HL" | "HH" | "LH" | "LL";

interface StateOutcome {
  id: Quadrant;
  title: string;
  body: string;
}

const ALL_QUADRANTS: Quadrant[] = ["HL", "HH", "LH", "LL"];

const OUTCOMES: Record<Quadrant, StateOutcome> = {
  HL: {
    id: "HL",
    title: "Deadline crunch",
    body: "High demand with little recovery can keep the system running hot.",
  },
  HH: {
    id: "HH",
    title: "Steady rhythm",
    body: "Demand is present, but recovery keeps replenishing capacity.",
  },
  LH: {
    id: "LH",
    title: "Quiet recharge",
    body: "Lower demand gives recovery room to rebuild.",
  },
  LL: {
    id: "LL",
    title: "Stalled loop",
    body: "Low demand with little recovery can leave the week feeling flat.",
  },
};

function getQuadrant(demand: number, recovery: number): Quadrant {
  return `${demand >= 50 ? "H" : "L"}${recovery >= 50 ? "H" : "L"}` as Quadrant;
}

export function TwoDialSandboxCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);

  const initialDemand = readNumber(saved?.demand ?? saved?.load) ?? 75;
  const initialRecovery = readNumber(saved?.recovery) ?? 25;
  const initialQuadrant = getQuadrant(initialDemand, initialRecovery);
  const initialVisited = readStringArray(saved?.visitedQuadrants);
  const startVisited = initialVisited.length > 0
    ? initialVisited
    : [initialQuadrant];
  const isPreviouslyCompleted = Boolean(saved?.isComplete) || startVisited.length >= 4;

  const [demand, setDemand] = useState(initialDemand);
  const [recovery, setRecovery] = useState(initialRecovery);
  const [visited, setVisited] = useState<string[]>(startVisited);
  const [hasCompleted, setHasCompleted] = useState(isPreviouslyCompleted);

  const prevQuadrantRef = useRef<Quadrant>(initialQuadrant);
  const reduceMotion = useReducedMotion();

  const currentQuadrant = getQuadrant(demand, recovery);
  const outcome = OUTCOMES[currentQuadrant];
  const isComplete = hasCompleted || visited.length >= 4;

  useEffect(() => {
    if (!saved) {
      onInteraction(
        createResponse(initialDemand, initialRecovery, [initialQuadrant], false, false),
        false,
      );
    }
  }, [onInteraction, saved]);

  const updateDials = (nextDemand: number, nextRecovery: number) => {
    if (locked) return;
    setDemand(nextDemand);
    setRecovery(nextRecovery);

    const nextQuadrant = getQuadrant(nextDemand, nextRecovery);
    let nextVisited = visited;

    if (!visited.includes(nextQuadrant)) {
      nextVisited = [...visited, nextQuadrant];
      setVisited(nextVisited);
      Haptics.selectionAsync();
    } else if (nextQuadrant !== prevQuadrantRef.current) {
      Haptics.selectionAsync();
    }

    if (nextQuadrant !== prevQuadrantRef.current) {
      AccessibilityInfo.announceForAccessibility(
        `${OUTCOMES[nextQuadrant].title}. ${OUTCOMES[nextQuadrant].body}`,
      );
    }
    prevQuadrantRef.current = nextQuadrant;

    const willBeComplete = hasCompleted || nextVisited.length >= 4;
    if (!hasCompleted && nextVisited.length >= 4) {
      setHasCompleted(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      AccessibilityInfo.announceForAccessibility(
        "All four states discovered. The pattern: Demand alone doesn't decide how the week feels. Recovery changes what the same demand costs you.",
      );
    }

    onInteraction(
      createResponse(nextDemand, nextRecovery, nextVisited, true, willBeComplete),
      willBeComplete,
    );
  };

  return (
    <View className="px-5 pb-8 pt-0">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Two dials shape your week"}
        instruction={
          readString(content.instruction) ??
          "Adjust demand and recovery to see how the system reacts."
        }
      />

      {/* Interactive System Card */}
      <View className="mt-3 rounded-[24px] bg-[#FAFAF8] px-5 py-5 border border-[#E2E8DF]">
        {/* Demand Dial */}
        <DialControl
          title="DEMAND"
          low="quiet"
          high="everything at once"
          value={demand}
          disabled={locked}
          onChange={(val) => updateDials(val, recovery)}
        />

        <View className="h-4" />

        {/* Recovery Dial */}
        <DialControl
          title="RECOVERY"
          low="running dry"
          high="topped up"
          value={recovery}
          disabled={locked}
          onChange={(val) => updateDials(demand, val)}
        />

        {/* Current State Output Card */}
        <View className="mt-5 rounded-[20px] bg-[#F4F2ED] px-4 py-3.5 border border-[#E6E1D7]">
          <Text className="text-[11px] font-bold tracking-widest text-[#8A8A85] uppercase mb-1">
            CURRENT STATE
          </Text>
          <Animated.View
            key={currentQuadrant}
            entering={reduceMotion ? undefined : FadeIn.duration(200)}
          >
            <Text className="happy-font-heading-bold text-[16px] text-ink mb-1">
              {outcome.title}
            </Text>
            <Text className="happy-font-body text-[13.5px] leading-[19px] text-[#5C5955]">
              {outcome.body}
            </Text>
          </Animated.View>
        </View>
      </View>

      {/* States Discovered Progress Area */}
      <View className="mt-4 px-1">
        <View className="flex-row justify-between items-center mb-2.5">
          <Text className="text-[11px] font-bold tracking-widest text-[#8A8A85] uppercase">
            STATES DISCOVERED
          </Text>
          <Text className="text-[12px] font-bold text-ink-soft">
            {visited.length} of 4
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-between gap-y-2">
          {ALL_QUADRANTS.map((quad) => {
            const item = OUTCOMES[quad];
            const isDiscovered = visited.includes(quad);
            const isCurrent = currentQuadrant === quad;

            return (
              <View
                key={quad}
                className="flex-row items-center w-[48%]"
              >
                <Text
                  className={`text-[13px] font-bold mr-2 ${
                    isDiscovered ? "text-[#5F7F58]" : "text-[#B8B2A7]"
                  }`}
                >
                  {isDiscovered ? "✓" : "○"}
                </Text>
                <Text
                  className={`text-[13px] ${
                    isCurrent
                      ? "happy-font-body-bold text-ink"
                      : isDiscovered
                        ? "happy-font-body-medium text-ink-soft"
                        : "happy-font-body text-[#8A8A85]"
                  }`}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Final Insight Card - Revealed on 4/4 */}
      {isComplete ? (
        <Animated.View
          entering={reduceMotion ? undefined : FadeIn.delay(180).duration(350)}
          className="mt-5 rounded-[20px] bg-[#F5F8F4] px-5 py-4 border border-[#D8E2D5]"
          accessible
          accessibilityRole="summary"
        >
          <Text className="text-[12px] font-bold tracking-widest text-sage-600 mb-1.5 uppercase">
            {readString(content.rule) ?? "THE PATTERN"}
          </Text>
          <Text className="text-[15px] leading-[22px] text-ink">
            {readString(content.takeaway) ??
              "Demand alone doesn’t decide how the week feels.\n\nRecovery changes what the same demand costs you."}
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

function DialControl({
  title,
  low,
  high,
  value,
  disabled,
  onChange,
}: {
  title: string;
  low: string;
  high: string;
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <View>
      <Text className="text-[12px] font-bold tracking-wider text-ink uppercase mb-0.5">
        {title}
      </Text>
      <Slider
        accessibilityRole="adjustable"
        accessibilityLabel={`${title} dial`}
        accessibilityValue={{ text: value >= 50 ? `High ${title.toLowerCase()}` : `Low ${title.toLowerCase()}` }}
        disabled={disabled}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={value}
        minimumTrackTintColor="#5F7F58"
        maximumTrackTintColor="#E2DDD5"
        thumbTintColor="#5F7F58"
        onValueChange={onChange}
        style={{ width: "100%", height: 38 }}
      />
      <View className="flex-row justify-between px-0.5">
        <Text className="happy-font-body text-[11px] text-[#8A8A85]">{low}</Text>
        <Text className="happy-font-body text-[11px] text-[#8A8A85]">{high}</Text>
      </View>
    </View>
  );
}

function createResponse(
  demand: number,
  recovery: number,
  visitedQuadrants: string[],
  hasInteracted: boolean,
  isComplete: boolean,
) {
  return {
    format: CourseExerciseCategoryEnum.TwoDialSandbox,
    phase: "sandbox",
    demand,
    load: demand, // compatibility with legacy
    recovery,
    visitedQuadrants,
    hasInteracted,
    isComplete,
    isCorrect: true,
  };
}
