import React, { memo } from "react";
import { View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Tick01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/src/components/ui/Button";
import WhisperUI from "@/src/components/ui/swiftui";
import { useVoiceFeature } from "@/src/hooks/useVoiceFeature";

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
    hasText,
    isSubmitDisabled,
    isRealtimeActive,
    setIsRealtimeActive,
    setRealtimeResult,
    onVoiceStop,
    onSubmit,
  }) => {
    const { isVoiceEnabled, isLocalTranscription } = useVoiceFeature();

    return (
      // ponytail: seamless transparent bottom toolbar matching warm page background
      <View
        className="px-5 pt-3 bg-transparent"
        style={{ paddingBottom }}
      >
        <View className="flex-row items-center justify-between">
          {isVoiceEnabled && isLocalTranscription ? (
            <WhisperUI
              setRealtimeResult={setRealtimeResult}
              onStop={onVoiceStop}
              isRealtimeActive={isRealtimeActive}
              setIsRealtimeActive={setIsRealtimeActive}
            />
          ) : (
            // ponytail: empty placeholder preserves right-aligned Done button
            <View />
          )}

          <Button
            disabled={isSubmitDisabled || isRealtimeActive}
            onPress={onSubmit}
            variant="primary"
            size="sm"
            width={hasText ? 90 : 44}
            fullWidth={false}
            accessibilityLabel="Finish journal entry"
            label={hasText ? "Done" : undefined}
            leftIcon={
              hasText ? undefined : (
                <HugeiconsIcon
                  icon={Tick01Icon}
                  size={18}
                  color="#475569"
                />
              )
            }
          />
        </View>
      </View>
    );
  }
);

KeyboardJournalBottomBar.displayName = "KeyboardJournalBottomBar";
