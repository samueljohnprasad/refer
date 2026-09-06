import React, { useCallback } from "react";
import { Feather } from "@expo/vector-icons";
import { View, Alert } from "react-native";
import { recorderOpenAtom } from "./helpers";
import { useAtom } from "jotai";
import { HStack } from "@/components/ui/hstack";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Mic01Icon,
  Tick01Icon,
  PauseIcon,
} from "@hugeicons/core-free-icons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { Button } from "@/src/components/ui/Button";

export interface MicControlViewProps {
  isRecording: boolean;
  isPaused: boolean;
  durationSeconds: number;
  onToggleRecord: () => void;
  onStop: () => void;
  onDiscard?: () => void;
  isStopped: boolean;
}

const MicControlView: React.FC<MicControlViewProps> = ({
  isRecording,
  isPaused,
  onToggleRecord,
  onStop,
  onDiscard,
}) => {
  const [, setRecorderOpen] = useAtom(recorderOpenAtom);

  const handleDiscard = useCallback(() => {
    setRecorderOpen(false);
    onDiscard?.();
  }, [setRecorderOpen, onDiscard]);

  const confirmDiscard = useCallback(() => {
    Alert.alert(
      "Discard recording?",
      "This recording will be permanently deleted.",
      [
        { text: "Keep Recording", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: handleDiscard,
        },
      ]
    );
  }, [handleDiscard]);

  return (
    <View className="w-full items-center justify-center">
      <HStack className="justify-center items-center gap-8 h-24 w-full">
        {/* Left Action: Delete / Cancel Slot */}
        {!isRecording ? (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
          >
            <Button
              label=""
              variant="secondary"
              size="md"
              width={52}
              fullWidth={false}
              accessibilityLabel={isPaused ? "Discard recording" : "Cancel recording"}
              leftIcon={
                isPaused ? (
                  <Feather name="trash-2" size={20} color="#DC2626" />
                ) : (
                  <Feather
                    name="x"
                    size={20}
                    color={String(SEMANTIC_COLORS.text.secondary)}
                  />
                )
              }
              // ponytail: Button handles press-in haptic; no haptic on pressout/release
              onPress={() => {
                if (isPaused) {
                  confirmDiscard();
                } else {
                  handleDiscard();
                }
              }}
            />
          </Animated.View>
        ) : (
          /* Empty spacer to keep Center button centered */
          <View className="w-[52px] h-12 bg-transparent" />
        )}

        {/* Center Primary Action: Pause while recording, Resume while paused */}
        <Button
          label=""
          variant="primary"
          size="xl"
          width={76}
          fullWidth={false}
          leftIcon={
            isRecording ? (
              <HugeiconsIcon
                icon={PauseIcon}
                size={34}
                color={String(SEMANTIC_COLORS.surface.primary)}
              />
            ) : (
              // ponytail: plain mic for resume without overloaded AI sparkles
              <HugeiconsIcon
                icon={Mic01Icon}
                size={34}
                color={String(SEMANTIC_COLORS.surface.primary)}
              />
            )
          }
          // ponytail: Button handles press-in haptic; no haptic on pressout/release
          onPress={onToggleRecord}
          accessibilityLabel={isRecording ? "Pause recording" : "Resume recording"}
        />

        {/* Right Action: Done Button Slot */}
        {isPaused ? (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
          >
            {/* ponytail: medium Done button with text and icon, secondary to Resume */}
            <Button
              label="Done"
              variant="primary"
              size="md"
              width={88}
              fullWidth={false}
              accessibilityLabel="Finish recording"
              leftIcon={
                <HugeiconsIcon
                  icon={Tick01Icon}
                  size={18}
                  color={String(SEMANTIC_COLORS.surface.primary)}
                />
              }
              // ponytail: Button handles press-in haptic; no haptic on pressout/release
              onPress={onStop}
            />
          </Animated.View>
        ) : (
          /* Empty spacer to keep Center button centered */
          <View className="w-[88px] h-12 bg-transparent" />
        )}
      </HStack>
    </View>
  );
};

export default React.memo(MicControlView);
