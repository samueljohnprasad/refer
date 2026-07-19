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
  BookmarkCheck01Icon,
  Delete02Icon,
  NoteIcon,
  Mic01Icon,
} from "@hugeicons/core-free-icons";
import { useAtom } from "jotai";
import { DeleteJournal, selectedDateAtom } from "../atoms";
import { getDuration } from "@/src/utils/date";
import { ConfirmationModal } from "@/src/components/modals/ConfirmationModal";
import { useRouter, Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { BRAND_SURFACE, GOLD, INK_MUTED, SAGE } from "@/lib/tokens";
import { Card } from "@/src/components/ui/Card";
import { JournalTabSkeleton } from "./JournalSkeletons";

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
    return <JournalTabSkeleton />;
  }



  if (entries.length === 0) {
    return (
      <EmptyState
        mascotState="panda-notes"
        title="What's on your mind?"
        description="A private space to capture your thoughts."
        buttonText="Record Voice"
        onButtonPress={() => router.push("/tabs/(tabs)/record")}
        buttonIcon={Mic01Icon}
        secondaryButtonText="Write Text"
        onSecondaryButtonPress={() => router.push("/tabs/screens/keyboard-recorder")}
        secondaryButtonIcon={NoteIcon}
        containerClassName="pb-[120px]"
      />
    );
  }

  return (
    <View className="gap-4 flex-1">
      {scrollEnabled ? (
        <LegendList
          data={entries}
          estimatedItemSize={200}
          scrollEnabled={scrollEnabled}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={ListFooterComponent}
          contentContainerStyle={{ gap: 12, paddingBottom: 100 }}
          keyExtractor={(item: JournalEntry, index: number) =>
            item.id != null ? item.id.toString() : `${item.selected_date || "entry"}-${index}`
          }
          renderItem={({ item: entry, index }: { item: JournalEntry, index: number }) => (
            <View
              key={
                entry.id != null
                  ? entry.id.toString()
                  : `${entry.selected_date || "entry"}-${index}`
              }
            >
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
      ) : (
        <View style={{ gap: 12, paddingBottom: 100 }}>
          {entries.map((entry, index) => (
            <View
              key={
                entry.id != null
                  ? entry.id.toString()
                  : `${entry.selected_date || "entry"}-${index}`
              }
            >
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
          ))}
          {ListFooterComponent}
        </View>
      )}
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

const MOOD_GRADIENTS: { [key: string]: string[] } = {
  terrible: ["#FEE2E2", "#FED7D7"],
  bad: ["#FED7AA", "#FEF3C7"],
  fine: ["#FEF3C7", "#FEFCE8"],
  good: ["#DCFCE7", "#F0FDF4"],
  great: ["#DBEAFE", "#EFF6FF"],
};

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
  
  const currentGradient = MOOD_GRADIENTS[entry.moods?.main_mood || "great"];

  const handleBookmarkPress = useCallback(
    (e: { stopPropagation: () => void }): void => {
      e.stopPropagation();
      onBookmark?.(entry, isBookmarked);
    },
    [onBookmark, entry, isBookmarked],
  );

  const handleDeletePress = useCallback(
    (e: { stopPropagation: () => void }): void => {
      e.stopPropagation();
      onDelete?.(entry);
    },
    [onDelete, entry],
  );

  return (
    <Link href={{ pathname: "/tabs/screens/journal-entry", params: { id: entry.id } }} asChild>
      <Link.Trigger>
        <Pressable
          onPress={() => onPress(entry)}
          accessibilityRole="button"
          accessibilityLabel={`Journal entry: ${entry.title || "Untitled Entry"}, created at ${entry.selected_date ? format(new Date(entry.selected_date), "h:mm a") : ""}`}
          accessibilityHint="Double tap to open journal entry details"
          className="mb-3"
        >
          <Link.AppleZoom>
            <LinearGradient
              colors={currentGradient as [string, string, ...string[]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 16, borderRadius: 20, overflow: "hidden" }}
            >
              {/* Header & Metadata */}
              <View className="mb-2">
                <Text variant="body-bold" className="mb-1">
                  {entry.title || "Untitled Entry"}
                </Text>
                <View className="flex-row items-center flex-wrap">
                  {entry.selected_date && (
                    <Text variant="caption">
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
                    <Text variant="caption" className="ml-1">
                      {getDuration(entry.duration_seconds)}
                    </Text>
                  )}
                  {!!entry.words_count && (
                    <>
                      <View className="w-1 h-1 bg-sage-200 rounded-full mx-2" />
                      <Text variant="caption">
                        {entry.words_count} words
                      </Text>
                    </>
                  )}
                </View>
              </View>

              {/* Excerpt */}
              {!!entry.transcripts && entry.transcripts.trim().length > 0 && (
                <Text variant="body" color="soft" className="leading-5 mt-1" numberOfLines={2}>
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
