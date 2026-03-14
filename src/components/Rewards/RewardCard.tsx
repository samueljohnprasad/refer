import React from "react";
import { View, Text, Pressable } from "react-native";
import { Reward } from "@/src/types/rewards";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Coins01Icon, CheckmarkBadge01Icon } from "@hugeicons/core-free-icons";

interface RewardCardProps {
  reward: Reward;
  isOwned: boolean;
  canAfford: boolean;
  onPurchase?: () => void;
}

/**
 * Card displaying a purchasable reward
 */
export const RewardCard: React.FC<RewardCardProps> = ({
  reward,
  isOwned,
  canAfford,
  onPurchase,
}) => {
  return (
    <Pressable
      onPress={!isOwned && canAfford ? onPurchase : undefined}
      className="bg-white rounded-2xl p-4 border border-gray-100 mb-3"
      style={{ opacity: isOwned ? 0.7 : 1 }}
    >
      <View className="flex-row items-center">
        {/* Icon */}
        <View
          className="w-14 h-14 rounded-xl items-center justify-center"
          style={{ backgroundColor: reward.color + "20" }}
        >
          <Text style={{ fontSize: 28 }}>{reward.icon}</Text>
        </View>

        {/* Info */}
        <View className="flex-1 ml-3">
          <Text className="text-base font-semibold text-gray-900">
            {reward.name}
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={2}>
            {reward.description}
          </Text>
        </View>

        {/* Price / Owned Badge */}
        {isOwned ? (
          <View className="bg-green-100 px-3 py-1.5 rounded-full flex-row items-center gap-1">
            <HugeiconsIcon
              icon={CheckmarkBadge01Icon}
              size={13}
              color="#15803D"
              strokeWidth={2}
            />
            <Text className="text-xs font-bold text-green-700">Owned</Text>
          </View>
        ) : (
          <View
            className={`px-3 py-1.5 rounded-full ${
              canAfford ? "bg-yellow-100" : "bg-gray-100"
            }`}
          >
            <View className="flex-row items-center">
              <HugeiconsIcon
                icon={Coins01Icon}
                size={13}
                color="#D97706"
                strokeWidth={1.8}
              />
              <Text
                className={`text-xs font-bold ml-1 ${
                  canAfford ? "text-yellow-700" : "text-gray-400"
                }`}
              >
                {reward.cost}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Preview bar for themes */}
      {reward.type === "theme" && reward.preview && (
        <View
          className="h-2 rounded-full mt-3"
          style={{ backgroundColor: reward.preview }}
        />
      )}
    </Pressable>
  );
};
