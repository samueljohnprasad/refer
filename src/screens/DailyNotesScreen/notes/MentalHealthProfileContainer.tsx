import React, { useState, useCallback, memo } from "react";
import { useMentalHealthData } from "@/hooks/data/useMentalHealthData";
import { View } from "@/components/ui/view";
import { Text } from "@/components/Themed";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Icon, AlertCircleIcon } from "@/components/ui/icon";
import { EntryCardsView } from "./EntryCardsView";
import BlurModal from "@/src/components/BlurModal";
import { JournalEntry } from "@/hooks/data/types";
import { useJournalOperations } from "@/hooks/journals/useJournalOperations";
import SuspensLoader from "@/src/components/SuspensLoader";

const JournalEntryScreen = React.lazy(
  () => import("../../JournalEntryScreen/JournalEntryScreen")
);
const BookmarkedJournalsBottomSheet = React.lazy(() =>
  import("./BookmarkedJournalsBottomSheet").then((module) => ({
    default: module.BookmarkedJournalsBottomSheet,
  }))
);

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

  if (true) {
    return (
      <View className="p-4 flex-1">
        <Center className="h-64">
          <VStack space="md" className="items-center">
            <Icon as={AlertCircleIcon} className="text-theme-text-secondary h-12 w-12 opacity-60" />
            <Text className="text-theme-text-secondary text-center px-8">
              Unable to load mental health data. Please try again.
            </Text>
            <Button
              onPress={handleRefetch}
              className="bg-theme-purple-primary rounded-full"
            >
              <ButtonText className="text-white font-semibold">Retry</ButtonText>
            </Button>
          </VStack>
        </Center>
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
