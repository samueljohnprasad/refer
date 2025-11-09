import React, { useState, useCallback } from "react";
import { Pressable } from "react-native";
import { useMentalHealthData } from "@/hooks/data/useMentalHealthData";
import { View } from "@/components/ui/view";
import { Text } from "@/components/Themed";
import { Button, ButtonText } from "@/components/ui/button";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";
import { Feather } from "@expo/vector-icons";
import { EntryCardsView } from "./EntryCardsView";
import BlurModal from "@/src/components/BlurModal";
import JournalEntryScreen from "../../JournalEntryScreen/JournalEntryScreen";
import { JournalEntry } from "@/hooks/data/types";
import { useJournalOperations } from "@/hooks/journals/useJournalOperations";
import { ConfirmationModal } from "@/src/components/modals/ConfirmationModal";
import { BookmarkedJournalsBottomSheet } from "./BookmarkedJournalsBottomSheet";

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
  const [deleteConfirmEntry, setDeleteConfirmEntry] =
    useState<JournalEntry | null>(null);
  const [bookmarkingId, setBookmarkingId] = useState<number | null>(null);

  const toast = useToast();
  const { deleteJournal, toggleBookmark, deleting, bookmarking } =
    useJournalOperations();

  const {
    data: insightsResponse,
    isLoading: mentalHealthLoading,
    error,
    refetch,
  } = useMentalHealthData(selectedDate);

  // Handle entry card press
  const handleEntryPress = useCallback((entry: JournalEntry): void => {
    setSelectedEntry(entry);
    setIsModalVisible(true);
  }, []);

  // Handle delete request
  const handleDeleteRequest = useCallback((entry: JournalEntry): void => {
    setDeleteConfirmEntry(entry);
  }, []);

  // Handle delete confirm
  const handleDeleteConfirm = useCallback(async (): Promise<void> => {
    if (!deleteConfirmEntry) return;

    try {
      if (!deleteConfirmEntry.id) return;
      await deleteJournal({
        journalId: deleteConfirmEntry.id,
        selectedDate,
      });

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="success">
            <ToastTitle>Journal deleted successfully</ToastTitle>
          </Toast>
        ),
      });

      setDeleteConfirmEntry(null);
      refetch();
    } catch (error) {
      console.error("[handleDeleteConfirm] Error:", error);
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle>Failed to delete journal</ToastTitle>
          </Toast>
        ),
      });
    }
  }, [deleteConfirmEntry, deleteJournal, selectedDate, toast, refetch]);

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
        onDelete={handleDeleteRequest}
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
      <ConfirmationModal
        visible={!!deleteConfirmEntry}
        title="Delete Journal?"
        message="This journal entry will be permanently deleted. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmEntry(null)}
        loading={deleting}
        icon="trash-2"
        iconColor="#EF4444"
      />

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
          onDelete={handleDeleteRequest}
          onBookmark={handleBookmarkToggle}
        />
      )}
    </>
  );
};
