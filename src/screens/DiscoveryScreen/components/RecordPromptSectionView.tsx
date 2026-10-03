import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { SymbolView } from "expo-symbols";
import {
  ConfigurableGlassMenu,
  type GlassMenuConfig,
} from "@/src/components/ui/ConfigurableGlassMenu";
import { useTranslation } from "react-i18next";
import { getCapturePromptKey } from "../capturePrompts";

type AnimatedTextStyle = React.ComponentProps<typeof Animated.Text>["style"];

export interface RecordPromptSectionViewProps {
  menuConfig: GlassMenuConfig;
  displayedPrompt: string;
  promptAnimStyle: AnimatedTextStyle;
  onShufflePrompt?: () => void;
  headerRight?: React.ReactNode;
}

// ponytail: pure presentational prompt section with unified header and quick-shuffle affordance
export const RecordPromptSectionView: React.FC<RecordPromptSectionViewProps> =
  React.memo(
    ({
      menuConfig,
      displayedPrompt,
      promptAnimStyle,
      onShufflePrompt,
      headerRight,
    }) => {
      const { t } = useTranslation("journal");
      const promptKey = getCapturePromptKey(displayedPrompt);
      const translatedPrompt = displayedPrompt === "Free Write"
        ? t("capture.freeWrite")
        : promptKey
          ? t(`capture.prompts.${promptKey}`, { defaultValue: displayedPrompt })
          : displayedPrompt;
      return (
        <View className="pt-0">
          {/* Top Row: Date Menu on Left, Header/Streak on Right */}
          <View className="flex-row items-center justify-between">
            <View className="-ml-1 flex-row items-center">
              <ConfigurableGlassMenu config={menuConfig} />
            </View>
            {headerRight}
          </View>

          {/* Prompt Hero Title */}
          <Animated.Text
            style={promptAnimStyle}
            className="mt-2 text-[27px] leading-[33px] tracking-tight text-ink happy-font-heading-bold"
          >
            {translatedPrompt}
          </Animated.Text>

          {/* Quick Shuffle Trigger */}
          {onShufflePrompt ? (
            <Pressable
              onPress={onShufflePrompt}
              hitSlop={8}
              className="flex-row items-center gap-1.5 self-start mt-2 px-2.5 py-1 rounded-full bg-black/[0.04] active:bg-black/[0.08]"
              accessibilityRole="button"
              accessibilityLabel={t("capture.shufflePrompt")}
            >
              <SymbolView
                name="arrow.triangle.2.circlepath"
                size={12}
                weight="semibold"
                tintColor="#616D5F"
              />
              <Text className="text-xs text-[#616D5F] happy-font-body-bold">
                {t("capture.shufflePrompt")}
              </Text>
            </Pressable>
          ) : null}
        </View>
      );
    }
  );

RecordPromptSectionView.displayName = "RecordPromptSectionView";
export default RecordPromptSectionView;
