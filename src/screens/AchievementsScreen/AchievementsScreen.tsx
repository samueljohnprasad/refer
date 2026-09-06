import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useCallback, useRef, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "@/src/components/tw";
import { router, Stack } from "expo-router";
import * as Haptics from "expo-haptics";

import { useAchievements } from "@/hooks/data/useAchievements";
import { AchievementCategory, ACHIEVEMENTS } from "@/src/types/achievements";
import { Mascot } from "@/src/components/ui/Mascot";
import { AchievementBadgeDetailSheet, type AchievementProgressItem } from "./components/AchievementBadgeDetailSheet";
import { AchievementsSkeleton } from "./components/AchievementsSkeleton";
import { AchievementCategorySection } from "./components/AchievementCategorySection";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

const CATEGORIES: readonly AchievementCategory[] = [
  "journaling",
  "streaks",
  "habits",
  "wellness",
  "tracking",
];

// ponytail: compact, focused achievements screen with badges above the fold
export const AchievementsScreen: React.FC = () => {
  const { achievements, isLoading, unlockedAchievements } = useAchievements();
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedAchievement, setSelectedAchievement] =
    useState<AchievementProgressItem | null>(null);

  const unlockedCount = unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;
  const hasAchievements = achievements.length > 0;

  const getAchievementsByCategory = useCallback(
    (category: AchievementCategory) =>
      achievements.filter((a) => a.achievement.category === category),
    [achievements],
  );

  const handleBadgePress = useCallback((item: AchievementProgressItem) => {
    void Haptics.selectionAsync();
    setSelectedAchievement(item);
  }, []);

  const handleBadgeSheetPresentationChange = useCallback(
    (isPresented: boolean) => {
      if (!isPresented) {
        setSelectedAchievement(null);
      }
    },
    [],
  );

  const headerElements = (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Achievements",
          headerTransparent: false,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#FDFDF9" },
          headerLargeTitleStyle: { fontFamily: APP_FONT_FAMILIES.bold },
          headerTitleStyle: {
            fontFamily: APP_FONT_FAMILIES.bold,
            fontSize: 18,
          },
          headerTintColor: "#142414",
          headerBackButtonDisplayMode: "minimal",
          headerLeft: () => null,
        }}
      />
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="chevron.left" onPress={() => router.back()} />
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="sparkles"
          onPress={() => router.push("/tabs/screens/xp-history")}
          tintColor={SEMANTIC_COLORS.warning.foreground}
        />
      </Stack.Toolbar>
    </>
  );

  if (isLoading) {
    return (
      <>
        {headerElements}
        <AchievementsSkeleton />
      </>
    );
  }

  return (
    <>
      {headerElements}

      <SafeAreaView
        className="happy-brand-screen flex-1"
        style={{ backgroundColor: "#FDFDF9" }}
        edges={["left", "right"]}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 48 }}
          accessibilityLabel="Achievements list"
        >
          {/* Compact Top Summary */}
          <View className="items-center pt-1.5 pb-2.5">
            <Text className="happy-font-body-bold text-[20px] text-ink">
              {unlockedCount} of {totalCount} unlocked
            </Text>
          </View>

          {!hasAchievements && <EmptyState />}

          {/* Achievement Category Grids */}
          {CATEGORIES.map((category) => {
            const categoryAchievements = getAchievementsByCategory(category);
            return (
              <AchievementCategorySection
                key={category}
                category={category}
                items={categoryAchievements}
                onBadgePress={handleBadgePress}
              />
            );
          })}
        </ScrollView>

        <AchievementBadgeDetailSheet
          isPresented={selectedAchievement !== null}
          item={selectedAchievement}
          onIsPresentedChange={handleBadgeSheetPresentationChange}
        />
      </SafeAreaView>
    </>
  );
};

const EmptyState: React.FC = () => (
  <View className="items-center justify-center px-8 py-12">
    <View className="happy-mascot-stage mb-4 h-20 w-20 items-center justify-center rounded-[28px]">
      <Mascot state="panda-yet-sleep-pillow" size={52} />
    </View>
    <Text className="happy-font-heading-bold mb-1 text-center text-lg text-ink">
      No badges yet
    </Text>
    <Text className="happy-font-body-medium text-center text-sm leading-5 text-ink-muted">
      Start journaling to earn your first badge
    </Text>
  </View>
);

export default AchievementsScreen;
