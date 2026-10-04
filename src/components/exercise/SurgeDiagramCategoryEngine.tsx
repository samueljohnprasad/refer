import React, { useEffect, useRef, useState } from "react";
import { Text, View, AccessibilityInfo } from "react-native";
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
import { useTranslation } from "react-i18next";
import { SurgeDiagramChart } from "./SurgeDiagramChart";
import {
  getSurgePhase,
  PHASE_CONFIGS,
  type SurgePhase,
} from "./surgeDiagramModel";

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
  const { t } = useTranslation("exercises");
  const prevPhaseRef = useRef<SurgePhase>(getSurgePhase(initialProgress));
  const reduceMotion = useReducedMotion();

  const currentPhase = getSurgePhase(progress);
  const isComplete = hasCompleted || currentPhase === "complete";
  const phaseConfig = PHASE_CONFIGS[currentPhase];
  const phaseTag = t(
    `flow.ui.copy.surge_diagram.phase.${phaseConfig.translationKey}.tag`,
  );
  const phaseCaption = t(
    `flow.ui.copy.surge_diagram.phase.${phaseConfig.translationKey}.caption`,
  );

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
    const nextPhase = getSurgePhase(val);
    const willBeComplete = hasCompleted || nextPhase === "complete";

    if (!hasCompleted && nextPhase === "complete") {
      setHasCompleted(true);
      Haptics.selectionAsync();
      AccessibilityInfo.announceForAccessibility(
        t("flow.ui.copy.surge_diagram.completedAnnouncement"),
      );
    } else if (nextPhase !== prevPhaseRef.current) {
      if (nextPhase === "peak") {
        Haptics.selectionAsync();
      }
      AccessibilityInfo.announceForAccessibility(
        t("flow.ui.copy.surge_diagram.phaseAnnouncement", {
          tag: t(
            `flow.ui.copy.surge_diagram.phase.${PHASE_CONFIGS[nextPhase].translationKey}.tag`,
          ),
          caption: t(
            `flow.ui.copy.surge_diagram.phase.${PHASE_CONFIGS[nextPhase].translationKey}.caption`,
          ),
        }),
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
        title={
          readString(content.title) ?? t("flow.ui.copy.surge_diagram.title")
        }
        instruction={
          readString(content.instruction) ??
          t("flow.ui.copy.surge_diagram.instruction")
        }
      />
      <SurgeDiagramChart
        progress={progress}
        phaseTag={phaseTag}
        phaseCaption={phaseCaption}
        tagColor={phaseConfig.tagColor}
        tagBackground={phaseConfig.tagBg}
        axisLabel={
          readString(content.axisLabel) ??
          t("flow.ui.copy.surge_diagram.axisLabel")
        }
        chartLabel={t("flow.ui.copy.surge_diagram.chartAccessibilityLabel")}
        sliderLabel={t("flow.ui.copy.surge_diagram.sliderAccessibilityLabel")}
        incrementLabel={t(
          "flow.ui.copy.surge_diagram.incrementAccessibilityLabel",
        )}
        decrementLabel={t(
          "flow.ui.copy.surge_diagram.decrementAccessibilityLabel",
        )}
        onValueChange={handleValueChange}
      />

      {/* Completed Takeaway Insight */}
      {isComplete ? (
        <Animated.View
          entering={reduceMotion ? undefined : FadeIn.delay(180).duration(350)}
          className="mt-6 rounded-[20px] bg-[#F5F8F4] px-5 py-4 border border-[#D8E2D5]"
          accessible
          accessibilityRole="summary"
        >
          <Text className="text-[12px] font-bold tracking-widest text-sage-600 mb-1.5 uppercase">
            {readString(content.rule) ??
              t("flow.ui.copy.surge_diagram.patternLabel")}
          </Text>
          <Text className="text-[15px] leading-[22px] text-ink">
            {readString(content.takeaway) ??
              t("flow.ui.copy.surge_diagram.takeaway")}
          </Text>
        </Animated.View>
      ) : null}

      {/* Illustrative Qualifier Footnote */}
      <Text className="happy-font-body mt-4 text-center text-[12px] text-[#8A8A85]">
        {readString(content.note) ?? t("flow.ui.copy.surge_diagram.note")}
      </Text>
    </View>
  );
}
