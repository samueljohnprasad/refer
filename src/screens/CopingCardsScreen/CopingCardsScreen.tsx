import React, { useState, useCallback } from "react";
import { View, FlatList, Pressable, ActivityIndicator } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRouter, Stack } from "expo-router";
import * as Haptics from "expo-haptics";
import { Text } from "@/src/components/ui/Text";
import { Host, BottomSheet, Group, RNHostView } from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { BookmarkAdd01Icon } from "@hugeicons/core-free-icons";
import { useCopingCards } from "@/src/hooks/useCopingCards";
import { SAGE, BRAND_CANVAS } from "@/lib/tokens";
import { CopingCardItem } from "./CopingCardItem";
import { useHeaderHeight } from "expo-router/react-navigation";

import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { IMessageStack } from "@/src/animations/imessage-stack";

export const CopingCardsScreen: React.FC = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"active" | "archived">("active");
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [toastConfig, setToastConfig] = useState<{
    id: string;
    visible: boolean;
  } | null>(null);
  const headerHeight = useHeaderHeight();
  const { bottom: safeBottom } = useSafeAreaInsets();

  const {
    cards,
    isLoading,
    isError,
    refetch,
    toggleStar,
    archiveCard,
    unarchiveCard,
  } = useCopingCards(true); // Fetch all to allow instant switching

  const handleToggleStar = useCallback(
    async (id: string) => {
      Haptics.selectionAsync();
      await toggleStar(id);
    },
    [toggleStar],
  );

  const handleArchive = useCallback(
    async (id: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await archiveCard(id);

      // Show toast
      setToastConfig({ id, visible: true });
      setTimeout(() => setToastConfig((p) => (p?.id === id ? null : p)), 4000);
    },
    [archiveCard],
  );

  const handleUndoArchive = useCallback(async () => {
    if (toastConfig) {
      Haptics.selectionAsync();
      await unarchiveCard(toastConfig.id);
      setToastConfig(null);
    }
  }, [toastConfig, unarchiveCard]);

  const handleUnarchive = useCallback(
    async (id: string) => {
      Haptics.selectionAsync();
      await unarchiveCard(id);
    },
    [unarchiveCard],
  );

  const activeCards = cards.filter((c) => !c.archived);
  const archivedCards = cards.filter((c) => c.archived);
  const currentData = viewMode === "active" ? activeCards : archivedCards;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: BRAND_CANVAS }}
      edges={["bottom", "left", "right"]}
    >
      <Stack.Screen
        options={{
          title: "My Coping Cards",
          headerShown: true,
          headerBackButtonDisplayMode: "minimal",
          headerTransparent: true,
        }}
      />

      <FlatList
        data={currentData}
        keyExtractor={(item) => item.id}
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 40,
          paddingTop: headerHeight + 8,
        }}
        ListEmptyComponent={
          isLoading ? (
            <View className="flex-1 items-center justify-center pt-20">
              <ActivityIndicator size="large" color={SAGE[500]} />
            </View>
          ) : isError ? (
            <View className="flex-1 items-center justify-center pt-20 px-5">
              <Text
                variant="h3"
                className="text-center text-ink font-semibold mb-2"
              >
                Failed to load your coping cards
              </Text>
              <Pressable
                onPress={refetch}
                hitSlop={12}
                className="px-6 py-3 bg-sage-100 rounded-full mt-2 active:opacity-80"
              >
                <Text className="text-sage-700 font-bold">Try again</Text>
              </Pressable>
            </View>
          ) : activeCards.length === 0 && archivedCards.length === 0 ? (
            <EmptyState />
          ) : viewMode === "archived" && archivedCards.length === 0 ? (
            <View className="flex-1 items-center justify-center pt-20 px-5">
              <Text className="text-center text-ink-muted text-[15px]">
                No archived cards
              </Text>
            </View>
          ) : null
        }
        ListHeaderComponent={
          !isLoading &&
          !isError &&
          (activeCards.length > 0 || archivedCards.length > 0) ? (
            <View className="mb-4">
              {/* Subtle and quiet text tabs instead of loud capsule */}
              <View className="flex-row items-center border-b border-black/[0.06] mb-5 pb-2 px-1">
                <Pressable
                  onPress={() => setViewMode("active")}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: viewMode === "active" }}
                  hitSlop={12}
                  className={`mr-8 pb-2 border-b-2 ${
                    viewMode === "active"
                      ? "border-sage-700"
                      : "border-transparent"
                  }`}
                >
                  <Text
                    className={`text-[15px] font-semibold tracking-wide ${
                      viewMode === "active" ? "text-ink" : "text-ink-muted"
                    }`}
                  >
                    Active{" "}
                    {activeCards.length > 0 ? `(${activeCards.length})` : ""}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setViewMode("archived")}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: viewMode === "archived" }}
                  hitSlop={12}
                  className={`pb-2 border-b-2 ${
                    viewMode === "archived"
                      ? "border-sage-700"
                      : "border-transparent"
                  }`}
                >
                  <Text
                    className={`text-[15px] font-semibold tracking-wide ${
                      viewMode === "archived" ? "text-ink" : "text-ink-muted"
                    }`}
                  >
                    Archived{" "}
                    {archivedCards.length > 0
                      ? `(${archivedCards.length})`
                      : ""}
                  </Text>
                </Pressable>
              </View>

              {/* Quiet, calm invitation card instead of loud promotional banner */}
              {viewMode === "active" && activeCards.length > 0 && (
                <Pressable
                  onPress={() => setIsReviewOpen(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Start flashcard review session"
                  className="bg-white rounded-2xl p-4 mb-3 border border-sage-200/60 flex-row items-center justify-between active:opacity-85 shadow-sm shadow-black/[0.015]"
                >
                  <View className="flex-row items-center gap-3.5 flex-1 mr-3">
                    <View className="w-10 h-10 rounded-xl bg-sage-50 items-center justify-center border border-sage-200/40">
                      <Text className="text-[17px]">✨</Text>
                    </View>
                    <View className="flex-1">
                      <Text
                        variant="label"
                        className="text-ink text-[15px] font-semibold mb-0.5"
                      >
                        Review Reframes
                      </Text>
                      <Text
                        variant="caption"
                        className="text-ink-soft text-[13px]"
                      >
                        Practice your balanced thoughts in flashcard mode
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-1.5 bg-sage-50 px-3.5 py-2 rounded-xl border border-sage-200/50">
                    <Text className="text-sage-700 font-semibold text-[13px]">
                      Start
                    </Text>
                    <Text className="text-sage-700 text-[13px] font-bold">→</Text>
                  </View>
                </Pressable>
              )}
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View className={item.archived ? "opacity-60" : ""}>
            <CopingCardItem
              card={item}
              onToggleStar={() => handleToggleStar(item.id)}
              onArchive={() =>
                item.archived
                  ? handleUnarchive(item.id)
                  : handleArchive(item.id)
              }
            />
          </View>
        )}
      />

      {/* Toast Notification */}
      {toastConfig && (
        <Animated.View
          entering={FadeInDown.duration(300).springify()}
          exiting={FadeOutDown.duration(200)}
          className="absolute left-5 right-5 bg-ink rounded-xl px-5 py-4 flex-row items-center justify-between"
          style={{
            bottom: Math.max(safeBottom, 20) + 20,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <Text className="text-white font-semibold">Card archived</Text>
          <Pressable
            onPress={handleUndoArchive}
            hitSlop={12}
            className="active:opacity-60"
          >
            <Text className="text-sage-300 font-bold uppercase tracking-wider text-[13px]">
              Undo
            </Text>
          </Pressable>
        </Animated.View>
      )}

      {/* Short Flashcard Review Modal with IMessageStack Demo */}
      <Host>
        <BottomSheet
          isPresented={isReviewOpen}
          onIsPresentedChange={(val) => {
            if (!val) setIsReviewOpen(false);
          }}
        >
          <Group
            modifiers={[
              presentationDetents(["medium"]),
              presentationDragIndicator("visible"),
            ]}
          >
            <RNHostView>
              <SafeAreaView
                edges={["bottom"]}
                style={{
                  flex: 1,
                  width: "100%",
                  backgroundColor: "transparent",
                }}
              >
                <View className="flex-1 justify-center bg-transparent w-full py-4">
                  <IMessageStack />
                </View>
              </SafeAreaView>
            </RNHostView>
          </Group>
        </BottomSheet>
      </Host>
    </SafeAreaView>
  );
};

function EmptyState() {
  return (
    <View className="items-center justify-center pt-10 pb-20 px-6 mt-20">
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
