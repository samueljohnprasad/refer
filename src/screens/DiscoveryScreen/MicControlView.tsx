import React, { useCallback } from "react";
import { View, TouchableOpacity, Dimensions, Pressable } from "react-native";
import { recorderOpenAtom } from "./helpers";
import { useAtom } from "jotai";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  AiMicIcon,
  Cancel01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import {
  BottomSheetTrigger,
  useBottomSheet,
} from "@/components/ui/bottomsheet";
import ShortBottomModalWithProvider from "@/src/components/ShortBottomModalWithProvider";
import { isAndroid } from "@/src/utils/mood";
import * as Haptics from "expo-haptics";
import { BRAND_SURFACE, INK, INK_SOFT, LIGHT_TOKENS, SAGE } from "@/lib/tokens";

// Props interface for the presenter component
export interface MicControlViewProps {
  // Core state props
  isRecording: boolean;
  isPaused: boolean;
  durationSeconds: number;

  onToggleRecord: () => void;
  onStop: () => void;
  isStopped: boolean;
}

const { width, height } = Dimensions.get("window");
const PANEL_HEIGHT = 200;

// Constants to prevent recreation
const CONTAINER_STOP_STYLE = {
  width: width * 0.68,
  height: height * 0.3,
  top: height / 1.6,
  transform: [{ translateX: width / 6 }],
};

const CONTAINER_STYLE = {
  width: width,
  height: PANEL_HEIGHT,
  shadowColor: SAGE[600],
  shadowOffset: { width: 0, height: -1 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 3,
};

const MicControlView: React.FC<MicControlViewProps> = ({
  isRecording,
  isPaused,
  onToggleRecord,
  onStop,
  durationSeconds,
  isStopped,
}) => {
  const [, setRecorderOpen] = useAtom(recorderOpenAtom);
  const { handleClose } = useBottomSheet();

  const handleDiscard = useCallback(() => {
    // Heavy haptic for destructive action (discard recording)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setRecorderOpen(false);
  }, [setRecorderOpen]);

  return (
    <>
      {isRecording && (
        <View style={[CONTAINER_STOP_STYLE, { position: "absolute" }]}>
          <Pressable
            onPress={() => {
              // Light haptic for pause/resume toggle
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              if (isAndroid) {
                return onStop();
              }
              onToggleRecord();
            }}
            style={{ width: "100%", height: "100%" }}
            className="justify-center bg-transparent rounded-full"
          />
        </View>
      )}
      {!isRecording && (
        <View
          style={CONTAINER_STYLE}
          className="absolute bottom-[50px] items-center pt-8 px-5"
        >
          <Box className="backdrop-blur-md w-full">
            <HStack className="justify-center items-center gap-10">
              {isPaused && (
                <View>
                  <BottomSheetTrigger>
                    <View className="h-12 w-12 items-center justify-center rounded-full bg-sage-pill">
                      <HugeiconsIcon
                        icon={Cancel01Icon}
                        size={26}
                        color={INK_SOFT}
                      />
                    </View>
                  </BottomSheetTrigger>
                </View>
              )}
              <View className="flex p-5 items-center justify-center mb-4 bg-sage-500 rounded-full">
                <TouchableOpacity
                  className="w-20 h-20 rounded-full justify-center items-center"
                  onPress={() => {
                    // Light haptic for record toggle
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onToggleRecord();
                  }}
                  activeOpacity={0.9}
                >
                  <View className="w-20 h-20 rounded-full justify-center items-center">
                    <HugeiconsIcon
                      icon={AiMicIcon}
                      size={48}
                      color={BRAND_SURFACE}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              {isPaused && (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      // Medium haptic for completion/submit action
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      onStop();
                    }}
                    activeOpacity={0.8}
                  >
                    <View className="h-12 w-12 items-center justify-center rounded-full bg-sage-pill">
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        size={26}
                        color={SAGE[500]}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </HStack>
          </Box>
        </View>
      )}
      <ShortBottomModalWithProvider>
        <View className="flex-1 px-2 pt-2 items-center justify-between pb-8">
          <View className="items-center w-full">
            {/* Icon Header */}
            <View className="w-14 h-14 rounded-full bg-red-50 items-center justify-center mb-5">
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={26}
                color={LIGHT_TOKENS.destructive}
              />
            </View>

            <Text className="text-center text-4xl happy-font-heading-bold text-ink mb-3 leading-10">
              Discard recording?
            </Text>

            <Text className="text-ink-muted text-center text-lg px-2 leading-7 happy-font-body-medium">
              This will permanently delete your current audio and cannot be
              undone.
            </Text>
          </View>

          <View className="flex-row gap-3 w-full mt-4">
            <Pressable
              onPress={() => {
                // Success haptic for keeping recording
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                );
                handleClose();
              }}
              className="flex-1 bg-sage-pill rounded-full flex-row items-center justify-center py-4 active:opacity-80"
            >
              <Text className="text-ink happy-font-body-bold text-lg mr-2">
                Keep Recording
              </Text>
              <HugeiconsIcon
                icon={Tick01Icon}
                size={20}
                color={INK}
              />
            </Pressable>

            <Pressable
              className="flex-1 bg-red-500 rounded-full flex-row items-center justify-center py-4 active:opacity-90"
              onPress={handleDiscard}
            >
              <Text className="text-white happy-font-body-bold text-lg mr-2">
                Discard
              </Text>
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={20}
                color={BRAND_SURFACE}
              />
            </Pressable>
          </View>
        </View>
      </ShortBottomModalWithProvider>
    </>
  );
};

export default React.memo(MicControlView);
