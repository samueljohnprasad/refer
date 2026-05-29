import React, { useCallback } from "react";
import { View, Alert } from "react-native";
import { recorderOpenAtom } from "./helpers";
import { useAtom } from "jotai";
import { HStack } from "@/components/ui/hstack";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  AiMicIcon,
  Cancel01Icon,
  Tick01Icon,
  PauseIcon,
} from "@hugeicons/core-free-icons";
import * as Haptics from "expo-haptics";
import { BRAND_SURFACE, INK_SOFT } from "@/lib/tokens";
import { Button } from "@/src/components/ui/Button";

// Props interface for the presenter component
export interface MicControlViewProps {
  isRecording: boolean;
  isPaused: boolean;
  durationSeconds: number;
  onToggleRecord: () => void;
  onStop: () => void;
  isStopped: boolean;
}

const MicControlView: React.FC<MicControlViewProps> = ({
  isRecording,
  isPaused,
  onToggleRecord,
  onStop,
}) => {
  const [, setRecorderOpen] = useAtom(recorderOpenAtom);

  const handleDiscard = useCallback(() => {
    // Heavy haptic for destructive action (discard recording)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setRecorderOpen(false);
  }, [setRecorderOpen]);

  return (
    <View className="w-full items-center justify-center">
      {/* Dynamic button panel */}
      <HStack className="justify-center items-center gap-10 h-24 w-full">
        {/* Cancel Button Slot */}
        {isPaused ? (
          <Button
            label=""
            variant="secondary"
            size="lg"
            width={56}
            fullWidth={false}
            leftIcon={
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={22}
                color={INK_SOFT}
              />
            }
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert(
                "Discard recording?",
                "This will permanently delete your current audio and cannot be undone.",
                [
                  { text: "Keep Recording", style: "cancel" },
                  {
                    text: "Discard",
                    style: "destructive",
                    onPress: () => {
                      handleDiscard();
                    },
                  },
                ]
              );
            }}
          />
        ) : (
          /* Empty spacer to keep Center button centered */
          <View className="w-14 h-14 bg-transparent" />
        )}

        {/* Center Mic/Pause Toggle */}
        <Button
          label=""
          variant="primary"
          size="xl"
          width={80}
          fullWidth={false}
          leftIcon={
            isRecording ? (
              <HugeiconsIcon
                icon={PauseIcon}
                size={36}
                color={BRAND_SURFACE}
              />
            ) : (
              <HugeiconsIcon
                icon={AiMicIcon}
                size={36}
                color={BRAND_SURFACE}
              />
            )
          }
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onToggleRecord();
          }}
          accessibilityLabel={isRecording ? "Pause recording" : "Start recording"}
        />

        {/* Check/Done Button Slot */}
        {isPaused ? (
          <Button
            label=""
            variant="primary"
            size="lg"
            width={56}
            fullWidth={false}
            leftIcon={
              <HugeiconsIcon
                icon={Tick01Icon}
                size={22}
                color={BRAND_SURFACE}
              />
            }
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onStop();
            }}
          />
        ) : (
          /* Empty spacer to keep Center button centered */
          <View className="w-14 h-14 bg-transparent" />
        )}
      </HStack>
    </View>
  );
};

export default React.memo(MicControlView);
