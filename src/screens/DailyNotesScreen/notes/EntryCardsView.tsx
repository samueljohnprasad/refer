import React, { useState } from "react";
import {
  Pressable,
  Animated,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Text } from "@/components/ui/text";
import { format, parseISO } from "date-fns";
import { Feather } from "@expo/vector-icons";
import { getEntryTypeIcon } from "../../../components/lib/entryTypeUtils";
import { JournalEntry } from "@/hooks/data/types";
import { Image } from "@/components/ui/image";
import { Emotion, emotions } from "@/assets/emojis";
import { FeelingsType } from "@/src/network/genAi";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Bookmark02Icon,
  Delete02Icon,
  Add01Icon,
} from "@hugeicons/core-free-icons";
import { useAtom } from "jotai";
import { DeleteJournal, selectedDateAtom } from "../atoms";
import { getDuration } from "@/src/utils/date";
import { ConfirmationModal } from "@/src/components/modals/ConfirmationModal";
import { search } from "@/assets/images";
import { useRouter } from "expo-router";

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

  const onDismiss = () => {
    setDeleteEntry((prev) => ({
      flag: false,
      entry: null,
      selectedDate: undefined,
    }));
  };
  const onDelete = () => {
    onDismiss();
    onRefresh?.();
  };

  const deleteHandler = (entry: JournalEntry) => {
    setDeleteEntry({
      flag: true,
      entry,
      selectedDate,
    });
  };

  if (isLoading) {
    return (
      <View>
        <Text className="text-lg font-semibold text-gray-800 font-cormorantBold">
          Journal Entries
        </Text>
        <View className="gap-3">
          {[1, 2, 3].map((i) => (
            <View key={i} className="bg-white rounded-2xl p-4  animate-pulse">
              <View className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
              <View className="h-3 bg-gray-200 rounded mb-2 w-1/2" />
              <View className="h-3 bg-gray-200 rounded w-full" />
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View className="bg-white rounded-2xl p-5 border border-gray-100">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <View className="bg-blue-100 p-2 rounded-xl mr-2">
              <Feather name="book-open" size={24} color="#3B82F6" />
            </View>
            <Text className="text-gray-900 font-semibold text-lg">
              Journal Entries
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/tabs/(tabs)/record")}
            className="bg-blue-500 p-2 rounded-xl"
            activeOpacity={0.7}
          >
            <HugeiconsIcon icon={Add01Icon} size={18} color="white" />
          </TouchableOpacity>
        </View>

        <View className="py-4 items-center">
          <Text className="text-gray-400 text-center">
            No entries for today.{"\n"}Tap + to add your first journal!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="bg-blue-100 p-2 rounded-xl mr-2">
            <Feather name="book-open" size={24} color="#3B82F6" />
          </View>
          <Text className="text-gray-900 font-semibold text-lg">
            Journal Entries
          </Text>
          <View className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full">
            <Text className="text-xs font-medium text-gray-500">
              {entries.length}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/tabs/(tabs)/record")}
          className="bg-blue-500 p-2 rounded-xl"
          activeOpacity={0.7}
        >
          <HugeiconsIcon icon={Add01Icon} size={18} color="white" />
        </TouchableOpacity>
      </View>

      <View className="gap-3">
        {entries.map((entry, index) => (
          <View key={entry.id}>
            {showDateHeaders && (
              <Text className="text-sm font-semibold text-gray-600 mb-2">
                {entry.selected_date
                  ? `${format(
                      parseISO(entry.selected_date),
                      "MMM d, yyyy"
                    )} · ${format(parseISO(entry.selected_date), "EEE")}`
                  : "No Date"}
              </Text>
            )}
            <EntryCard
              onDelete={deleteHandler}
              entry={entry}
              onPress={() => onEntryPress(entry)}
              onBookmark={
                onBookmark
                  ? (isBookmarked) => onBookmark(entry, isBookmarked)
                  : undefined
              }
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
  onPress: () => void;
  onDelete?: (entry: JournalEntry) => void;
  onBookmark?: (isBookmarked: boolean) => void;
  showActions?: boolean;
  index: number;
  isBookmarking?: boolean;
}

const EntryCard: React.FC<EntryCardProps> = ({
  entry,
  onPress,
  onDelete,
  onBookmark,
  showActions = true,
  index,
  isBookmarking = false,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, [index]);

  const feelings: FeelingsType[] = entry.journal_ai_insights
    ?.feelings as FeelingsType[];

  // Get bookmark status from entry
  const isBookmarked: boolean = entry.is_bookmarked || false;

  const handleBookmarkPress = (e: { stopPropagation: () => void }): void => {
    e.stopPropagation();
    onBookmark?.(isBookmarked);
  };

  const handleDeletePress = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onDelete?.(entry);
  };

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        className="bg-white rounded-2xl p-4"
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
        }}
      >
        {/* Header */}
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-800 mb-1">
              {entry.title}
            </Text>
            <View className="flex-row items-center">
              {entry.selected_date && (
                <Text className="text-sm text-gray-500">
                  {format(new Date(entry.selected_date), "h:mm a")}
                </Text>
              )}
              <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
              <HugeiconsIcon
                size={12}
                icon={getEntryTypeIcon(entry.input_type)}
              />
              {!!entry.duration_seconds && (
                <Text className="text-sm text-gray-500 ml-1">
                  {getDuration(entry.duration_seconds)}
                </Text>
              )}
              {!!entry.words_count && (
                <>
                  <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
                  <Text className="text-sm text-gray-500">
                    {entry.words_count} words
                  </Text>
                </>
              )}
            </View>
          </View>

          <View className="items-end">
            <Text className="text-2xl mb-1">
              <Image
                source={emotions[entry.moods?.main_mood as Emotion]}
                className="w-6 h-6"
                alt={entry.moods?.main_mood || "-"}
                progressiveRenderingEnabled={true}
              />
            </Text>
          </View>
        </View>

        {/* Excerpt */}
        <Text className="text-gray-700 text-sm leading-5 mb-3">
          {entry.transcripts?.substring(0, 100) + "..."}
        </Text>

        {/* Emotion Tags */}
        <View className="flex-row flex-wrap mb-3">
          {(feelings || []).map((emotion, idx) => (
            <View
              key={`${emotion}-${idx}`}
              className="bg-blue-50 rounded-full px-2 py-1 mr-2 mb-1"
            >
              <Text className="text-blue-700 text-xs font-medium capitalize">
                {emotion.emoji} {emotion.name}
              </Text>
            </View>
          ))}
          {/* {entry.emotions.length > 3 && (
            <View className="bg-gray-100 rounded-full px-2 py-1">
              <Text className="text-gray-600 text-xs">
                +{entry.emotions.length - 3} more
              </Text>
            </View>
          )} */}
        </View>

        {/* Footer */}
        <View className="flex-row items-center justify-between pt-2 border-t border-gray-100">
          <View className="flex-row items-center gap-2">
            {entry.moods?.main_mood && (
              <Text className="text-xs text-gray-500 capitalize">
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
                    <ActivityIndicator size="small" color="#3B82F6" />
                  ) : (
                    <HugeiconsIcon
                      icon={Bookmark02Icon}
                      size={18}
                      fill={isBookmarked ? "#93c5fd" : "#d1d5db"}
                      color={isBookmarked ? "#93c5fd" : "#d1d5db"}
                    />
                  )}
                </Pressable>

                <Pressable
                  onPress={handleDeletePress}
                  className="w-9 h-9 items-center justify-center active:opacity-70"
                  accessibilityLabel="Delete journal"
                >
                  <HugeiconsIcon icon={Delete02Icon} size={18} color="grey" />
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};
