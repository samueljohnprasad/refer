import React, { useCallback } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/Text";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import { Feather } from "@expo/vector-icons";
import { EntryCardsView } from "./EntryCardsView";
import { JournalEntry } from "@/hooks/data/types";
import { useBookmarkedJournals } from "@/hooks/journals/useBookmarkedJournals";
import { Host, BottomSheet, Group, RNHostView } from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
  presentationBackground,
} from "@expo/ui/swift-ui/modifiers";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
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

  // ponytail: content-height ~68% for small counts (<=2), taller 88% with scroll for many entries
  const sheetFraction = (bookmarkedJournals?.length ?? 0) <= 2 ? 0.68 : 0.88;

  if (!isOpen) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
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
              presentationDetents([{ fraction: sheetFraction }]),
              presentationDragIndicator("visible"),
              presentationBackground("#FAF7EE"),
            ]}
          >
            <RNHostView>
              <View className="flex-1 bg-[#FAF7EE]">
                {/* Header: compact 22px semibold title with close metadata */}
                <View className="px-5 pt-3 pb-3 border-b border-sage-100/60">
                  <Text className="happy-font-heading-semibold text-[22px] leading-[28px] text-ink">
                    Pinned Notes
                  </Text>
                  <Text className="happy-font-body text-[14px] leading-[18px] text-ink-muted mt-0.5">
                    {totalCount === 1 ? "1 pinned note" : `${totalCount || 0} pinned notes`}
                  </Text>
                </View>

                {/* Content */}
                <View className="flex-1 px-5 pb-4">
                  {isLoading && bookmarkedJournals.length === 0 ? (
                    <SkeletonList count={3} className="pt-3" />
                  ) : bookmarkedJournals && bookmarkedJournals.length > 0 ? (
                    <View className="pt-2.5 flex-1">
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
                          isFetchingNextPage ? (
                            <View className="items-center py-4">
                              <ActivityIndicator size="small" color={SEMANTIC_COLORS.brand.primary} />
                            </View>
                          ) : null
                        }
                      />
                    </View>
                  ) : (
                    <View className="items-center justify-center py-24">
                      <View className="mb-6">
                        <Feather name="bookmark" size={32} color={SEMANTIC_COLORS.text.tertiary} />
                      </View>
                      <Text className="happy-font-heading-bold mb-3 text-[22px] text-ink">
                        No Pinned Notes
                      </Text>
                      <Text className="happy-font-body-medium px-8 text-center text-[17px] leading-6 text-ink-muted">
                        Tap the bookmark icon on any journal entry to save it here for
                        quick access.
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </RNHostView>
          </Group>
        </BottomSheet>
      </Host>
    </View>
  );
};
