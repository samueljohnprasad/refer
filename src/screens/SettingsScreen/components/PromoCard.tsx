import React from "react";
import { View, Text } from "react-native";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";

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
      {/* Top-row spark emoji icon for visual personality */}
      <View className="flex-row items-center gap-2 mb-2">
        <Text className="text-lg">✨</Text>
        <Text className="happy-brand-eyebrow">
          Pro
        </Text>
      </View>

      {/* Title uses system sans-serif */}
      <Text className="happy-font-body-bold text-[22px] text-ink mb-2">
        Unlock All Features
      </Text>

      {/* Feature list as single clean string */}
      <Text className="happy-font-body-medium text-ink-muted text-[15px] leading-6 mb-5">
        AI Insights, Weekly Summaries, Advanced Dashboard, Longer Recordings,
        and more.
      </Text>

      {/* Wrap in View to prevent stretching full-width */}
      <View className="items-start">
        <Button
          label="Upgrade to Pro →"
          variant="primary"
          size="md"
          fullWidth={false}
          onPress={onPromoPress}
        />
      </View>
    </Card>
  );
};
