import React from "react";
import { View, Text, Pressable } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { GOLD } from "@/lib/tokens";

interface PromoCardProps {
  onLayout: (event: any) => void;
  onPromoPress: () => Promise<boolean>;
}

export const PromoCard: React.FC<PromoCardProps> = ({
  onLayout,
  onPromoPress,
}) => {
  return (
    <Pressable
      onPress={onPromoPress}
      onLayout={onLayout}
      className="flex-row items-center bg-gold/15 rounded-xl px-4 py-3 mb-5 mx-5 border border-gold/30 active:bg-gold/25"
      accessibilityRole="button"
      accessibilityLabel="Upgrade to Pro. AI Insights, summaries & more"
    >
      <Text className="text-xl mr-3">✨</Text>
      <View className="flex-1">
        <Text className="happy-font-body-bold text-[15px] text-ink">
          Unlock All Features
        </Text>
        <Text className="happy-font-body-medium text-[13px] text-ink-muted">
          AI Insights, summaries & more
        </Text>
      </View>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={18}
        color={GOLD}
        strokeWidth={2}
      />
    </Pressable>
  );
};
