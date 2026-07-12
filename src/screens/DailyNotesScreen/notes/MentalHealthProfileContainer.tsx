import React, { useState, useCallback, memo } from "react";
import { useMentalHealthData } from "@/hooks/data/useMentalHealthData";
import { View } from "@/components/ui/view";
import { Text } from "@/components/Themed";
import { Button } from "@/src/components/ui/Button";
import { Mascot } from "@/src/components/ui/Mascot";
import { EntryCardsView } from "./EntryCardsView";
import BlurModal from "@/src/components/BlurModal";
import { JournalEntry } from "@/hooks/data/types";
import { useJournalOperations } from "@/hooks/journals/useJournalOperations";
import SuspensLoader from "@/src/components/SuspensLoader";

import JournalEntryScreen from "../../JournalEntryScreen/JournalEntryScreen";
import { BookmarkedJournalsBottomSheet } from "./BookmarkedJournalsBottomSheet";

interface MentalHealthProfileContainerProps {
  selectedDate: Date;
  onRefresh?: () => void;
  showBookmarksModal: boolean;
  setShowBookmarksModal: (show: boolean) => void;
}

const MentalHealthProfileContainerComponent: React.FC<
  MentalHealthProfileContainerProps
> = ({ selectedDate, showBookmarksModal, setShowBookmarksModal }) => {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
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
    setSelectedEntry(entry);
    setIsModalVisible(true);
  }, []);

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

  const handleCloseModal = useCallback(() => setIsModalVisible(false), []);

  const handleCloseBookmarks = useCallback(
    () => setShowBookmarksModal(false),
    [setShowBookmarksModal]
  );

  const handleBookmarkEntryPress = useCallback((entry: JournalEntry) => {
    setSelectedEntry(entry);
    // Keep bookmarks modal open so user can browse multiple entries
    setIsModalVisible(true);
  }, []);

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
          Taking a momentary pause
        </Text>
        <Text className="happy-font-body text-sm text-ink-muted text-center px-8 mb-8 leading-relaxed">
          We couldn't reach your journal entries right now. Don't worry—your notes are safely saved on your device.
        </Text>
        <View className="px-12 self-stretch w-full max-w-sm">
          <Button
            label="Try Reconnecting"
            variant="primary"
            size="lg"
            onPress={handleRefetch}
            loading={isRefetching || mentalHealthLoading}
            accessibilityLabel="Try Reconnecting to load journal entries"
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

      <BlurModal visible={isModalVisible}>
        <SuspensLoader>
          <JournalEntryScreen
            insights={selectedEntry}
            onClose={handleCloseModal}
          />
        </SuspensLoader>
      </BlurModal>

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
