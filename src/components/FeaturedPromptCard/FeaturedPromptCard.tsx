import React from "react";
import { View, Text } from "react-native";
import { PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Card } from "@/src/components/ui/Card";
import { SAGE } from "@/lib/tokens";

interface FeaturedPromptCardProps {
  category?: string;
  xpReward?: number;
  prompt: string;
  emoji?: string;
  onPress: () => void;
}

/**
 * Featured journaling prompt card for home screen — Hero treatment
 * Accessible, scalable typography, high contrast focus
 */
export const FeaturedPromptCard: React.FC<FeaturedPromptCardProps> = ({
  category = "Journaling",
  prompt,
  onPress,
}) => {
  return (
    <Card
      variant="tile"
      radius="xl"
      onPress={onPress}
      showDepth={false}
      haptic="light"
      contentClassName="p-5"
      accessibilityLabel={`Take a moment to write. Featured Prompt: ${prompt}.`}
      accessibilityHint="Opens the journal recorder for this prompt"
    >
      <View className="mb-4 flex-row items-center justify-between">
        <View className="h-11 w-11 items-center justify-center rounded-[18px] border border-sage-100 bg-sage-50">
          <HugeiconsIcon icon={PencilEdit01Icon} size={22} color={SAGE[600]} />
        </View>
        <View className="happy-brand-status-chip px-3 py-1.5">
          <Text className="happy-brand-eyebrow text-[11px]">{category}</Text>
        </View>
      </View>

      <Text
        className="happy-font-heading-bold mb-8 text-[30px] leading-tight tracking-tight text-ink"
        minimumFontScale={0.8}
        adjustsFontSizeToFit
      >
        {prompt}
      </Text>

      <View className="mt-auto h-14 flex-row items-center justify-center rounded-[22px] bg-sage-50">
        <HugeiconsIcon icon={PencilEdit01Icon} size={19} color={SAGE[700]} />
        <Text className="happy-font-body-bold ml-2.5 text-[16px] tracking-tight text-ink">
          Start writing
        </Text>
      </View>
    </Card>
  );
};
