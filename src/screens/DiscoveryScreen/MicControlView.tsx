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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("journal");
  const [, setRecorderOpen] = useAtom(recorderOpenAtom);

  const handleDiscard = useCallback(() => {
    setRecorderOpen(false);
    onDiscard?.();
  }, [setRecorderOpen, onDiscard]);

  const confirmDiscard = useCallback(() => {
    Alert.alert(
      t("capture.voice.discardTitle"),
      t("capture.voice.discardMessage"),
      [
        { text: t("capture.voice.keep"), style: "cancel" },
        {
          text: t("capture.voice.discard"),
          style: "destructive",
          onPress: handleDiscard,
        },
      ]
    );
  }, [handleDiscard, t]);

  return (
    <View className="w-full items-center justify-center">
      <HStack className="justify-center items-center gap-7 h-24 w-full">
        {/* Left Action: Delete / Cancel Slot (56px) */}
        {!isRecording ? (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
          >
            <Button
              label=""
              variant="secondary"
              size="md"
              width={56}
              round
              fullWidth={false}
              accessibilityLabel={isPaused ? t("capture.voice.discard") : t("capture.keyboard.cancel")}
              leftIcon={
                isPaused ? (
                  <Feather name="trash-2" size={20} color="#DC2626" />
                ) : (
                  <Feather
                    name="x"
                    size={20}
                    color="#71717A"
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
          /* Symmetrical empty spacer to keep Center button centered */
          <View className="w-[56px] h-[56px] bg-transparent" />
        )}

        {/* Center Primary Action: Pause while recording, Resume while paused (72px) */}
        <Button
          label=""
          variant="primary"
          size="xl"
          width={72}
          round
          fullWidth={false}
          leftIcon={
            isRecording ? (
              <HugeiconsIcon
                icon={PauseIcon}
                size={30}
                color="#FFFFFF"
              />
            ) : (
              // ponytail: crisp white mic on brand green for maximum contrast
              <HugeiconsIcon
                icon={Mic01Icon}
                size={32}
                color="#FFFFFF"
              />
            )
          }
          // ponytail: Button handles press-in haptic; no haptic on pressout/release
          onPress={onToggleRecord}
          accessibilityLabel={t(isRecording ? "capture.voice.pause" : "capture.voice.resume")}
        />

        {/* Right Action: Done Button Slot (56px) */}
        {isPaused ? (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
          >
            {/* ponytail: secondary tactile 56px finish button with green checkmark to prevent 2 solid green buttons fighting */}
            <Button
              label=""
              variant="secondary"
              size="md"
              width={56}
              round
              fullWidth={false}
              accessibilityLabel={t("capture.voice.finish")}
              leftIcon={
                <HugeiconsIcon
                  icon={Tick01Icon}
                  size={24}
                  color="#587C51"
                />
              }
              // ponytail: Button handles press-in haptic; no haptic on pressout/release
              onPress={onStop}
            />
          </Animated.View>
        ) : (
          /* Symmetrical empty spacer to keep Center button centered */
          <View className="w-[56px] h-[56px] bg-transparent" />
        )}
      </HStack>
    </View>
  );
};

export default React.memo(MicControlView);
