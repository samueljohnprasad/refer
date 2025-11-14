import React, { useState, useCallback } from "react";
import { useMentalHealthData } from "@/hooks/data/useMentalHealthData";
import { View } from "@/components/ui/view";
import { Text } from "@/components/Themed";
import { Button, ButtonText } from "@/components/ui/button";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";
import { EntryCardsView } from "./EntryCardsView";
import BlurModal from "@/src/components/BlurModal";
import JournalEntryScreen from "../../JournalEntryScreen/JournalEntryScreen";
import { JournalEntry } from "@/hooks/data/types";
import { useJournalOperations } from "@/hooks/journals/useJournalOperations";
import { ConfirmationModal } from "@/src/components/modals/ConfirmationModal";
import { BookmarkedJournalsBottomSheet } from "./BookmarkedJournalsBottomSheet";
import { BottomSheet } from "@/components/ui/bottomsheet";

interface MentalHealthProfileContainerProps {
  selectedDate: Date;
  onRefresh?: () => void;
  showBookmarksModal: boolean;
  setShowBookmarksModal: (show: boolean) => void;
}

export const MentalHealthProfileContainer: React.FC<
  MentalHealthProfileContainerProps
> = ({ selectedDate, showBookmarksModal, setShowBookmarksModal }) => {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  // const [deleteConfirmEntry, setDeleteConfirmEntry] =
  //   useState<JournalEntry | null>(null);
  const [bookmarkingId, setBookmarkingId] = useState<number | null>(null);

  const { deleteJournal, toggleBookmark, deleting } = useJournalOperations();

  const {
    data: insightsResponse,
    isLoading: mentalHealthLoading,
    error,
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
        console.error("[handleBookmarkToggle] Error:", error);
      } finally {
        setBookmarkingId(null);
      }
    },
    [toggleBookmark, selectedDate]
  );

  if (!insightsResponse && !mentalHealthLoading) {
    return (
      <View className="p-4">
        <View className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <Text className="text-red-700">
            Unable to load mental health data. Please try again.
          </Text>
          <Button
            // onClick={handleRefresh}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            <ButtonText>Retry</ButtonText>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <>
      {/* Journal Entries Section */}
      <EntryCardsView
        entries={insightsResponse || []}
        isLoading={mentalHealthLoading}
        onEntryPress={handleEntryPress}
        onBookmark={handleBookmarkToggle}
        onRefresh={() => refetch()}
        bookmarkingId={bookmarkingId}
      />

      {/* Journal Entry Modal */}
      <BlurModal visible={isModalVisible}>
        <JournalEntryScreen
          insights={selectedEntry}
          onClose={() => setIsModalVisible(false)}
        />
      </BlurModal>

      {/* Delete Confirmation Modal */}

      {/* <Portal
        isOpen={true}
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <HStack className="border-2 w-1/3 py-10 gap-4 rounded-lg flex-row justify-center items-center bg-background-0">
          <Text className="text-typography-950">Portal Content</Text>
          <Button
            size="xs"
            className="h-6 px-1 absolute top-2 right-2"
            variant="outline"
          >
            <ButtonIcon />
          </Button>
        </HStack>
      </Portal> */}
      {/* </Portal> */}

      {/* Bookmarked Journals Bottom Sheet */}
      {showBookmarksModal && (
        <BookmarkedJournalsBottomSheet
          isOpen={showBookmarksModal}
          onClose={() => setShowBookmarksModal(false)}
          onEntryPress={(entry) => {
            setSelectedEntry(entry);
            // Keep bookmarks modal open so user can browse multiple entries
            setIsModalVisible(true);
          }}
          onBookmark={handleBookmarkToggle}
        />
      )}
    </>
  );
};
