import React, { useState, useCallback } from "react";
import { View, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft01Icon, BookmarkAdd01Icon } from "@hugeicons/core-free-icons";
import { useCopingCards } from "@/src/hooks/useCopingCards";
import { SAGE, INK, BRAND_CANVAS } from "@/lib/tokens";
import { CopingCardItem } from "./CopingCardItem";

export const CopingCardsScreen: React.FC = () => {
  const router = useRouter();
  const [showArchived, setShowArchived] = useState(false);

  const { cards, isLoading, toggleStar, archiveCard, unarchiveCard } =
    useCopingCards(showArchived);

  const handleToggleStar = useCallback(
    async (id: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await toggleStar(id);
    },
    [toggleStar],
  );

  const handleArchive = useCallback(
    async (id: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await archiveCard(id);
    },
    [archiveCard],
  );

  const handleUnarchive = useCallback(
    async (id: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await unarchiveCard(id);
    },
    [unarchiveCard],
  );

  const activeCards = showArchived ? cards.filter((c) => !c.archived) : cards;
  const archivedCards = showArchived ? cards.filter((c) => c.archived) : [];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: BRAND_CANVAS }}>
      {/* Header */}
      <View className="flex-row items-center px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          className="w-10 h-10 rounded-full items-center justify-center active:bg-sage-pill mr-3"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={22}
            color={INK}
            strokeWidth={2}
          />
        </Pressable>
        <View className="flex-1">
          <Text variant="h2" className="text-[22px] font-extrabold text-ink">
            My Coping Cards
          </Text>
          <Text variant="caption-muted" className="text-[13px] mt-0.5">
            Wisdom you've built through practice
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40, paddingTop: 8 }}
      >
        {isLoading ? (
          <View className="flex-1 items-center justify-center pt-20">
            <ActivityIndicator size="large" color={SAGE[500]} />
          </View>
        ) : activeCards.length === 0 && !showArchived ? (
          <EmptyState />
        ) : (
          <>
            {activeCards.map((card) => (
              <CopingCardItem
                key={card.id}
                card={card}
                onToggleStar={() => handleToggleStar(card.id)}
                onArchive={() => handleArchive(card.id)}
              />
            ))}

            {/* Archived section */}
            {showArchived && archivedCards.length > 0 && (
              <>
                <View className="flex-row items-center gap-2 mb-4 mt-2">
                  <View className="flex-1 h-px bg-brand-border" />
                  <Text className="text-[12px] font-bold text-ink-muted uppercase tracking-wider">
                    Archived
                  </Text>
                  <View className="flex-1 h-px bg-brand-border" />
                </View>
                {archivedCards.map((card) => (
                  <View key={card.id} className="opacity-60">
                    <CopingCardItem
                      card={card}
                      onToggleStar={() => handleToggleStar(card.id)}
                      onArchive={() => handleUnarchive(card.id)}
                    />
                  </View>
                ))}
              </>
            )}

            {/* Show/hide archived toggle */}
            <Pressable
              onPress={() => setShowArchived((p) => !p)}
              accessibilityRole="button"
              accessibilityLabel={
                showArchived ? "Hide archived" : "Show archived"
              }
              className="items-center py-3 mt-2 active:opacity-60"
            >
              <Text className="text-[13px] font-semibold text-sage-600">
                {showArchived ? "Hide archived" : "Show archived"}
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center pt-10 pb-20 px-6">
      <View className="h-20 w-20 rounded-full bg-sage-50 items-center justify-center mb-5">
        <HugeiconsIcon
          icon={BookmarkAdd01Icon}
          size={36}
          color={SAGE[400]}
          strokeWidth={1.5}
        />
      </View>
      <Text
        variant="h2"
        className="text-[20px] font-extrabold text-ink text-center mb-2"
      >
        No coping cards yet
      </Text>
      <Text
        variant="body"
        color="soft"
        className="text-[15px] text-center leading-relaxed"
      >
        Complete an exercise and tap{" "}
        <Text className="font-bold text-sage-700">"Save as coping card"</Text>{" "}
        on the summary screen to collect your insights here.
      </Text>
    </View>
  );
}

CopingCardsScreen.displayName = "CopingCardsScreen";
