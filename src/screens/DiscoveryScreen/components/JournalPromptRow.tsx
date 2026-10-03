import React, { memo, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { CircleArrowReload01Icon, StarsIcon } from "@hugeicons/core-free-icons";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { useTranslation } from "react-i18next";
import { getCapturePromptKey } from "../capturePrompts";

interface JournalPromptRowProps {
  prompt: string;
  onShuffle: () => void;
}

export const JournalPromptRow: React.FC<JournalPromptRowProps> = memo(
  ({ prompt, onShuffle }) => {
    const { t } = useTranslation("journal");
    const rotation = useSharedValue(0);
    const promptKey = getCapturePromptKey(prompt);
    const translatedPrompt = prompt === "Free Write"
      ? t("capture.freeWrite")
      : promptKey
        ? t(`capture.prompts.${promptKey}`, { defaultValue: prompt })
        : prompt;

    const handlePress = useCallback(() => {
      void Haptics.selectionAsync().catch(() => {});
      rotation.value = withSpring(rotation.value + 360, {
        damping: 18,
        stiffness: 120,
        overshootClamping: true,
      });
      onShuffle();
    }, [rotation, onShuffle]);

    const rotateStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${rotation.value}deg` }],
    }));

    return (
      <View className="mb-4">
        {/* Context metadata & Shuffle action */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-1.5">
            <HugeiconsIcon icon={StarsIcon} size={14} color="#D97706" />
            <Text className="text-[12px] text-ink-soft happy-font-caption font-semibold">
              {t("capture.dailyReflectionXP", { defaultValue: "Daily Reflection • +10 XP" })}
            </Text>
          </View>

          <Pressable
            onPress={handlePress}
            accessibilityLabel={t("capture.shufflePrompt")}
            accessibilityRole="button"
            className="w-8 h-8 items-center justify-center rounded-full bg-white/80 border border-ink/8 active:scale-95 shadow-2xs"
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Animated.View style={rotateStyle}>
              <HugeiconsIcon
                icon={CircleArrowReload01Icon}
                size={16}
                color={SEMANTIC_COLORS.text.secondary}
              />
            </Animated.View>
          </Pressable>
        </View>

        {/* Hero prompt text */}
        <Text className="text-ink text-[24px] leading-[31px] happy-font-heading-medium tracking-tight">
          {translatedPrompt}
        </Text>
      </View>
    );
  }
);

JournalPromptRow.displayName = "JournalPromptRow";
