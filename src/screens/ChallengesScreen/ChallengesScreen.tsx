import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { router } from "expo-router";
import { useChallenges } from "@/hooks/data/useChallenges";
import { ChallengeCard } from "@/src/components/Challenges";

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
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#111827" />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row px-4 py-4 gap-3">
        <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-100">
          <Text className="text-2xl">⭐</Text>
          <Text className="text-2xl font-bold text-gray-900 mt-2">
            {totalXP}
          </Text>
          <Text className="text-gray-500 text-xs mt-1">XP Available</Text>
        </View>
        <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-100">
          <Text className="text-2xl">🪙</Text>
          <Text className="text-2xl font-bold text-gray-900 mt-2">
            {totalCoins}
          </Text>
          <Text className="text-gray-500 text-xs mt-1">Coins Available</Text>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row px-4 gap-2 mb-4">
        <TouchableOpacity
          onPress={() => setActiveTab("daily")}
          className={`flex-1 py-3 rounded-xl ${
            activeTab === "daily"
              ? "bg-gray-900"
              : "bg-white border border-gray-200"
          }`}
        >
          <View className="items-center">
            <Text
              className={`font-semibold ${
                activeTab === "daily" ? "text-white" : "text-gray-600"
              }`}
            >
              Daily
            </Text>
            <Text
              className={`text-xs mt-0.5 ${
                activeTab === "daily" ? "text-gray-300" : "text-gray-400"
              }`}
            >
              {dailyCompleted}/{dailyChallenges.length}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("weekly")}
          className={`flex-1 py-3 rounded-xl ${
            activeTab === "weekly"
              ? "bg-gray-900"
              : "bg-white border border-gray-200"
          }`}
        >
          <View className="items-center">
            <Text
              className={`font-semibold ${
                activeTab === "weekly" ? "text-white" : "text-gray-600"
              }`}
            >
              Weekly
            </Text>
            <Text
              className={`text-xs mt-0.5 ${
                activeTab === "weekly" ? "text-gray-300" : "text-gray-400"
              }`}
            >
              {weeklyCompleted}/{weeklyChallenges.length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Reset info */}
      <View className="mx-4 mb-4 bg-gray-100 rounded-xl p-3">
        <Text className="text-gray-600 text-xs text-center">
          {activeTab === "daily" ? "Resets at midnight" : "Resets every Monday"}
        </Text>
      </View>

      {/* Challenge List */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {activeChallenges.length === 0 ? (
          <View className="items-center py-12">
            <Text className="text-4xl mb-3">🎯</Text>
            <Text className="text-gray-400">No challenges available</Text>
          </View>
        ) : (
          activeChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default ChallengesScreen;
