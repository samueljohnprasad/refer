import React, { useState, useCallback } from "react";
import { View, FlatList, Pressable, ActivityIndicator } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRouter, Stack } from "expo-router";
import * as Haptics from "expo-haptics";
import { Text } from "@/src/components/ui/Text";
import { Host, BottomSheet, Group, RNHostView, Picker, Text as SwiftUIText } from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
  pickerStyle,
  tag,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { BookmarkAdd01Icon } from "@hugeicons/core-free-icons";
import { useCopingCards } from "@/src/hooks/useCopingCards";
import { SAGE, BRAND_SURFACE } from "@/lib/tokens";
import { CopingCardItem } from "./CopingCardItem";
import { useHeaderHeight } from "expo-router/react-navigation";

import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

export const CopingCardsScreen: React.FC = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"active" | "archived">("active");
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
      style={{ flex: 1, backgroundColor: BRAND_SURFACE }}
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
        className="flex-1"
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
            <View className="mb-2">
              {/* Native SwiftUI segmented picker for tabs */}
              <View className="items-center mb-6 mt-2">
                <Host style={{ width: 200, height: 32 }}>
                  <Picker
                    modifiers={[pickerStyle("segmented"), tint(SAGE[600])]}
                    selection={viewMode === "active" ? "Active" : "Archived"}
                    onSelectionChange={(selection) => {
                      if (selection === "Active") setViewMode("active");
                      if (selection === "Archived") setViewMode("archived");
                    }}
                  >
                    <SwiftUIText modifiers={[tag("Active")]}>Active</SwiftUIText>
                    <SwiftUIText modifiers={[tag("Archived")]}>Archived</SwiftUIText>
                  </Picker>
                </Host>
              </View>
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
