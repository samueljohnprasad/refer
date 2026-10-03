import React, { useCallback, useEffect, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { ReloadIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useTranslation } from "react-i18next";
import { StaggeredText, type StaggeredTextRef } from "@/src/animations/everybody-can-cook/components/staggered-text";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { getCapturePromptKey } from "../capturePrompts";

interface VoiceRecorderPromptStageProps {
  prompt: string;
  hasStarted: boolean;
  onShuffle: () => void;
}

export function VoiceRecorderPromptStage({ prompt, hasStarted, onShuffle }: VoiceRecorderPromptStageProps): React.JSX.Element {
  const { t } = useTranslation("journal");
  const promptRef = useRef<StaggeredTextRef>(null);
  const rotation = useSharedValue(0);
  const promptKey = getCapturePromptKey(prompt);
  const translatedPrompt = prompt === "Free Write"
    ? t("capture.freeWrite")
    : promptKey
      ? t(`capture.prompts.${promptKey}`, { defaultValue: prompt })
      : prompt;

  useEffect(() => {
    promptRef.current?.reset();
    promptRef.current?.animate();
  }, [prompt]);

  const handleShuffle = useCallback(() => {
    rotation.value = withSpring(rotation.value + 360, {
      damping: 20,
      stiffness: 100,
      overshootClamping: true,
    });
    onShuffle();
  }, [onShuffle, rotation]);
  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View className="px-4 mb-2 w-full">
      <StaggeredText
        ref={promptRef}
        text={translatedPrompt}
        fontSize={hasStarted ? 23 : 26}
        textStyle={{
          fontFamily: APP_FONT_FAMILIES.bold,
          color: SEMANTIC_COLORS.text.primary,
          lineHeight: hasStarted ? 30 : 34,
          textAlign: "center",
        }}
        containerStyle={{ justifyContent: "center" }}
      />
      {!hasStarted ? (
        <TouchableOpacity
          onPress={handleShuffle}
          className="py-2 px-3 flex-row items-center gap-2 active:opacity-60"
          activeOpacity={0.7}
          accessibilityLabel={t("capture.voice.shuffle")}
        >
          <Animated.View style={rotateStyle}>
            <HugeiconsIcon icon={ReloadIcon} size={16} color={SEMANTIC_COLORS.text.secondary} />
          </Animated.View>
          <Text className="text-ink-soft text-sm happy-font-body-semibold">
            {t("capture.shufflePrompt")}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
