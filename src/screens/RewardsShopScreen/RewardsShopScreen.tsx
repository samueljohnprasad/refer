import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft02Icon, Coins01Icon } from "@hugeicons/core-free-icons";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { router } from "expo-router";
import { useRewards } from "@/hooks/data/useRewards";
import {
  CoinsBadge,
  RewardCard,
  RewardPurchaseModal,
} from "@/src/components/Rewards";
import {
  Reward,
  RewardCategory,
  REWARDS,
  getRewardsByCategory,
} from "@/src/types/rewards";
import * as Haptics from "expo-haptics";
import { GOLD, SAGE } from "@/lib/tokens";
import { Card } from "@/src/components/ui/Card";

const CATEGORY_TABS: { key: RewardCategory; label: string; emoji: string }[] = [
  { key: "themes", label: "Themes", emoji: "🎨" },
  { key: "avatars", label: "Avatars", emoji: "👤" },
  { key: "prompts", label: "Prompts", emoji: "💬" },
  { key: "animations", label: "Effects", emoji: "✨" },
];

const styles = StyleSheet.create({
  categoryContent: {
    gap: 8,
    paddingHorizontal: 16,
  },
  categoryScroller: {
    flexGrow: 0,
    maxHeight: 56,
  },
  rewardsContent: {
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  screen: {
    backgroundColor: "#FFFFFF",
  },
});

export const RewardsShopScreen: React.FC = () => {
  const {
    wallet,
    isLoading,
    isRewardUnlocked,
    purchaseReward,
    unlockedRewards,
  } = useRewards();
  const [activeCategory, setActiveCategory] =
    useState<RewardCategory>("themes");
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false);

  const categoryRewards = getRewardsByCategory(activeCategory);

  const handleBackPress = (): void => {
    Haptics.selectionAsync();
    router.back();
  };

  const handleCategoryPress = (category: RewardCategory): void => {
    Haptics.selectionAsync();
    setActiveCategory(category);
  };

  const handlePurchase = useCallback(async (): Promise<void> => {
    if (!selectedReward) return;

    setIsPurchasing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const result = await purchaseReward(selectedReward.id);

    setIsPurchasing(false);
    setSelectedReward(null);

    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("🎉 Purchased!", `You now own ${selectedReward.name}!`, [
        { text: "Awesome!", style: "default" },
      ]);
    } else {
      Alert.alert("Purchase Failed", result.error || "Something went wrong");
    }
  }, [selectedReward, purchaseReward]);

  if (isLoading) {
    return (
      <SafeAreaView
        className="happy-brand-screen flex-1 items-center justify-center"
        style={styles.screen}
      >
        <ActivityIndicator size="large" color={SAGE[500]} />
        <Text className="happy-font-body-medium mt-4 text-ink-muted">
          Loading shop...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="happy-brand-screen flex-1"
      style={styles.screen}
    >
      <View className="flex-row items-center px-4 pb-4 pt-2">
        <Pressable
          onPress={handleBackPress}
          className="happy-brand-soft-chip mr-3 h-11 w-11 items-center justify-center active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <HugeiconsIcon
            icon={ArrowLeft02Icon}
            size={20}
            color={SAGE[600]}
            strokeWidth={2}
          />
        </Pressable>
        <View className="min-w-0 flex-1">
          <Text
            className="happy-font-heading-bold text-[24px] leading-tight text-ink"
            numberOfLines={1}
          >
            Rewards Shop
          </Text>
          <Text
            className="happy-font-body-medium text-[13px] text-ink-muted"
            numberOfLines={1}
          >
            Spend coins on tiny feel-good upgrades
          </Text>
        </View>
        <CoinsBadge coins={wallet.coins} size="md" />
      </View>

      <View className="px-4 pb-4">
        <Card
          variant="tile"
          radius="xl"
          showDepth={true}
          contentClassName="p-4"
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="happy-font-body-medium text-sm text-ink-muted">
                Your Balance
              </Text>
              <View className="mt-2 flex-row items-center">
                <View className="happy-brand-status-chip h-11 w-11 items-center justify-center">
                  <HugeiconsIcon
                    icon={Coins01Icon}
                    size={24}
                    color={GOLD}
                    strokeWidth={1.8}
                  />
                </View>
                <Text className="happy-font-heading-bold ml-3 text-[36px] leading-tight text-ink">
                  {wallet.coins.toLocaleString()}
                </Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="happy-font-body-medium text-sm text-ink-muted">
                Items Owned
              </Text>
              <Text className="happy-font-heading-bold mt-2 text-[30px] leading-tight text-sage-600">
                {unlockedRewards.length}/{REWARDS.length}
              </Text>
            </View>
          </View>
        </Card>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroller}
        contentContainerStyle={styles.categoryContent}
      >
        {CATEGORY_TABS.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => handleCategoryPress(tab.key)}
            className={`flex-row items-center rounded-full border-2 px-4 py-2 active:opacity-80 ${
              activeCategory === tab.key
                ? "border-sage-500 bg-sage-selected"
                : "border-sage-100 bg-brand-surface"
            }`}
          >
            <Text className="mr-1.5">{tab.emoji}</Text>
            <Text
              className={`happy-font-body-bold ${
                activeCategory === tab.key ? "text-ink" : "text-ink-muted"
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        className="flex-1"
        contentContainerStyle={styles.rewardsContent}
        showsVerticalScrollIndicator={false}
      >
        {categoryRewards.map((reward) => {
          const isOwned = isRewardUnlocked(reward.id);
          const canAfford = wallet.coins >= reward.cost;

          return (
            <RewardCard
              key={reward.id}
              reward={reward}
              isOwned={isOwned}
              canAfford={canAfford}
              onPurchase={() => setSelectedReward(reward)}
            />
          );
        })}

        {categoryRewards.length === 0 && (
          <View className="items-center py-12">
            <Text className="text-4xl mb-2">🎁</Text>
            <Text className="happy-font-body-medium text-ink-muted">
              No rewards in this category
            </Text>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>

      {/* Purchase Modal */}
      <RewardPurchaseModal
        visible={!!selectedReward}
        reward={selectedReward}
        currentCoins={wallet.coins}
        onConfirm={handlePurchase}
        onCancel={() => setSelectedReward(null)}
        isPurchasing={isPurchasing}
      />
    </SafeAreaView>
  );
};

export default RewardsShopScreen;
