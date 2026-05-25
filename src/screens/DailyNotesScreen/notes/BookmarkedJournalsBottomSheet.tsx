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
import { BRAND_SURFACE, INK_MUTED, SAGE } from "@/lib/tokens";

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
      backgroundStyle={{ backgroundColor: BRAND_SURFACE, borderRadius: 32 }}
      handleIndicatorStyle={{ backgroundColor: SAGE[200], width: 48 }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-sage-100 px-6 py-8">
        <View className="flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-sage-50">
            <Feather name="bookmark" size={22} color={SAGE[600]} />
          </View>
          <View>
            <Text className="happy-font-heading-bold text-[30px] leading-9 text-ink">
              Bookmarked Journals
            </Text>
            <Text className="happy-font-body-medium text-[15px] text-ink-muted">
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
                className="h-32 animate-pulse rounded-[24px] bg-sage-50"
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
                  className="happy-brand-primary-cta rounded-[18px]"
                >
                  {isFetchingNextPage ? (
                    <ButtonSpinner color={BRAND_SURFACE} />
                  ) : (
                    <ButtonText className="happy-font-body-bold text-white">
                      Load More ({bookmarkedJournals.length} / {totalCount})
                    </ButtonText>
                  )}
                </Button>
              </View>
            )}

            {/* End of List Indicator */}
            {!hasNextPage && bookmarkedJournals.length > 0 && (
              <View className="items-center py-6">
                <View className="mb-3 h-px w-full bg-sage-100" />
                <Text className="happy-font-body-medium text-sm text-ink-muted">
                  All {totalCount} bookmarked journals loaded
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View className="items-center justify-center py-20">
            <View className="mb-5 h-24 w-24 items-center justify-center rounded-[30px] bg-sage-50">
              <Feather name="bookmark" size={42} color={INK_MUTED} />
            </View>
            <Text className="happy-font-body-bold mb-2 text-[20px] text-ink">
              No Bookmarked Journals
            </Text>
            <Text className="happy-font-body-medium px-8 text-center text-[15px] leading-6 text-ink-muted">
              Tap the bookmark icon on any journal entry to save it here for
              quick access
            </Text>
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};
