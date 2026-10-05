import React, { useState, useCallback } from "react";
import { View, Pressable } from "react-native";
import type { NativeSyntheticEvent, TextLayoutEventData } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import type { CopingCard } from "@/src/types/exerciseFlow";
import { ExerciseIcon } from "@/src/components/exercise/ExerciseIcon";
import { useTranslation } from "react-i18next";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";

const REFRAME_LABEL_KEYS = {
  thought_catcher: "copingCards.reframeLabels.balancedThought",
  thought_reframing: "copingCards.reframeLabels.balancedPerspective",
  gratitude_reframe: "copingCards.reframeLabels.gratitudeReflection",
  abc_analysis: "copingCards.reframeLabels.moreBalancedThought",
  decatastrophizing: "copingCards.reframeLabels.copingPlan",
  detached_mindfulness: "copingCards.reframeLabels.observedThought",
} as const;

const EXERCISE_LABEL_KEYS = {
  thought_catcher: "copingCards.exerciseTypes.thought_catcher",
  thought_reframing: "copingCards.exerciseTypes.thought_reframing",
  gratitude_reframe: "copingCards.exerciseTypes.gratitude_reframe",
  abc_analysis: "copingCards.exerciseTypes.abc_analysis",
  decatastrophizing: "copingCards.exerciseTypes.decatastrophizing",
  worry_time: "copingCards.exerciseTypes.worry_time",
  fear_ladder: "copingCards.exerciseTypes.fear_ladder",
  worry_decision_tree: "copingCards.exerciseTypes.worry_decision_tree",
  recognizing_rumination: "copingCards.exerciseTypes.recognizing_rumination",
  detached_mindfulness: "copingCards.exerciseTypes.detached_mindfulness",
  attention_training: "copingCards.exerciseTypes.attention_training",
  box_breathing: "copingCards.exerciseTypes.box_breathing",
  breathing_478: "copingCards.exerciseTypes.breathing_478",
  grounding_54321: "copingCards.exerciseTypes.grounding_54321",
  body_scan_pmr: "copingCards.exerciseTypes.body_scan_pmr",
  mindful_breathing_1min: "copingCards.exerciseTypes.mindful_breathing_1min",
};

const MAX_LINES_COLLAPSED = 5;

interface CopingCardItemProps {
  card: CopingCard;
}

export const CopingCardItem: React.FC<CopingCardItemProps> = React.memo(
  ({ card }) => {
    const { i18n, t } = useTranslation("exercises");
    const translateCopy = useExerciseCopy();
    const [expanded, setExpanded] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const exerciseLabelKey =
      EXERCISE_LABEL_KEYS[card.exercise_type as keyof typeof EXERCISE_LABEL_KEYS];
    const exerciseLabel = t(
      exerciseLabelKey ?? "copingCards.exerciseTypes.unknown",
      { defaultValue: card.exercise_type },
    );
    const dateLabel = new Intl.DateTimeFormat(i18n.language, {
      month: "short",
      day: "numeric",
    }).format(new Date(card.created_at));

    const handleToggleExpand = useCallback(() => setExpanded((p) => !p), []);

    const handleTextLayout = useCallback(
      (e: NativeSyntheticEvent<TextLayoutEventData>) => {
        if (!expanded) {
          const lines = e.nativeEvent.lines;
          const hasMoreThanMax = lines.length > MAX_LINES_COLLAPSED;
          const isAtMaxAndTruncated =
            lines.length === MAX_LINES_COLLAPSED &&
            (lines[4]?.text.trim().endsWith("...") || card.reframe_text.length > 180);
          setIsTruncated(hasMoreThanMax || isAtMaxAndTruncated);
        }
      },
      [expanded, card.reframe_text]
    );

    return (
      <View className="py-5 px-5">
        {/* Quiet metadata header */}
        <View className="flex-row items-center justify-between mb-3.5">
          <View className="flex-row items-center gap-1.5">
            <ExerciseIcon type={card.exercise_type} size={15} color={SEMANTIC_COLORS.text.secondary} />
            <Text className="text-[12px] font-semibold text-ink-soft tracking-wide">
              {exerciseLabel}
            </Text>
          </View>
          <Text className="text-[12px] text-ink-muted font-medium">
            {dateLabel}
          </Text>
        </View>

        {/* Optional label if user assigned or exercise created one */}
        {card.reframe_label ? (
          <Text className="text-[13px] font-semibold text-sage-700 mb-2">
            {t(
              REFRAME_LABEL_KEYS[card.exercise_type as keyof typeof REFRAME_LABEL_KEYS]
                ?? "copingCards.reframeLabels.default",
              { defaultValue: translateCopy(card.reframe_label) },
            )}
          </Text>
        ) : null}

        {/* Reframe text hero */}
        <Pressable
          onPress={handleToggleExpand}
          className="active:opacity-85"
        >
          <Text
            className="text-[17px] text-ink font-normal leading-[26px]"
            numberOfLines={expanded ? undefined : MAX_LINES_COLLAPSED}
            onTextLayout={handleTextLayout}
          >
            {card.reframe_text}
          </Text>
          {!expanded && isTruncated && (
            <Text className="text-[13px] font-semibold text-sage-600 mt-2.5">
              {t("copingCards.readMore")}
            </Text>
          )}
          {expanded && isTruncated && (
            <Text className="text-[13px] font-semibold text-sage-600 mt-2.5">
              {t("copingCards.showLess")}
            </Text>
          )}
        </Pressable>

      </View>
    );
  },
);

CopingCardItem.displayName = "CopingCardItem";
