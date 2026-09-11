import React, { useState, useCallback, memo } from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { format, parseISO } from "date-fns";
import { LegendList } from "@legendapp/list";
import { JournalEntry } from "@/hooks/data/types";
import { NoteIcon, Mic01Icon } from "@hugeicons/core-free-icons";
import { useAtom } from "jotai";
import { DeleteJournal, selectedDateAtom } from "../atoms";
import { ConfirmationModal } from "@/src/components/modals/ConfirmationModal";
import { useRouter } from "expo-router";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { JournalTabSkeleton } from "./JournalSkeletons";
import { EntryCard } from "./EntryCard";
import { Button } from "@/src/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

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

// ponytail: check if two dates fall on the same day to prevent repeating date header
const isSameDayString = (
  date1?: string | null,
  date2?: string | null
): boolean => {
  if (!date1 || !date2) return false;
  try {
    return (
      format(parseISO(date1), "yyyy-MM-dd") ===
      format(parseISO(date2), "yyyy-MM-dd")
    );
  } catch {
    return false;
  }
};

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
    [selectedDate]
  );

  if (isLoading) {
    return <JournalTabSkeleton />;
  }

  if (entries.length === 0) {
    return (
      <EmptyState
        mascotState="panda-notes"
        mascotSize={102}
        title={[
          "Capture a quick thought",
          "What's on your mind?",
          "Reflect on your day",
        ]}
        description="Private by default. Just start where you are."
        buttonText="Record Voice"
        onButtonPress={() => router.push("/tabs/(tabs)/record")}
        buttonIcon={Mic01Icon}
        secondaryButtonText="Write Text"
        onSecondaryButtonPress={() =>
          router.push("/tabs/screens/keyboard-recorder")
        }
        secondaryButtonIcon={NoteIcon}
        containerClassName="py-2 pb-4"
      />
    );
  }

  const composerFooter = (
    <View className="flex-row items-center gap-2.5 pt-3 pb-6">
      <Button
        label="Record Voice"
        variant="primary"
        size="md"
        className="flex-1"
        onPress={() => router.push("/tabs/(tabs)/record")}
        leftIcon={
          <HugeiconsIcon
            icon={Mic01Icon}
            size={16}
            color={SEMANTIC_COLORS.surface.primary}
          />
        }
      />
      <Button
        label="Write Text"
        variant="secondary"
        size="md"
        className="flex-1"
        onPress={() => router.push("/tabs/screens/keyboard-recorder")}
        leftIcon={
          <HugeiconsIcon
            icon={NoteIcon}
            size={16}
            color={SEMANTIC_COLORS.text.primary}
          />
        }
      />
    </View>
  );

  const combinedFooter = (
    <>
      {composerFooter}
      {ListFooterComponent}
    </>
  );

  return (
    <View className="gap-2.5 flex-1">
      {scrollEnabled ? (
        <LegendList
          data={entries}
          estimatedItemSize={140}
          scrollEnabled={scrollEnabled}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={combinedFooter}
          contentContainerStyle={{ gap: 10, paddingBottom: 40 }}
          keyExtractor={(item: JournalEntry, index: number) =>
            item.id != null
              ? item.id.toString()
              : `${item.selected_date || "entry"}-${index}`
          }
          renderItem={({
            item: entry,
            index,
          }: {
            item: JournalEntry;
            index: number;
          }) => {
            const prevEntry = index > 0 ? entries[index - 1] : null;
            const isFirstOfDate =
              !prevEntry ||
              !isSameDayString(entry.selected_date, prevEntry.selected_date);

            return (
              <View
                key={
                  entry.id != null
                    ? entry.id.toString()
                    : `${entry.selected_date || "entry"}-${index}`
                }
              >
                {showDateHeaders && isFirstOfDate && (
                  <Text className="happy-font-body-bold text-[11px] leading-[15px] uppercase tracking-wide text-ink-muted mb-2 mt-1 px-0.5">
                    {entry.selected_date
                      ? format(
                          parseISO(entry.selected_date),
                          "MMM d, yyyy · EEE"
                        ).toUpperCase()
                      : "NO DATE"}
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
            );
          }}
        />
      ) : (
        <View style={{ gap: 10, paddingBottom: 40 }}>
          {entries.map((entry, index) => {
            const prevEntry = index > 0 ? entries[index - 1] : null;
            const isFirstOfDate =
              !prevEntry ||
              !isSameDayString(entry.selected_date, prevEntry.selected_date);

            return (
              <View
                key={
                  entry.id != null
                    ? entry.id.toString()
                    : `${entry.selected_date || "entry"}-${index}`
                }
              >
                {showDateHeaders && isFirstOfDate && (
                  <Text className="happy-font-body-bold text-[11px] leading-[15px] uppercase tracking-wide text-ink-muted mb-2 mt-1 px-0.5">
                    {entry.selected_date
                      ? format(
                          parseISO(entry.selected_date),
                          "MMM d, yyyy · EEE"
                        ).toUpperCase()
                      : "NO DATE"}
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
            );
          })}
          {combinedFooter}
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
