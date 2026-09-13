import React from "react";
import { View, Text, Pressable } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight01Icon, SparklesIcon } from "@hugeicons/core-free-icons";

interface PromoCardProps {
  onLayout: (event: any) => void;
  onPromoPress: () => Promise<boolean>;
}

export const PromoCard: React.FC<PromoCardProps> = ({
  onLayout,
  onPromoPress,
}) => {
  return (
    // ponytail: restrained pale sage-cream premium row with warm gold sparkle accent (~80pt height)
    <Pressable
      onPress={onPromoPress}
      onLayout={onLayout}
      className="flex-row items-center bg-[#F4F6F2] dark:bg-neutral-900 rounded-2xl px-4 py-3.5 mb-6 mx-5 border border-[#E2E8E0] dark:border-neutral-800 active:bg-[#EBEFE8]"
      accessibilityRole="button"
      accessibilityLabel="Unlock Happy Premium. Insights, summaries & more"
    >
      {/* Restrained warm gold badge for sparkle icon */}
      <View className="w-9 h-9 rounded-xl bg-amber-100/70 dark:bg-amber-950/40 items-center justify-center mr-3.5 border border-amber-200/50">
        <HugeiconsIcon
          icon={SparklesIcon}
          size={18}
          color="#D97706"
          strokeWidth={2}
        />
      </View>
      <View className="flex-1 justify-center">
        <Text className="text-[16px] font-semibold text-ink leading-snug">
          Unlock Happy Premium
        </Text>
        <Text className="text-[14px] text-ink-muted mt-0.5 leading-snug">
          Insights, summaries & more
        </Text>
      </View>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={18}
        color="#A1A1AA"
        strokeWidth={2}
      />
    </Pressable>
  );
};
