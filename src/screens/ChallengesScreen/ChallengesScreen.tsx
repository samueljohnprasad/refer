import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft02Icon, Coins01Icon, StarsIcon } from "@hugeicons/core-free-icons";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { router, Stack } from "expo-router";
import { useChallenges } from "@/hooks/data/useChallenges";
import { ChallengeCard } from "@/src/components/Challenges";
import { BRAND_SURFACE, GOLD, SAGE } from "@/lib/tokens";

type TabType = "daily" | "weekly";

export const ChallengesScreen: React.FC = () => {
  const { dailyChallenges, weeklyChallenges, isLoading } = useChallenges();
  const [activeTab, setActiveTab] = useState<TabType>("daily");

  const activeChallenges =
    activeTab === "daily" ? dailyChallenges : weeklyChallenges;

  const dailyCompleted = dailyChallenges.filter((c) => c.completed).length;
  const weeklyCompleted = weeklyChallenges.filter((c) => c.completed).length;

  const totalXP =
    dailyChallenges.reduce((sum, c) => sum + c.reward.xp, 0) +
    weeklyChallenges.reduce((sum, c) => sum + c.reward.xp, 0);

  const totalCoins =
    dailyChallenges.reduce((sum, c) => sum + c.reward.coins, 0) +
    weeklyChallenges.reduce((sum, c) => sum + c.reward.coins, 0);

  if (isLoading) {
    return (
      <View className="flex-1 happy-brand-screen">
        <SafeAreaView style={{ flex: 1 }}>
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={SAGE[600]} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 happy-brand-screen">
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="relative flex-row items-center justify-center px-5 pb-6 pt-3">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            className="absolute left-5 top-2 h-12 w-12 items-center justify-center rounded-full bg-sage-pill"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color={SAGE[700]} />
          </TouchableOpacity>
          <Text className="happy-font-heading-bold text-[34px] text-ink">
            Challenges
          </Text>
        </View>

      <View className="flex-row px-4 pt-2 gap-3 pb-4">
        {/* XP Card */}
        <View className="happy-brand-raised-panel flex-1 rounded-[28px] p-5">
          <View className="w-11 h-11 rounded-full bg-gold/15 items-center justify-center mb-4">
            <HugeiconsIcon icon={StarsIcon} size={22} color={GOLD} />
          </View>
          <Text className="happy-font-heading-bold text-[34px] text-ink">
            {totalXP}
          </Text>
          <Text className="happy-brand-eyebrow mt-1">
            XP Available
          </Text>
        </View>

        {/* Coins Card */}
        <View className="happy-brand-raised-panel flex-1 rounded-[28px] p-5">
          <View className="w-11 h-11 rounded-full bg-sage-pill items-center justify-center mb-4">
            <HugeiconsIcon icon={Coins01Icon} size={22} color={SAGE[600]} />
          </View>
          <Text className="happy-font-heading-bold text-[34px] text-ink">
            {totalCoins}
          </Text>
          <Text className="happy-brand-eyebrow mt-1">
            Coins Available
          </Text>
        </View>
      </View>

      {/* Segmented Control Tabs */}
      <View className="px-4 mb-4">
        <View className="flex-row bg-sage-50 p-1 rounded-full border border-sage-100">
          <TouchableOpacity
            onPress={() => setActiveTab("daily")}
            className={`flex-1 flex-row justify-center py-3 rounded-full items-center gap-2 ${
              activeTab === "daily" ? "bg-brand-surface" : ""
            }`}
            activeOpacity={0.8}
          >
            <Text
              className={`happy-font-body-bold ${
                activeTab === "daily" ? "text-ink" : "text-ink-muted"
              }`}
            >
              Daily
            </Text>
            <Text
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                activeTab === "daily"
                  ? "text-sage-600 bg-sage-pill"
                  : "text-ink-muted bg-sage-100"
              }`}
            >
              {dailyCompleted}/{dailyChallenges.length}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("weekly")}
            className={`flex-1 flex-row justify-center py-3 rounded-full items-center gap-2 ${
              activeTab === "weekly" ? "bg-brand-surface" : ""
            }`}
            activeOpacity={0.8}
          >
            <Text
              className={`happy-font-body-bold ${
                activeTab === "weekly" ? "text-ink" : "text-ink-muted"
              }`}
            >
              Weekly
            </Text>
            <Text
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                activeTab === "weekly"
                  ? "text-sage-600 bg-sage-pill"
                  : "text-ink-muted bg-sage-100"
              }`}
            >
              {weeklyCompleted}/{weeklyChallenges.length}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Reset info */}
      <View className="mx-4 mb-3 items-center">
        <Text className="happy-brand-eyebrow">
          {activeTab === "daily"
            ? "↻ Resets at midnight"
            : "↻ Resets every Monday"}
        </Text>
      </View>

      {/* Challenge List */}
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {activeChallenges.length === 0 ? (
            <View className="items-center justify-center py-24 px-8">
              <View className="w-20 h-20 rounded-full bg-sage-pill border border-sage-100 items-center justify-center mb-6">
                <Text className="text-4xl">🎯</Text>
              </View>
              <Text className="happy-font-body-bold text-lg text-ink text-center mb-2">
                You're all caught up!
              </Text>
              <Text className="happy-font-body-medium text-ink-muted text-sm text-center leading-5">
                No more {activeTab} challenges available right now. Check back{" "}
                {activeTab === "daily" ? "tomorrow" : "next week"} for new goals.
              </Text>
            </View>
          ) : (
            activeChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ChallengesScreen;
