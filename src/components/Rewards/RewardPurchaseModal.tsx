import React from "react";
import { View, Text, Modal, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Reward } from "@/src/types/rewards";
import * as Haptics from "expo-haptics";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { useTranslation } from "react-i18next";

interface RewardPurchaseModalProps {
  visible: boolean;
  reward: Reward | null;
  currentCoins: number;
  onConfirm: () => void;
  onCancel: () => void;
  isPurchasing?: boolean;
}

/**
 * Confirmation modal for reward purchases
 */
export const RewardPurchaseModal: React.FC<RewardPurchaseModalProps> = ({
  visible,
  reward,
  currentCoins,
  onConfirm,
  onCancel,
  isPurchasing = false,
}) => {
  const { t } = useTranslation("common");
  const scale = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 20, stiffness: 100, overshootClamping: true });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      scale.value = 0;
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!visible || !reward) return null;

  const canAfford = currentCoins >= reward.cost;
  const remainingCoins = currentCoins - reward.cost;
  const name = t(`rewards.items.${reward.id}.name`, { defaultValue: reward.name });
  const description = t(`rewards.items.${reward.id}.description`, { defaultValue: reward.description });

  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable
        className="flex-1 items-center justify-center bg-black/35"
        onPress={onCancel}
      >
        <Animated.View style={animatedStyle}>
          <Card
            variant="tile"
            radius="xl"
            showDepth={true}
            className="mx-6 w-80"
            contentClassName="items-center p-6"
          >
          <View
            className="mb-4 h-20 w-20 items-center justify-center rounded-[24px]"
            style={{ backgroundColor: reward.color + "20" }}
          >
            <Text style={{ fontSize: 40 }}>{reward.icon}</Text>
          </View>

          <Text className="happy-font-heading-bold mb-1 text-xl text-ink">
            {name}
          </Text>
          <Text className="happy-font-body-medium mb-4 text-center text-sm leading-5 text-ink-muted">
            {description}
          </Text>

          <View className="happy-brand-surface-soft mb-4 w-full rounded-[22px] p-4">
            <View className="flex-row justify-between mb-2">
              <Text className="happy-font-body-medium text-ink-muted">
                {t("rewards.balance")}
              </Text>
              <Text className="happy-font-body-bold text-ink-soft">
                🪙 {currentCoins.toLocaleString()}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="happy-font-body-medium text-ink-muted">
                {t("rewards.cost")}
              </Text>
              <Text className="happy-font-body-bold text-terracotta">
                - 🪙 {reward.cost.toLocaleString()}
              </Text>
            </View>
            <View className="my-2 h-0.5 rounded-full bg-sage-100" />
            <View className="flex-row justify-between">
              <Text className="happy-font-body-bold text-ink">
                {t("rewards.afterPurchase")}
              </Text>
              <Text
                className={`happy-font-body-bold ${
                  canAfford ? "text-sage-600" : "text-terracotta"
                }`}
              >
                🪙 {Math.max(remainingCoins, 0).toLocaleString()}
              </Text>
            </View>
          </View>

          <View className="flex-row w-full gap-3 mt-2">
            <Button
              label={t("rewards.cancel")}
              variant="secondary"
              size="md"
              className="flex-1"
              onPress={onCancel}
              disabled={isPurchasing}
            />

            <Button
              label={isPurchasing ? t("rewards.buying") : canAfford ? t("rewards.buyNow") : t("rewards.notEnough")}
              variant="primary"
              size="md"
              className="flex-1"
              onPress={onConfirm}
              disabled={!canAfford || isPurchasing}
              loading={isPurchasing}
            />
          </View>
          </Card>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};
