import React from "react";
import { View, Text, Pressable } from "react-native";
import { Reward } from "@/src/types/rewards";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Coins01Icon, CheckmarkBadge01Icon } from "@hugeicons/core-free-icons";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";

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
      className="happy-brand-card mb-3 rounded-[24px] p-4 active:opacity-90"
      style={{ opacity: isOwned ? 0.7 : 1 }}
    >
      <View className="flex-row items-center">
        <View
          className="h-14 w-14 items-center justify-center rounded-[18px]"
          style={{ backgroundColor: reward.color + "20" }}
        >
          <Text style={{ fontSize: 28 }}>{reward.icon}</Text>
        </View>

        <View className="flex-1 ml-3">
          <Text className="happy-font-body-bold text-base text-ink">
            {reward.name}
          </Text>
          <Text
            className="happy-font-body-medium mt-0.5 text-xs leading-4 text-ink-muted"
            numberOfLines={2}
          >
            {reward.description}
          </Text>
        </View>

        {isOwned ? (
          <View className="happy-brand-status-chip flex-row items-center gap-1 rounded-full px-3 py-1.5">
            <HugeiconsIcon
              icon={CheckmarkBadge01Icon}
              size={13}
              color={SEMANTIC_COLORS.brand.pressed}
              strokeWidth={2}
            />
            <Text className="happy-font-body-bold text-xs text-sage-600">
              Owned
            </Text>
          </View>
        ) : (
          <View
            className={`rounded-full px-3 py-1.5 ${
              canAfford ? "happy-brand-status-chip" : "bg-sage-50"
            }`}
          >
            <View className="flex-row items-center">
              <HugeiconsIcon
                icon={Coins01Icon}
                size={13}
                color={canAfford ? SEMANTIC_COLORS.warning.foreground : SEMANTIC_COLORS.border.selected}
                strokeWidth={1.8}
              />
              <Text
                className={`happy-font-body-bold ml-1 text-xs ${
                  canAfford ? "text-ink" : "text-sage-300"
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
          className="mt-3 h-2 rounded-full"
          style={{ backgroundColor: reward.preview }}
        />
      )}
    </Pressable>
  );
};
