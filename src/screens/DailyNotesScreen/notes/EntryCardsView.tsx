import React, { useState, useCallback, memo } from "react";
import {
  Pressable,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { format, parseISO } from "date-fns";
import { getEntryTypeIcon } from "../../../components/lib/entryTypeUtils";
import { JournalEntry } from "@/hooks/data/types";
import { Image } from "@/components/ui/image";
import { Emotion, emotions } from "@/assets/emojis";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { FeelingsType } from "@/src/network/genAi";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Bookmark02Icon,
  Delete02Icon,
  NoteIcon,
  Mic01Icon,
} from "@hugeicons/core-free-icons";
import { useAtom } from "jotai";
import { DeleteJournal, selectedDateAtom } from "../atoms";
import { getDuration } from "@/src/utils/date";
import { ConfirmationModal } from "@/src/components/modals/ConfirmationModal";
import { useRouter } from "expo-router";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { BRAND_SURFACE, GOLD, INK_MUTED, SAGE } from "@/lib/tokens";

interface EntryCardsViewProps {
  entries: JournalEntry[];
  isLoading: boolean;
  onEntryPress: (entry: JournalEntry) => void;
  onBookmark?: (entry: JournalEntry, isBookmarked: boolean) => void;
  onRefresh?: () => void;
  showActions?: boolean;
  bookmarkingId?: number | null;
  showDateHeaders?: boolean;
}

export const EntryCardsView: React.FC<EntryCardsViewProps> = ({
  entries,
  isLoading,
  onEntryPress,
  onBookmark,
  onRefresh,
  showActions = true,
  bookmarkingId = null,
  showDateHeaders = false,
}) => {
  const [selectedDate] = useAtom(selectedDateAtom);
  const router = useRouter();
  const [deleteEntry, setDeleteEntry] = useState<DeleteJournal>({
    flag: false,
    entry: null,
  });

  const onDismiss = useCallback(() => {
    setDeleteEntry({ flag: false, entry: null, selectedDate: undefined });
  }, []);

  const onDelete = useCallback(() => {
    onDismiss();
    onRefresh?.();
  }, [onDismiss, onRefresh]);

  const deleteHandler = useCallback(
    (entry: JournalEntry) => {
      setDeleteEntry({ flag: true, entry, selectedDate });
    },
    [selectedDate],
  );

  if (isLoading) {
    return (
      <View className="gap-4">
        <SectionHeader title="Journal Entries" icon={NoteIcon} />
        <View className="gap-3">
          {[1, 2, 3].map((i) => (
            <View
              key={i}
              className="happy-brand-preview-tile rounded-[24px] p-4"
            >
              <View className="h-4 bg-sage-100 rounded mb-2 w-3/4" />
              <View className="h-3 bg-sage-100 rounded mb-2 w-1/2" />
              <View className="h-3 bg-sage-100 rounded w-full" />
            </View>
          ))}
        </View>
      </View>
    );
  }

  const ctaButton = (
    <TouchableOpacity
      onPress={() => router.push("/tabs/(tabs)/record")}
      className="happy-brand-primary-cta p-2 rounded-xl"
      activeOpacity={0.7}
    >
      <HugeiconsIcon icon={Mic01Icon} size={18} color={BRAND_SURFACE} />
    </TouchableOpacity>
  );

  if (entries.length === 0) {
    return (
      <EmptyState
        mascotState="panda-notes"
        buttonText="Start Journaling"
        onButtonPress={() => router.push("/tabs/(tabs)/record")}
        buttonIcon={Mic01Icon}
      />
    );
  }

  return (
    <View className="gap-4">
      <SectionHeader
        title="Journal Entries"
        icon={NoteIcon}
        count={entries.length}
        rightElement={ctaButton}
      />

      <View className="gap-3">
        {entries.map((entry, index) => (
          <View key={entry.id}>
            {showDateHeaders && (
              <Text className="happy-font-body-bold text-sm text-ink-muted mb-2">
                {entry.selected_date
                  ? `${format(parseISO(entry.selected_date), "MMM d, yyyy")} · ${format(parseISO(entry.selected_date), "EEE")}`
                  : "No Date"}
              </Text>
            )}
            <EntryCard
              onDelete={deleteHandler}
              entry={entry}
              onPress={onEntryPress}
              onBookmark={onBookmark}
              showActions={showActions}
              index={index}
              isBookmarking={bookmarkingId === entry.id}
            />
          </View>
        ))}
      </View>
      <ConfirmationModal
        deleteEntry={deleteEntry}
        onDismiss={onDismiss}
        title="Delete Journal?"
        message="This journal entry will be permanently deleted. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
        onDelete={onDelete}
      />
    </View>
  );
};

interface EntryCardProps {
  entry: JournalEntry;
  onPress: (entry: JournalEntry) => void;
  onDelete?: (entry: JournalEntry) => void;
  onBookmark?: (entry: JournalEntry, isBookmarked: boolean) => void;
  showActions?: boolean;
  index: number;
  isBookmarking?: boolean;
}

