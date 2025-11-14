import React, { useMemo, useCallback, useRef, useEffect } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import { Feather } from "@expo/vector-icons";
import { EntryCardsView } from "./EntryCardsView";
import { JournalEntry } from "@/hooks/data/types";
import { useBookmarkedJournals } from "@/hooks/journals/useBookmarkedJournals";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";

interface BookmarkedJournalsBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onEntryPress: (entry: JournalEntry) => void;
  onBookmark?: (entry: JournalEntry, isBookmarked: boolean) => void;
}

export const BookmarkedJournalsBottomSheet: React.FC<
  BookmarkedJournalsBottomSheetProps
> = ({ isOpen, onClose, onEntryPress, onBookmark }) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const {
    data: bookmarkedJournals,
    isLoading,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    totalCount,
  } = useBookmarkedJournals();
  const observerTarget = useRef<View>(null);

  // Snap points for bottom sheet - 90% of screen height
  const snapPoints = useMemo(() => ["90%"], []);

  // Refresh data when sheet opens
  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.present();
      refetch();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isOpen, refetch]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    // Only proceed if we have the observer target and there's more data
    if (!observerTarget.current || !hasNextPage || isFetchingNextPage) {
      return;
    }

    // Note: Intersection Observer is not available in React Native
    // We'll implement a scroll-based approach instead
    // This is a placeholder - actual implementation would use onScroll
  }, [hasNextPage, isFetchingNextPage]);

  // Handle manual load more for now
  const handleLoadMore = useCallback((): void => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Render backdrop
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  // Handle sheet changes
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: "#f9fafb" }}
      handleIndicatorStyle={{ backgroundColor: "#FFFFFF" }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-8 border-b border-gray-100">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
            <Feather name="bookmark" size={20} color="#3B82F6" />
          </View>
          <View>
            <Text className="text-xl font-bold text-gray-900">
              Bookmarked Journals
            </Text>
            <Text className="text-sm text-gray-500">
              {totalCount || 0} entries saved
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <BottomSheetScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {isLoading && bookmarkedJournals.length === 0 ? (
          <View className="gap-3 pt-4">
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                className="bg-gray-100 rounded-2xl h-32 animate-pulse"
              />
            ))}
          </View>
        ) : bookmarkedJournals && bookmarkedJournals.length > 0 ? (
          <View className="pt-4">
            <EntryCardsView
              onRefresh={refetch}
              entries={bookmarkedJournals}
              isLoading={false}
              onEntryPress={onEntryPress}
              onBookmark={onBookmark}
              showActions={true}
              showDateHeaders={true}
            />

            {/* Load More Button */}
            {hasNextPage && (
              <View className="mt-6 mb-4" ref={observerTarget}>
                <Button
                  onPress={handleLoadMore}
                  disabled={isFetchingNextPage}
                  className="bg-blue-600 rounded-xl "
                >
                  {isFetchingNextPage ? (
                    <ButtonSpinner color="white" />
                  ) : (
                    <ButtonText className="text-white font-semibold">
                      Load More ({bookmarkedJournals.length} / {totalCount})
                    </ButtonText>
                  )}
                </Button>
              </View>
            )}

            {/* End of List Indicator */}
            {!hasNextPage && bookmarkedJournals.length > 0 && (
              <View className="items-center py-6">
                <View className="h-px bg-gray-200 w-full mb-3" />
                <Text className="text-sm text-gray-400">
                  All {totalCount} bookmarked journals loaded
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View className="items-center justify-center py-20">
            <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
              <Feather name="bookmark" size={40} color="#9CA3AF" />
            </View>
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              No Bookmarked Journals
            </Text>
            <Text className="text-sm text-gray-500 text-center px-8">
              Tap the bookmark icon on any journal entry to save it here for
              quick access
            </Text>
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};
