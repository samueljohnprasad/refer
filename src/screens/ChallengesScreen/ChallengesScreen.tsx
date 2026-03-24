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
      <SafeAreaView className="flex-1 bg-offwhite items-center justify-center">
        <ActivityIndicator size="large" color="#111827" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-offwhite">
      <View className="flex-row px-4 pt-2 gap-3 pb-4">
        {/* XP Card */}
        <View
          className="flex-1 bg-white rounded-2xl p-4 border border-violet-50"
          style={{
            shadowColor: "#4C1D95",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          <View className="w-10 h-10 rounded-full bg-violet-50 items-center justify-center mb-3">
            <Text className="text-xl">⭐</Text>
          </View>
          <Text className="text-2xl font-extrabold text-gray-900">
            {totalXP}
          </Text>
          <Text className="text-gray-500 font-bold text-[10px] mt-1 uppercase tracking-widest">
            XP Available
          </Text>
        </View>

        {/* Coins Card */}
        <View
          className="flex-1 bg-white rounded-2xl p-4 border border-amber-50"
          style={{
            shadowColor: "#B45309",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          <View className="w-10 h-10 rounded-full bg-amber-50 items-center justify-center mb-3">
            <Text className="text-xl">🪙</Text>
          </View>
          <Text className="text-2xl font-extrabold text-gray-900">
            {totalCoins}
          </Text>
          <Text className="text-gray-500 font-bold text-[10px] mt-1 uppercase tracking-widest">
            Coins Available
          </Text>
        </View>
      </View>

      {/* Segmented Control Tabs */}
      <View className="px-4 mb-4">
        <View className="flex-row bg-gray-100/80 p-1 rounded-2xl">
          <TouchableOpacity
            onPress={() => setActiveTab("daily")}
            className={`flex-1 flex-row justify-center py-2.5 rounded-xl items-center gap-2 ${
              activeTab === "daily" ? "bg-white" : ""
            }`}
            style={activeTab === "daily" ? {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 4,
              elevation: 2,
            } : undefined}
            activeOpacity={0.8}
          >
            <Text
              className={`font-bold ${
                activeTab === "daily" ? "text-gray-900" : "text-gray-500"
              }`}
            >
              Daily
            </Text>
            <Text
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                activeTab === "daily"
                  ? "text-indigo-600 bg-indigo-50"
                  : "text-gray-400 bg-gray-200/60"
              }`}
            >
              {dailyCompleted}/{dailyChallenges.length}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("weekly")}
            className={`flex-1 flex-row justify-center py-2.5 rounded-xl items-center gap-2 ${
              activeTab === "weekly" ? "bg-white" : ""
            }`}
            style={activeTab === "weekly" ? {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 4,
              elevation: 2,
            } : undefined}
            activeOpacity={0.8}
          >
            <Text
              className={`font-bold ${
                activeTab === "weekly" ? "text-gray-900" : "text-gray-500"
              }`}
            >
              Weekly
            </Text>
            <Text
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                activeTab === "weekly"
                  ? "text-indigo-600 bg-indigo-50"
                  : "text-gray-400 bg-gray-200/60"
              }`}
            >
              {weeklyCompleted}/{weeklyChallenges.length}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Reset info */}
      <View className="mx-4 mb-3 items-center">
        <Text className="text-gray-400 text-[11px] font-semibold tracking-wide uppercase">
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
            <View className="w-20 h-20 rounded-full bg-white border border-gray-100 items-center justify-center mb-6 shadow-sm">
              <Text className="text-4xl">🎯</Text>
            </View>
            <Text className="text-lg font-bold text-gray-900 text-center mb-2">
              You're all caught up!
            </Text>
            <Text className="text-gray-500 text-sm text-center leading-5">
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
  );
};

export default ChallengesScreen;
