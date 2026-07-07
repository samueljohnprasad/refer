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
import { Text } from "@/src/components/ui/Text";
import { format, parseISO } from "date-fns";
import { LegendList } from "@legendapp/list";
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
import { Card } from "@/src/components/ui/Card";

interface EntryCardsViewProps {
  entries: JournalEntry[];
  isLoading: boolean;
  onEntryPress: (entry: JournalEntry) => void;
  onBookmark?: (entry: JournalEntry, isBookmarked: boolean) => void;
  onRefresh?: () => void;
  showActions?: boolean;
  bookmarkingId?: number | null;
  showDateHeaders?: boolean;
  scrollEnabled?: boolean;
  onEndReached?: () => void;
  ListFooterComponent?: React.ReactElement | null;
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
  scrollEnabled = false,
  onEndReached,
  ListFooterComponent,
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
              className="py-4 border-b border-sage-100/50"
            >
              <View className="h-4 bg-sage-100/50 rounded mb-3 w-2/3" />
              <View className="h-3 bg-sage-100/50 rounded mb-2 w-full" />
              <View className="h-3 bg-sage-100/50 rounded w-4/5" />
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
        title="What's on your mind today?"
        description="Write down your thoughts or record an audio note. A safe space just for you."
        buttonText="Start Journaling"
        onButtonPress={() => router.push("/tabs/(tabs)/record")}
        buttonIcon={Mic01Icon}
      />
    );
  }

  return (
    <View className="gap-4 flex-1">
      <SectionHeader
        title="Journal Entries"
        icon={NoteIcon}
        count={entries.length}
        rightElement={ctaButton}
      />

      <LegendList
        data={entries}
        estimatedItemSize={200}
        scrollEnabled={scrollEnabled}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={ListFooterComponent}
        contentContainerStyle={{ gap: 12 }}
        keyExtractor={(item: JournalEntry) => item.id ? item.id.toString() : Math.random().toString()}
        renderItem={({ item: entry, index }: { item: JournalEntry, index: number }) => (
          <View key={entry.id}>
            {showDateHeaders && (
              <Text variant="label" color="muted" className="mb-2">
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
        )}
      />
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
      className="py-4 border-b border-sage-100/50"
    >
      {/* Header & Metadata */}
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <Text variant="body-bold" className="mb-1">
            {entry.title}
          </Text>
          <View className="flex-row items-center">
            {entry.selected_date && (
              <Text variant="caption-muted">
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
              <Text variant="caption-muted" className="ml-1">
                {getDuration(entry.duration_seconds)}
              </Text>
            )}
            {!!entry.words_count && (
              <>
                <View className="w-1 h-1 bg-sage-200 rounded-full mx-2" />
                <Text variant="caption-muted">
                  {entry.words_count} words
                </Text>
              </>
            )}
          </View>
        </View>

        <View className="flex-row items-center gap-1">
          {isBookmarked && (
            <HugeiconsIcon
              icon={Bookmark02Icon}
              size={16}
              fill={GOLD}
              color={GOLD}
            />
          )}
          {entry.moods?.main_mood && (
            <Image
              source={emotions[entry.moods.main_mood as Emotion]}
              className="w-5 h-5 opacity-80"
              alt={entry.moods.main_mood}
              progressiveRenderingEnabled={true}
            />
          )}
        </View>
      </View>

      {/* Excerpt */}
      <Text variant="body" color="soft" className="leading-5" numberOfLines={2}>
        {entry.transcripts || "No content"}
      </Text>
    </Pressable>
  );
});
