import React, { useMemo, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  Pressable,
} from "react-native";
import { recorderOpenAtom } from "./helpers";
import { useAtom } from "jotai";
import { BottomSheet, BottomSheetTrigger } from "@/components/ui/bottomsheet";
import { Box } from "@/components/ui/box";
import { Feather } from "@expo/vector-icons";
import { HStack } from "@/components/ui/hstack";
import ShortBottomModal from "@/src/components/ShortBottomModal";
import { Center } from "@/components/ui/center";
import { Button, ButtonText } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  AiMicIcon,
  Cancel01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";

// Props interface for the presenter component
export interface MicControlViewProps {
  // Core state props
  isRecording: boolean;
  isPaused: boolean;
  durationSeconds: number;

  // Action props
  onToggleRecord: () => void;
  onStop: () => void;

  // Animation props
  heartbeatScale: Animated.Value;
  breathingOpacity: Animated.Value;
  glowScale: Animated.Value;
  waveFlow: Animated.Value;

  // Computed props
  formattedDuration: string;
}

/**
 * MicControlView - Pure presenter component for mic control UI
 * Receives all data and callbacks via props, handles only rendering
 */
const { width, height } = Dimensions.get("window");
const PANEL_HEIGHT = 200;

// Constants to prevent recreation
const CONTAINER_STOP_STYLE = {
  width: width / 2,
  height: PANEL_HEIGHT,
  top: height / 1.7,
  transform: [{ translateX: width / 4 }],
} as const;

const CONTAINER_STYLE = {
  width: width,
  height: PANEL_HEIGHT,
  shadowColor: "rgba(0, 0, 0, 0.05)",
  shadowOffset: { width: 0, height: -1 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 3,
} as const;

const MIC_BUTTON_SHADOW = {
  shadowColor: "#EF4444",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 4,
} as const;

const MicControlView: React.FC<MicControlViewProps> = ({
  isRecording,
  isPaused,
  durationSeconds,
  onToggleRecord,
  onStop,
  heartbeatScale,
  breathingOpacity,
  glowScale,
  waveFlow,
  formattedDuration,
}) => {
  const [recorderOpen, setRecorderOpen] = useAtom(recorderOpenAtom);

  const handleDiscard = useCallback(() => {
    setRecorderOpen(false);
  }, [setRecorderOpen]);

  const micButtonStyle = useMemo(
    () => ({
      backgroundColor: isRecording ? "#EF4444" : "#EF4444",
      ...MIC_BUTTON_SHADOW,
    }),
    [isRecording]
  );

  const glowStyle = useMemo(
    () => ({
      backgroundColor: "#EF444420",
      transform: [{ scale: glowScale }],
      opacity: breathingOpacity,
    }),
    [glowScale, breathingOpacity]
  );

  const heartbeatTransform = useMemo(
    () => ({
      transform: [{ scale: heartbeatScale }],
    }),
    [heartbeatScale]
  );

  const pausedOpacityStyle = useMemo(
    () => ({
      opacity: breathingOpacity.interpolate({
        inputRange: [0.6, 1],
        outputRange: [0.8, 1],
      }),
    }),
    [breathingOpacity]
  );

  return (
    <BottomSheet>
      {isRecording && (
        <Pressable
          onPress={onToggleRecord}
          style={CONTAINER_STOP_STYLE}
          className="absolute justify-center bg-transparent rounded-full"
        />
      )}
      {!isRecording && (
        <View
          style={CONTAINER_STYLE}
          className="absolute bottom-[50px] items-center pt-8 px-5"
        >
          <Box className="backdrop-blur-md w-full">
            <HStack className="justify-center items-center gap-10">
              {isPaused && (
                <Animated.View style={pausedOpacityStyle}>
                  <BottomSheetTrigger>
                    <HugeiconsIcon icon={Cancel01Icon} size={32} />
                  </BottomSheetTrigger>
                </Animated.View>
              )}

              {/* Main mic button with modern design */}
              <Animated.View
                style={heartbeatTransform}
                className="flex items-center justify-center mb-4"
              >
                {/* Outer glow ring for recording state */}
                {isRecording && (
                  <Animated.View
                    style={glowStyle}
                    className="absolute w-[120px] h-[120px] rounded-full"
                  />
                )}
                <TouchableOpacity
                  className="w-20 h-20 rounded-full justify-center items-center"
                  onPress={onToggleRecord}
                  activeOpacity={0.9}
                >
                  <View
                    style={micButtonStyle}
                    className="w-20 h-20 rounded-full justify-center items-center"
                  >
                    <HugeiconsIcon icon={AiMicIcon} size={32} />
                  </View>
                </TouchableOpacity>
              </Animated.View>

              {isPaused && (
                <Animated.View style={pausedOpacityStyle}>
                  <TouchableOpacity onPress={onStop} activeOpacity={0.8}>
                    <View>
                      <HugeiconsIcon icon={Tick01Icon} size={32} />
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </HStack>
          </Box>
        </View>
      )}

      <ShortBottomModal>
        <Center>
          <Button onPress={handleDiscard}>
            <ButtonText>Discard</ButtonText>
          </Button>
        </Center>
      </ShortBottomModal>
    </BottomSheet>
  );
};

export default React.memo(MicControlView);
