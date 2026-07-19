import React, { useState, useCallback } from "react";
import { View, Pressable } from "react-native";
import type { NativeSyntheticEvent, TextLayoutEventData } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  BookmarkAdd01Icon,
  BookmarkCheck01Icon,
  Archive01Icon,
} from "@hugeicons/core-free-icons";
import { SAGE, INK, INK_SOFT, INK_MUTED, BRAND_BORDER_STRONG } from "@/lib/tokens";
import type { CopingCard } from "@/src/types/exerciseFlow";
import dayjs from "dayjs";
import { getExerciseIcon } from "@/src/data/exerciseIconRegistry";

const EXERCISE_LABEL: Record<string, string> = {
  thought_catcher: "Thought Catcher",
  thought_reframing: "Thought Reframing",
  gratitude_reframe: "Gratitude Reframe",
  abc_analysis: "ABC Analysis",
  decatastrophizing: "Decatastrophizing",
  worry_time: "Worry Time",
  fear_ladder: "Fear Ladder",
  worry_decision_tree: "Worry Decision Tree",
  recognizing_rumination: "Recognizing Rumination",
  detached_mindfulness: "Detached Mindfulness",
  attention_training: "Attention Training",
  box_breathing: "Box Breathing",
  breathing_478: "4-7-8 Breathing",
  grounding_54321: "5-4-3-2-1 Grounding",
  body_scan_pmr: "Body Scan & PMR",
  mindful_breathing_1min: "Mindful Breathing",
};

const MAX_LINES_COLLAPSED = 5;

interface CopingCardItemProps {
  card: CopingCard;
  onToggleStar: () => void;
  onArchive: () => void;
}

export const CopingCardItem: React.FC<CopingCardItemProps> = React.memo(
  ({ card, onToggleStar, onArchive }) => {
    const [expanded, setExpanded] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const exerciseIcon = getExerciseIcon(card.exercise_type);
    const exerciseLabel =
      EXERCISE_LABEL[card.exercise_type] ?? card.exercise_type;
    const dateLabel = dayjs(card.created_at).format("MMM D");

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
      <View
        className="py-5"
        style={{
          backgroundColor: card.archived
            ? "#F9FAF9"
            : card.starred
              ? SAGE[50]
              : "transparent",
        }}
      >
        {/* Quiet metadata header */}
        <View className="flex-row items-center justify-between mb-3.5">
          <View className="flex-row items-center gap-1.5">
            <HugeiconsIcon icon={exerciseIcon} size={14} color={INK_SOFT} />
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
            {card.reframe_label}
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
              Read more
            </Text>
          )}
          {expanded && isTruncated && (
            <Text className="text-[13px] font-semibold text-sage-600 mt-2.5">
              Show less
            </Text>
          )}
        </Pressable>

        {/* Quiet icon-only footer */}
        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-[12px] font-medium text-ink-muted">
            {card.starred ? "Starred" : ""}
          </Text>
          <View className="flex-row items-center gap-4">
            <Pressable
              onPress={onToggleStar}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={card.starred ? "Unstar card" : "Star card"}
              className="active:opacity-60 p-1.5 rounded-full"
            >
              <HugeiconsIcon
                icon={card.starred ? BookmarkCheck01Icon : BookmarkAdd01Icon}
                size={20}
                color={card.starred ? SAGE[600] : INK_MUTED}
                strokeWidth={card.starred ? 2.2 : 1.8}
              />
            </Pressable>

            <Pressable
              onPress={onArchive}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={card.archived ? "Restore card" : "Archive card"}
              className="active:opacity-60 p-1.5 rounded-full"
            >
              <HugeiconsIcon
                icon={Archive01Icon}
                size={20}
                color={INK_MUTED}
                strokeWidth={1.8}
              />
            </Pressable>
          </View>
        </View>
      </View>
    );
  },
);

CopingCardItem.displayName = "CopingCardItem";
