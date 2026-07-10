import React, { useCallback } from "react";
import { View, Modal, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import { Feather } from "@expo/vector-icons";
import { EntryCardsView } from "./EntryCardsView";
import { JournalEntry } from "@/hooks/data/types";
import { useBookmarkedJournals } from "@/hooks/journals/useBookmarkedJournals";
import { Host, BottomSheet, Group, RNHostView } from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";
import { BRAND_SURFACE, INK_MUTED, SAGE } from "@/lib/tokens";
import { SkeletonList } from "@/src/components/ui/Skeleton";

interface BookmarkedJournalsBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onEntryPress: (entry: JournalEntry) => void;
  onBookmark?: (entry: JournalEntry, isBookmarked: boolean) => void;
}

export const BookmarkedJournalsBottomSheet: React.FC<
  BookmarkedJournalsBottomSheetProps
> = ({ isOpen, onClose, onEntryPress, onBookmark }) => {
  const {
    data: bookmarkedJournals,
    isLoading,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    totalCount,
  } = useBookmarkedJournals();

  // Handle manual load more for now
  const handleLoadMore = useCallback((): void => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Host>
        <BottomSheet
          isPresented={isOpen}
          onIsPresentedChange={(val: boolean) => {
            if (!val) {
              onClose();
            }
          }}
        >
          <Group
            modifiers={[
              presentationDetents([{ fraction: 0.9 }]),
              presentationDragIndicator("visible"),
            ]}
          >
            <RNHostView>
              <View className="flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between border-b border-sage-100 px-6 py-6 pt-5">
                  <View className="flex-row items-center gap-3">
                    <View className="h-12 w-12 items-center justify-center rounded-full bg-sage-50">
                      <Feather name="bookmark" size={22} color={SAGE[600]} />
                    </View>
                    <View>
                      <Text className="happy-font-heading-bold text-[30px] leading-9 text-ink">
                        Bookmarked Journals
                      </Text>
                      <Text className="happy-font-body-medium text-[15px] text-ink/80">
                        {totalCount || 0} entries saved
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Content */}
                <View className="flex-1 px-6 pb-6">
                  {isLoading && bookmarkedJournals.length === 0 ? (
                    <SkeletonList count={3} className="pt-4" />
                  ) : bookmarkedJournals && bookmarkedJournals.length > 0 ? (
                    <View className="pt-4 flex-1">
                      <EntryCardsView
                        onRefresh={refetch}
                        entries={bookmarkedJournals}
                        isLoading={false}
                        onEntryPress={onEntryPress}
                        onBookmark={onBookmark}
                        showActions={true}
                        showDateHeaders={true}
                        scrollEnabled={true}
                        onEndReached={handleLoadMore}
                        ListFooterComponent={
                          <View className="items-center py-6">
                            {isFetchingNextPage ? (
                              <ActivityIndicator size="small" color={SAGE[400]} />
                            ) : !hasNextPage && bookmarkedJournals.length > 0 ? (
                              <>
                                <View className="mb-3 h-px w-full bg-sage-100" />
                                <Text className="happy-font-body-medium text-sm text-ink-muted">
                                  All {totalCount} bookmarked journals loaded
                                </Text>
                              </>
                            ) : null}
                          </View>
                        }
                      />
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
                </View>
              </View>
            </RNHostView>
          </Group>
        </BottomSheet>
      </Host>
    </Modal>
  );
};
