import React, { useState, useCallback } from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  BookmarkAdd01Icon,
  BookmarkCheck01Icon,
  Archive01Icon,
} from "@hugeicons/core-free-icons";
import { SAGE, INK_SOFT, INK_MUTED, BRAND_BORDER_STRONG } from "@/lib/tokens";
import type { CopingCard } from "@/src/types/exerciseFlow";
import dayjs from "dayjs";

const EXERCISE_EMOJI: Record<string, string> = {
  thought_catcher: "🧠",
  thought_reframing: "✨",
  gratitude_reframe: "🌿",
  abc_analysis: "🧩",
  decatastrophizing: "🔭",
  worry_time: "📋",
  fear_ladder: "🪜",
  worry_decision_tree: "🌳",
  recognizing_rumination: "🔓",
  detached_mindfulness: "☁️",
  attention_training: "🎯",
  box_breathing: "🌬️",
  breathing_478: "🌊",
  grounding_54321: "🌱",
  body_scan_pmr: "💆",
  mindful_breathing_1min: "🍃",
};

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

const MAX_LINES_COLLAPSED = 4;

interface CopingCardItemProps {
  card: CopingCard;
  onToggleStar: () => void;
  onArchive: () => void;
}

export const CopingCardItem: React.FC<CopingCardItemProps> = React.memo(
  ({ card, onToggleStar, onArchive }) => {
    const [expanded, setExpanded] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const emoji = EXERCISE_EMOJI[card.exercise_type] ?? "💡";
    const exerciseLabel =
      EXERCISE_LABEL[card.exercise_type] ?? card.exercise_type;
    const dateLabel = dayjs(card.created_at).format("MMM D");

    const handleToggleExpand = useCallback(() => setExpanded((p) => !p), []);

    const handleTextLayout = useCallback(
      (e: any) => {
        if (!expanded) {
          setIsTruncated(e.nativeEvent.lines.length >= MAX_LINES_COLLAPSED);
        }
      },
      [expanded]
    );

    return (
      <View
        className="rounded-2xl mb-4 bg-brand-surface"
        style={{
          borderWidth: 2,
          borderColor: card.starred ? SAGE[300] : BRAND_BORDER_STRONG,
          borderBottomWidth: 4,
          borderBottomColor: card.starred ? SAGE[400] : BRAND_BORDER_STRONG,
        }}
      >
        {/* Header row */}
        <View className="flex-row items-center px-4 pt-4 pb-2">
          <View className="h-8 w-8 rounded-xl bg-sage-50 items-center justify-center mr-2.5">
            <Text className="text-base">{emoji}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[12px] font-bold text-sage-600 uppercase tracking-wide">
              {exerciseLabel}
            </Text>
            <Text className="text-[11px] text-ink-muted mt-0.5">
              {dateLabel}
            </Text>
          </View>
          {card.starred && (
            <View className="bg-sage-pill px-2 py-0.5 rounded-full">
              <Text className="text-[11px] font-bold text-sage-600">Saved</Text>
            </View>
          )}
        </View>

        <View className="px-4 pb-1">
          <Text className="text-[11px] font-bold text-ink-muted uppercase tracking-widest mb-1">
            {card.reframe_label}
          </Text>
        </View>

        {/* Reframe text */}
        <Pressable
          onPress={handleToggleExpand}
          className="px-4 pb-3 active:opacity-80"
        >
          <Text
            className="text-[16px] text-ink leading-relaxed"
            numberOfLines={expanded ? undefined : MAX_LINES_COLLAPSED}
            onTextLayout={handleTextLayout}
          >
            {card.reframe_text}
          </Text>
          {!expanded && isTruncated && (
            <Text className="text-[13px] font-semibold text-sage-600 mt-1">
              Read more
            </Text>
          )}
          {expanded && isTruncated && (
            <Text className="text-[13px] font-semibold text-sage-600 mt-1">
              Show less
            </Text>
          )}
        </Pressable>

        {/* Action row */}
        <View
          className="flex-row items-center px-4 py-1 border-t"
          style={{ borderTopColor: BRAND_BORDER_STRONG }}
        >
          <Pressable
            onPress={onToggleStar}
            accessibilityRole="button"
            accessibilityLabel={card.starred ? "Unstar" : "Star"}
            className="flex-row items-center gap-1.5 active:opacity-60 mr-2 pr-4 min-h-[44px]"
          >
            <HugeiconsIcon
              icon={card.starred ? BookmarkCheck01Icon : BookmarkAdd01Icon}
              size={16}
              color={card.starred ? SAGE[600] : INK_SOFT}
              strokeWidth={2}
            />
            <Text
              className="text-[13px] font-semibold"
              style={{ color: card.starred ? SAGE[600] : INK_SOFT }}
            >
              {card.starred ? "Starred" : "Star"}
            </Text>
          </Pressable>

          <Pressable
            onPress={onArchive}
            accessibilityRole="button"
            accessibilityLabel={card.archived ? "Restore" : "Archive"}
            className="flex-row items-center gap-1.5 active:opacity-60 px-2 min-h-[44px]"
          >
            <HugeiconsIcon
              icon={Archive01Icon}
              size={16}
              color={INK_MUTED}
              strokeWidth={2}
            />
            <Text className="text-[13px] font-semibold text-ink-muted">
              {card.archived ? "Restore" : "Archive"}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  },
);

CopingCardItem.displayName = "CopingCardItem";
