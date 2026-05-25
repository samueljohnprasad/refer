import React from "react";
import { View, Text } from "react-native";
import { PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { PressableScale } from "@/src/components/ui/PressableScale";
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
    <View className="happy-brand-raised-panel overflow-hidden rounded-[32px] bg-sage-50">
      <PressableScale
        onPress={onPress}
        scale={0.98}
        hapticStyle="light"
        accessibilityRole="button"
        accessibilityLabel={`Take a moment to write. Featured Prompt: ${prompt}.`}
        accessibilityHint="Opens the journal recorder for this prompt"
      >
        <View className="p-5">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="h-11 w-11 items-center justify-center rounded-[18px] bg-brand-surface">
              <HugeiconsIcon
                icon={PencilEdit01Icon}
                size={22}
                color={SAGE[600]}
              />
            </View>
            <View className="happy-brand-status-chip px-3 py-1.5">
              <Text className="happy-brand-eyebrow text-[11px]">
                {category}
              </Text>
            </View>
          </View>

          <Text
            className="happy-font-heading-bold mb-8 text-[30px] leading-tight tracking-tight text-ink"
            minimumFontScale={0.8}
            adjustsFontSizeToFit
          >
            {prompt}
          </Text>

          <View className="mt-auto h-14 flex-row items-center justify-center rounded-[22px] bg-brand-surface">
            <HugeiconsIcon
              icon={PencilEdit01Icon}
              size={19}
              color={SAGE[700]}
            />
            <Text className="happy-font-body-bold ml-2.5 text-[16px] tracking-tight text-ink">
              Start writing
            </Text>
          </View>
        </View>
      </PressableScale>
    </View>
  );
};
