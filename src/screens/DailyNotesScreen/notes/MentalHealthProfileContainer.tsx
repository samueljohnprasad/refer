import React, { useState, useCallback, memo } from "react";
import { useSetAtom } from "jotai";
import { useRouter } from "expo-router";
import { selectedJournalEntryAtom } from "@/src/atoms/journalEntryAtom";
import { useMentalHealthData } from "@/hooks/data/useMentalHealthData";
import { View } from "@/components/ui/view";
import { Text } from "@/components/Themed";
import { Button } from "@/src/components/ui/Button";
import { Mascot } from "@/src/components/ui/Mascot";
import { EntryCardsView } from "./EntryCardsView";
import { JournalEntry } from "@/hooks/data/types";
import { useJournalOperations } from "@/hooks/journals/useJournalOperations";
import SuspensLoader from "@/src/components/SuspensLoader";

import { BookmarkedJournalsBottomSheet } from "./BookmarkedJournalsBottomSheet";
import { useTranslation } from "react-i18next";

interface MentalHealthProfileContainerProps {
  selectedDate: Date;
  onRefresh?: () => void;
  showBookmarksModal: boolean;
  setShowBookmarksModal: (show: boolean) => void;
}

const MentalHealthProfileContainerComponent: React.FC<
  MentalHealthProfileContainerProps
> = ({ selectedDate, showBookmarksModal, setShowBookmarksModal }) => {
  const { t } = useTranslation("journal");
  const router = useRouter();
  const setSelectedJournalEntry = useSetAtom(selectedJournalEntryAtom);
  const [bookmarkingId, setBookmarkingId] = useState<number | null>(null);

  const { toggleBookmark } = useJournalOperations();

  const {
    data: insightsResponse,
    isLoading: mentalHealthLoading,
    isRefetching,
    isError,
    refetch,
  } = useMentalHealthData(selectedDate);

  const handleEntryPress = useCallback((entry: JournalEntry): void => {
    setSelectedJournalEntry(entry);
    // Routing is now handled declaratively by EntryCard's <Link>
  }, [setSelectedJournalEntry]);

  // Handle bookmark toggle
  const handleBookmarkToggle = useCallback(
    async (entry: JournalEntry, isBookmarked: boolean): Promise<void> => {
      if (!entry.id) return;
      setBookmarkingId(entry.id);
      try {
        await toggleBookmark({
          journalId: entry.id,
          isBookmarked,
          selectedDate,
        });
        // React Query will automatically update the cache
      } catch (error) {
        console.error("Failed to toggle bookmark:", error);
      } finally {
        setBookmarkingId(null);
      }
    },
    [toggleBookmark, selectedDate]
  );

  // Memoize callbacks to prevent re-renders
  const handleRefetch = useCallback(() => refetch(), [refetch]);

  const handleCloseBookmarks = useCallback(
    () => setShowBookmarksModal(false),
    [setShowBookmarksModal]
  );

  const handleBookmarkEntryPress = useCallback((entry: JournalEntry) => {
    setSelectedJournalEntry(entry);
    // Routing is now handled declaratively by EntryCard's <Link>
  }, [setSelectedJournalEntry]);

  if ((!insightsResponse && !mentalHealthLoading) || isError) {
    return (
      <View
        className="p-6 flex-1 items-center justify-center min-h-[420px]"
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
      >
        <View className="h-44 w-44 items-center justify-center rounded-[44px] mb-4">
          <Mascot state="panda-pillow-hug" size={156} />
        </View>
        <Text className="happy-font-heading-bold text-xl text-ink text-center mb-2 px-6">
          {t("error.title")}
        </Text>
        <Text className="happy-font-body text-sm text-ink-muted text-center px-8 mb-8 leading-relaxed">
          {t("error.description")}
        </Text>
        <View className="px-12 self-stretch w-full max-w-sm">
          <Button
            label={t("error.reconnect")}
            variant="primary"
            size="lg"
            onPress={handleRefetch}
            loading={isRefetching || mentalHealthLoading}
            accessibilityLabel={t("error.reconnectA11y")}
          />
        </View>
      </View>
    );
  }

  return (
    <>
      <EntryCardsView
        entries={insightsResponse || []}
        isLoading={mentalHealthLoading}
        onEntryPress={handleEntryPress}
        onBookmark={handleBookmarkToggle}
        onRefresh={handleRefetch}
        bookmarkingId={bookmarkingId}
      />

      {showBookmarksModal && (
        <SuspensLoader>
          <BookmarkedJournalsBottomSheet
            isOpen={showBookmarksModal}
            onClose={handleCloseBookmarks}
            onEntryPress={handleBookmarkEntryPress}
            onBookmark={handleBookmarkToggle}
          />
        </SuspensLoader>
      )}
    </>
  );
};

// Memoize component to prevent re-renders during parent animations
export const MentalHealthProfileContainer = memo(
  MentalHealthProfileContainerComponent,
  (prev, next) =>
    prev.selectedDate.getTime() === next.selectedDate.getTime() &&
    prev.showBookmarksModal === next.showBookmarksModal
);
