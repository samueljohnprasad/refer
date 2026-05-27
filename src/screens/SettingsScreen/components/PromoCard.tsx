import React from "react";
import { View, Text } from "react-native";
import { Card } from "@/src/components/ui/Card";

interface PromoCardProps {
  onLayout: (event: any) => void;
  onPromoPress: () => Promise<boolean>;
}

export const PromoCard: React.FC<PromoCardProps> = ({
  onLayout,
  onPromoPress,
}) => {
  return (
    <Card
      variant="tile"
      radius="xl"
      onPress={onPromoPress}
      onLayout={onLayout}
      className="mb-5"
      contentClassName="p-5"
      accessibilityLabel="Upgrade to Pro. AI Insights, Weekly Summaries, Advanced Dashboard, Longer Recordings, and more."
      accessibilityHint="Double tap to upgrade to Pro"
    >
      {/* FIX #21: Added a top-row spark emoji icon for visual personality */}
      <View className="flex-row items-center gap-2 mb-2">
        <Text className="text-lg">✨</Text>
        <Text className="happy-brand-eyebrow">
          Pro
        </Text>
      </View>

      {/* FIX #22: Title uses system sans-serif, not cormorantBold — consistent with rest of screen */}
      <Text className="happy-font-body-bold text-[22px] text-ink mb-2">
        Unlock All Features
      </Text>

      {/* FIX #23: Feature list as single clean string instead of hard-coded newlines */}
      <Text className="happy-font-body-medium text-ink-muted text-[15px] leading-6 mb-5">
        AI Insights, Weekly Summaries, Advanced Dashboard, Longer Recordings,
        and more.
      </Text>

      {/* Wrap in View to prevent stretching full-width */}
      <View className="items-start">
        <View className="happy-brand-primary-cta rounded-[18px] px-5 py-3">
          <Text className="happy-font-body-bold text-brand-surface text-[16px] tracking-wide">
            Upgrade to Pro →
          </Text>
        </View>
      </View>
    </Card>
  );
};
