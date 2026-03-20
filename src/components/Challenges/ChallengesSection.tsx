import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useChallenges } from "@/hooks/data/useChallenges";
import { ChallengeCard } from "./ChallengeCard";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Target02Icon } from "@hugeicons/core-free-icons";

interface ChallengesSectionProps {
  maxItems?: number;
}

/**
 * Minimalist challenges section for home screen
 */
export const ChallengesSection: React.FC<ChallengesSectionProps> = ({
  maxItems = 3,
}) => {
  const { dailyChallenges, weeklyChallenges, isLoading } = useChallenges();
  const [expanded, setExpanded] = useState<boolean>(true);

  const handleViewAll = (): void => {
    router.push("/tabs/screens/challenges");
  };

  const displayChallenges = [...dailyChallenges, ...weeklyChallenges].slice(
    0,
    maxItems,
  );

  const completedCount = displayChallenges.filter((c) => c.completed).length;
  const totalCount = displayChallenges.length;

  if (isLoading) {
    return (
      <View className="bg-white rounded-2xl p-6 items-center border border-gray-100">
        <ActivityIndicator size="small" color="#111827" />
      </View>
    );
  }

  return (
    <View className="bg-white rounded-2xl border border-gray-100">
      {/* Header */}
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        className="flex-row items-center justify-between p-4"
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel="Toggle challenges list"
      >
        <View className="flex-row items-center gap-3">
          {/* Icon bubble instead of emoji */}
          <View
            className="w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: "#F6F4FF" }}
          >
            <HugeiconsIcon
              icon={Target02Icon}
              size={18}
              color="#7B61FF"
              strokeWidth={1.8}
            />
          </View>
          <View>
            <Text className="text-gray-900 font-semibold text-base">
              Challenges
            </Text>
            <Text className="text-gray-500 text-xs mt-0.5">
              {completedCount} of {totalCount} completed
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleViewAll}
          className="bg-gray-100 px-3 py-1.5 rounded-full"
          accessibilityRole="button"
          accessibilityHint="Opens the full challenges screen"
        >
          <Text className="text-gray-700 font-medium text-xs">View All</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Divider */}
      <View className="h-px bg-gray-100" />

      {/* Challenge list */}
      {expanded && (
        <View className="p-4">
          {displayChallenges.length === 0 ? (
            <View className="py-4 items-center">
              <Text className="text-gray-400 text-sm">
                No active challenges
              </Text>
            </View>
          ) : (
            displayChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} compact />
            ))
          )}
        </View>
      )}
    </View>
  );
};