const EntryCard: React.FC<EntryCardProps> = memo(function EntryCard({
  entry,
  onPress,
  onDelete,
  onBookmark,
  showActions = true,
  index,
  isBookmarking = false,
}) {
  // Reanimated shared values — run on UI thread, zero JS-thread overhead during scroll
  const scaleAnim = useSharedValue(1);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const handlePressIn = useCallback(() => {
    scaleAnim.value = withSpring(0.97, { damping: 20, stiffness: 300 });
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    scaleAnim.value = withSpring(1, { damping: 20, stiffness: 300 });
  }, [scaleAnim]);

  const feelings: FeelingsType[] = entry.journal_ai_insights
    ?.feelings as FeelingsType[];

  // Get bookmark status from entry
  const isBookmarked: boolean = entry.is_bookmarked || false;

  const handleBookmarkPress = useCallback(
    (e: { stopPropagation: () => void }): void => {
      e.stopPropagation();
      onBookmark?.(entry, isBookmarked);
    },
    [onBookmark, entry, isBookmarked],
  );

  const handleDeletePress = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onDelete?.(entry);
    },
    [onDelete, entry],
  );

  return (
    <Pressable
      onPress={() => onPress(entry)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={cardAnimatedStyle}>
        <View
          className="happy-brand-preview-tile rounded-[24px] p-4"
          shouldRasterizeIOS
          renderToHardwareTextureAndroid
        >
          {/* Header */}
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1">
              <Text className="happy-font-body-bold text-base text-ink mb-1">
                {entry.title}
              </Text>
              <View className="flex-row items-center">
                {entry.selected_date && (
                  <Text className="happy-font-body-medium text-sm text-ink-muted">
                    {format(new Date(entry.selected_date), "h:mm a")}
                  </Text>
                )}
                <View className="w-1 h-1 bg-sage-200 rounded-full mx-2" />
                <HugeiconsIcon
                  size={12}
                  icon={getEntryTypeIcon(entry.input_type)}
                  color={INK_MUTED}
                />
                {!!entry.duration_seconds && (
                  <Text className="happy-font-body-medium text-sm text-ink-muted ml-1">
                    {getDuration(entry.duration_seconds)}
                  </Text>
                )}
                {!!entry.words_count && (
                  <>
                    <View className="w-1 h-1 bg-sage-200 rounded-full mx-2" />
                    <Text className="happy-font-body-medium text-sm text-ink-muted">
                      {entry.words_count} words
                    </Text>
                  </>
                )}
              </View>
            </View>

            <View className="items-end justify-center mb-1">
              <Image
                source={emotions[entry.moods?.main_mood as Emotion]}
                className="w-6 h-6 opacity-60"
                alt={entry.moods?.main_mood || "-"}
                progressiveRenderingEnabled={true}
              />
            </View>
          </View>

          {/* Excerpt */}
          <Text className="happy-font-body-medium text-ink-soft text-sm leading-5 mb-3">
            {entry.transcripts?.substring(0, 100) + "..."}
          </Text>

          {/* Emotion Tags */}
          <View className="flex-row flex-wrap mb-3">
            {(feelings || []).map((emotion, idx) => (
              <View
                key={`${emotion}-${idx}`}
                className="bg-sage-50 border border-sage-100 rounded-full px-2 py-1 mr-2 mb-1"
              >
                <Text className="happy-font-body-medium text-ink-soft text-xs capitalize">
                  {emotion.emoji} {emotion.name}
                </Text>
              </View>
            ))}
          </View>

          {/* Footer */}
          <View className="flex-row items-center justify-between pt-2 border-t border-sage-100">
            <View className="flex-row items-center gap-2">
              {entry.moods?.main_mood && (
                <Text className="happy-font-body-medium text-xs text-ink-muted capitalize">
                  {entry.moods?.main_mood} mood
                </Text>
              )}
            </View>
            <View className="flex-row items-center gap-2 ">
              {showActions && (
                <>
                  <Pressable
                    onPress={handleBookmarkPress}
                    className="w-9 h-9 items-center justify-center active:opacity-70"
                    accessibilityLabel={
                      isBookmarked ? "Remove bookmark" : "Bookmark"
                    }
                    disabled={isBookmarking}
                  >
                    {isBookmarking ? (
                      <ActivityIndicator size="small" color={GOLD} />
                    ) : (
                      <HugeiconsIcon
                        icon={Bookmark02Icon}
                        size={18}
                        fill={isBookmarked ? GOLD : SAGE[200]}
                        color={isBookmarked ? GOLD : SAGE[200]}
                      />
                    )}
                  </Pressable>

                  <Pressable
                    onPress={handleDeletePress}
                    className="w-9 h-9 items-center justify-center active:opacity-70"
                    accessibilityLabel="Delete journal"
                  >
                    <HugeiconsIcon
                      icon={Delete02Icon}
                      size={18}
                      color={INK_MUTED}
                    />
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
});
