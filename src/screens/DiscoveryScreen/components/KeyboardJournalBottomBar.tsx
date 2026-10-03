import React, { memo } from "react";
import { View } from "react-native";
import { Button } from "@/src/components/ui/Button";
import WhisperUI from "@/src/components/ui/swiftui";
import { useVoiceFeature } from "@/src/hooks/useVoiceFeature";
import { useTranslation } from "react-i18next";

interface KeyboardJournalBottomBarProps {
  paddingBottom: number;
  hasText: boolean;
  isSubmitDisabled: boolean;
  isRealtimeActive: boolean;
  setIsRealtimeActive: (active: boolean) => void;
  setRealtimeResult: (text: string) => void;
  onVoiceStop: () => void;
  onSubmit: () => void;
}

export const KeyboardJournalBottomBar: React.FC<KeyboardJournalBottomBarProps> = memo(
  ({
    paddingBottom,
    isSubmitDisabled,
    isRealtimeActive,
    setIsRealtimeActive,
    setRealtimeResult,
    onVoiceStop,
    onSubmit,
  }) => {
    const { isVoiceEnabled, isLocalTranscription } = useVoiceFeature();
    const { t } = useTranslation("journal");

    return (
      <View
        className="px-5 pt-3 bg-transparent"
        style={{ paddingBottom }}
      >
        <View className="flex-row items-center gap-3">
          {/* Left: Speak transcription tool */}
          {isVoiceEnabled && isLocalTranscription ? (
            <WhisperUI
              setRealtimeResult={setRealtimeResult}
              onStop={onVoiceStop}
              isRealtimeActive={isRealtimeActive}
              setIsRealtimeActive={setIsRealtimeActive}
            />
          ) : null}

          {/* Right: Confident Duolingo 3D primary action button */}
          <View className="flex-1">
            <Button
              disabled={isSubmitDisabled || isRealtimeActive}
              onPress={onSubmit}
              variant="primary"
              size="md"
              fullWidth
              accessibilityLabel={t("capture.keyboard.finish")}
              label={t("capture.keyboard.done")}
              haptic="medium"
            />
          </View>
        </View>
      </View>
    );
  }
);

KeyboardJournalBottomBar.displayName = "KeyboardJournalBottomBar";
