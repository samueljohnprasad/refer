import React, { useCallback, memo } from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { format } from "date-fns";
import { getEntryTypeIcon } from "../../../components/lib/entryTypeUtils";
import { JournalEntry } from "@/hooks/data/types";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Mic01Icon } from "@hugeicons/core-free-icons";
import { getDuration } from "@/src/utils/date";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

export interface EntryCardProps {
  entry: JournalEntry;
  onPress: (entry: JournalEntry) => void;
  onDelete?: (entry: JournalEntry) => void;
  onBookmark?: (entry: JournalEntry, isBookmarked: boolean) => void;
  showActions?: boolean;
  index: number;
  isBookmarking?: boolean;
}

export const MOOD_GRADIENTS: Record<string, string[]> = {
  terrible: ["#FEE2E2", "#FED7D7"],
  bad: ["#FED7AA", "#FEF3C7"],
  fine: ["#FEF3C7", "#FEFCE8"],
  good: ["#DCFCE7", "#F0FDF4"],
  great: ["#DBEAFE", "#EFF6FF"],
};

// ponytail: single entry card with emotion tint, 2-line excerpt, and quiet audio metadata
export const EntryCard: React.FC<EntryCardProps> = memo(function EntryCard({
  entry,
  onPress,
  onDelete,
  onBookmark,
  showActions = true,
  index,
  isBookmarking = false,
}) {
  const isBookmarked: boolean = entry.is_bookmarked || false;
  const currentGradient = MOOD_GRADIENTS[entry.moods?.main_mood || "great"] || MOOD_GRADIENTS.great;

  const handleBookmarkPress = useCallback(
    (e: { stopPropagation: () => void }): void => {
      e.stopPropagation();
      onBookmark?.(entry, isBookmarked);
    },
    [onBookmark, entry, isBookmarked]
  );

  const handleDeletePress = useCallback(
    (e: { stopPropagation: () => void }): void => {
      e.stopPropagation();
      onDelete?.(entry);
    },
    [onDelete, entry]
  );

  return (
    <Link href={{ pathname: "/tabs/screens/journal-entry", params: { id: entry.id } }} asChild>
      <Link.Trigger>
        <Pressable
          onPress={() => onPress(entry)}
          accessibilityRole="button"
          accessibilityLabel={`Journal entry: ${entry.title || "Untitled Entry"}, created at ${
            entry.selected_date ? format(new Date(entry.selected_date), "h:mm a") : ""
          }`}
          accessibilityHint="Double tap to open journal entry details"
          className="w-full active:opacity-85 active:scale-[0.99]"
        >
          <Link.AppleZoom>
            <LinearGradient
              colors={currentGradient as [string, string, ...string[]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingVertical: 13,
                paddingHorizontal: 15,
                borderRadius: 16,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.04)",
              }}
            >
              {/* Header: Title */}
              <Text
                color="ink"
                className="happy-font-body-bold text-[16px] leading-[21px] text-ink mb-1"
              >
                {entry.title || "Untitled Entry"}
              </Text>

              {/* Metadata: Time · 🎙 Duration / Words */}
              <View className="flex-row items-center flex-wrap mb-1.5">
                {entry.selected_date && (
                  <Text className="happy-font-body text-[13px] leading-[17px] text-ink-muted">
                    {format(new Date(entry.selected_date), "h:mm a")}
                  </Text>
                )}
                {!!entry.duration_seconds && (
                  <>
                    <Text className="happy-font-body text-[13px] text-ink-muted mx-1.5">·</Text>
                    <HugeiconsIcon
                      size={12}
                      icon={Mic01Icon}
                      color={SEMANTIC_COLORS.text.secondary}
                    />
                    <Text className="happy-font-body text-[13px] leading-[17px] text-ink-muted ml-1">
                      {getDuration(entry.duration_seconds)}
                    </Text>
                  </>
                )}
                {!!entry.words_count && !entry.duration_seconds && (
                  <>
                    <Text className="happy-font-body text-[13px] text-ink-muted mx-1.5">·</Text>
                    <Text className="happy-font-body text-[13px] leading-[17px] text-ink-muted">
                      {entry.words_count} words
                    </Text>
                  </>
                )}
              </View>

              {/* Excerpt: high contrast, exactly 2 lines */}
              {!!entry.transcripts && entry.transcripts.trim().length > 0 && (
                <Text
                  className="happy-font-body text-[14px] leading-[20px] text-ink-secondary/90 mt-0.5"
                  numberOfLines={2}
                >
                  {entry.transcripts.trim()}
                </Text>
              )}
            </LinearGradient>
          </Link.AppleZoom>
        </Pressable>
      </Link.Trigger>
    </Link>
  );
});

EntryCard.displayName = "EntryCard";
