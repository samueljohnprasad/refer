import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
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

const CATEGORY_TABS: { key: RewardCategory; label: string; emoji: string }[] = [
  { key: "themes", label: "Themes", emoji: "🎨" },
  { key: "avatars", label: "Avatars", emoji: "👤" },
  { key: "prompts", label: "Prompts", emoji: "💬" },
  { key: "animations", label: "Effects", emoji: "✨" },
];

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
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text className="text-gray-500 mt-4">Loading shop...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">Rewards Shop</Text>
        <CoinsBadge coins={wallet.coins} size="sm" />
      </View>

      {/* Wallet Summary */}
      <View className="px-4 pt-4 pb-2">
        <View className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-4 border border-yellow-200">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-500 text-sm">Your Balance</Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-3xl">🪙</Text>
                <Text className="text-3xl font-bold text-gray-900 ml-2">
                  {wallet.coins.toLocaleString()}
                </Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-gray-500 text-sm">Items Owned</Text>
              <Text className="text-2xl font-bold text-green-600">
                {unlockedRewards.length}/{REWARDS.length}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 py-3"
        contentContainerStyle={{ gap: 8 }}
      >
        {CATEGORY_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveCategory(tab.key)}
            className={`px-4 py-2 rounded-full flex-row items-center ${
              activeCategory === tab.key
                ? "bg-yellow-400"
                : "bg-white border border-gray-200"
            }`}
          >
            <Text className="mr-1">{tab.emoji}</Text>
            <Text
              className={`font-medium ${
                activeCategory === tab.key ? "text-gray-900" : "text-gray-600"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Rewards List */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
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
            <Text className="text-gray-500">No rewards in this category</Text>
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
