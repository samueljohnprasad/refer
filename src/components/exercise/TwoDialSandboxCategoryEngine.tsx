import React, { useEffect, useRef, useState } from "react";
import { Text, View, AccessibilityInfo } from "react-native";
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
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { useTranslation } from "react-i18next";
import { TwoDialControl } from "./TwoDialControl";
import {
  ALL_QUADRANTS,
  createTwoDialResponse,
  getQuadrant,
  type Quadrant,
} from "./twoDialSandboxModel";

export function TwoDialSandboxCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const { t } = useTranslation("exercises");

  const initialDemand = readNumber(saved?.demand ?? saved?.load) ?? 75;
  const initialRecovery = readNumber(saved?.recovery) ?? 25;
  const initialQuadrant = getQuadrant(initialDemand, initialRecovery);
  const initialVisited = readStringArray(saved?.visitedQuadrants);
  const startVisited =
    initialVisited.length > 0 ? initialVisited : [initialQuadrant];
  const isPreviouslyCompleted =
    Boolean(saved?.isComplete) || startVisited.length >= 4;

  const [demand, setDemand] = useState(initialDemand);
  const [recovery, setRecovery] = useState(initialRecovery);
  const [visited, setVisited] = useState<string[]>(startVisited);
  const [hasCompleted, setHasCompleted] = useState(isPreviouslyCompleted);

  const prevQuadrantRef = useRef<Quadrant>(initialQuadrant);
  const reduceMotion = useReducedMotion();

  const currentQuadrant = getQuadrant(demand, recovery);
  const outcomeTitle = t(
    `flow.ui.copy.two_dial_sandbox.outcomes.${currentQuadrant}.title`,
  );
  const outcomeBody = t(
    `flow.ui.copy.two_dial_sandbox.outcomes.${currentQuadrant}.body`,
  );
  const isComplete = hasCompleted || visited.length >= 4;

  useEffect(() => {
    if (!saved) {
      onInteraction(
        createTwoDialResponse(
          initialDemand,
          initialRecovery,
          [initialQuadrant],
          false,
          false,
        ),
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
        `${t(`flow.ui.copy.two_dial_sandbox.outcomes.${nextQuadrant}.title`)}. ${t(`flow.ui.copy.two_dial_sandbox.outcomes.${nextQuadrant}.body`)}`,
      );
    }
    prevQuadrantRef.current = nextQuadrant;

    const willBeComplete = hasCompleted || nextVisited.length >= 4;
    if (!hasCompleted && nextVisited.length >= 4) {
      setHasCompleted(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      AccessibilityInfo.announceForAccessibility(
        t("flow.ui.copy.two_dial_sandbox.completedAnnouncement"),
      );
    }

    onInteraction(
      createTwoDialResponse(
        nextDemand,
        nextRecovery,
        nextVisited,
        true,
        willBeComplete,
      ),
      willBeComplete,
    );
  };

  return (
    <View className="px-5 pb-8 pt-0">
      <CourseExerciseHeading
        title={
          readString(content.title) ?? t("flow.ui.copy.two_dial_sandbox.title")
        }
        instruction={
          readString(content.instruction) ??
          t("flow.ui.copy.two_dial_sandbox.instruction")
        }
      />

      {/* Interactive System Card */}
      <View className="mt-3 rounded-[24px] bg-[#FAFAF8] px-5 py-5 border border-[#E2E8DF]">
        {/* Demand Dial */}
        <TwoDialControl
          title={t("flow.ui.copy.two_dial_sandbox.demand.label")}
          low={t("flow.ui.copy.two_dial_sandbox.demand.low")}
          high={t("flow.ui.copy.two_dial_sandbox.demand.high")}
          value={demand}
          disabled={locked}
          accessibilityLabel={t(
            "flow.ui.copy.two_dial_sandbox.demand.accessibilityLabel",
          )}
          valueLabel={t(
            demand >= 50
              ? "flow.ui.copy.two_dial_sandbox.value.highDemand"
              : "flow.ui.copy.two_dial_sandbox.value.lowDemand",
          )}
          onChange={(val) => updateDials(val, recovery)}
        />

        <View className="h-4" />

        {/* Recovery Dial */}
        <TwoDialControl
          title={t("flow.ui.copy.two_dial_sandbox.recovery.label")}
          low={t("flow.ui.copy.two_dial_sandbox.recovery.low")}
          high={t("flow.ui.copy.two_dial_sandbox.recovery.high")}
          value={recovery}
          disabled={locked}
          accessibilityLabel={t(
            "flow.ui.copy.two_dial_sandbox.recovery.accessibilityLabel",
          )}
          valueLabel={t(
            recovery >= 50
              ? "flow.ui.copy.two_dial_sandbox.value.highRecovery"
              : "flow.ui.copy.two_dial_sandbox.value.lowRecovery",
          )}
          onChange={(val) => updateDials(demand, val)}
        />

        {/* Current State Output Card */}
        <View className="mt-5 rounded-[20px] bg-[#F4F2ED] px-4 py-3.5 border border-[#E6E1D7]">
          <Text className="text-[11px] font-bold tracking-widest text-[#8A8A85] uppercase mb-1">
            {t("flow.ui.copy.two_dial_sandbox.currentState")}
          </Text>
          <Animated.View
            key={currentQuadrant}
            entering={reduceMotion ? undefined : FadeIn.duration(200)}
          >
            <Text className="happy-font-heading-bold text-[16px] text-ink mb-1">
              {outcomeTitle}
            </Text>
            <Text className="happy-font-body text-[13.5px] leading-[19px] text-[#5C5955]">
              {outcomeBody}
            </Text>
          </Animated.View>
        </View>
      </View>

      {/* States Discovered Progress Area */}
      <View className="mt-4 px-1">
        <View className="flex-row justify-between items-center mb-2.5">
          <Text className="text-[11px] font-bold tracking-widest text-[#8A8A85] uppercase">
            {t("flow.ui.copy.two_dial_sandbox.statesDiscovered")}
          </Text>
          <Text className="text-[12px] font-bold text-ink-soft">
            {t("flow.ui.copy.two_dial_sandbox.discoveredCount", {
              count: visited.length,
            })}
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-between gap-y-2">
          {ALL_QUADRANTS.map((quad) => {
            const title = t(
              `flow.ui.copy.two_dial_sandbox.outcomes.${quad}.title`,
            );
            const isDiscovered = visited.includes(quad);
            const isCurrent = currentQuadrant === quad;

            return (
              <View key={quad} className="flex-row items-center w-[48%]">
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
                  {title}
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
            {readString(content.rule) ??
              t("flow.ui.copy.two_dial_sandbox.patternLabel")}
          </Text>
          <Text className="text-[15px] leading-[22px] text-ink">
            {readString(content.takeaway) ??
              t("flow.ui.copy.two_dial_sandbox.takeaway")}
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}
