import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
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
import { Check } from "lucide-react-native";

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
  // const activeTheme = useSeasonalTheme();
  const [recorderOpen, setRecorderOpen] = useAtom(recorderOpenAtom);
  return (
    <BottomSheet>
      {isRecording && (
        <Pressable
          onPress={() => onToggleRecord()}
          style={[styles.containerStop, { width: width / 2 }]}
        ></Pressable>
      )}
      {!isRecording && (
        <View style={[styles.container, { width: width }]}>
          <Box className="backdrop-blur-md w-full  ">
            {/* Top section with timer and breathing guide */}
            {/* <View style={styles.timerSection}>
    <Text style={styles.timer}>{formattedDuration}</Text>
  </View> */}
            <HStack className="justify-center items-center gap-10">
              {isPaused && (
                <Animated.View
                  style={[
                    {
                      opacity: breathingOpacity.interpolate({
                        inputRange: [0.6, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ]}
                >
                  <BottomSheetTrigger>
                    {/* <Ionicons name="checkmark-circle" size={20} color="#EF4444" /> */}
                    <Feather name="mic" />
                  </BottomSheetTrigger>
                </Animated.View>
              )}

              {/* Main mic button with modern design */}

              <Animated.View
                style={[
                  styles.buttonContainer,
                  {
                    transform: [{ scale: heartbeatScale }],
                  },
                ]}
                className="flex items-center justify-center"
              >
                {/* Outer glow ring for recording state */}
                {isRecording && (
                  <Animated.View
                    style={[
                      styles.outerGlow,
                      {
                        backgroundColor: "#EF444420",
                        transform: [{ scale: glowScale }],
                        opacity: breathingOpacity,
                      },
                    ]}
                  />
                )}
                <TouchableOpacity
                  style={styles.mainButtonWrapper}
                  onPress={onToggleRecord}
                  activeOpacity={0.9}
                >
                  <View
                    style={[
                      styles.simpleButton,
                      {
                        backgroundColor: isRecording ? "#EF4444" : "#EF4444",
                        shadowColor: "#EF4444",
                      },
                    ]}
                  >
                    {isRecording ? (
                      <Feather name="mic" />
                    ) : (
                      <Feather name="mic" />
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>

              {isPaused && (
                <Animated.View
                  style={[
                    {
                      opacity: breathingOpacity.interpolate({
                        inputRange: [0.6, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ]}
                >
                  <TouchableOpacity onPress={onStop} activeOpacity={0.8}>
                    <View>
                      {/* <Ionicons name="checkmark-circle" size={20} color="#EF4444" /> */}
                      <Check />
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
          <Button onPress={() => setRecorderOpen(false)}>
            <ButtonText>Discard</ButtonText>
          </Button>
        </Center>
      </ShortBottomModal>
    </BottomSheet>
  );
};

const PANEL_HEIGHT = 200;

const styles = StyleSheet.create({
  containerStop: {
    height: PANEL_HEIGHT,
    position: "absolute",
    top: height / 1.7,
    transform: [{ translateX: width / 4 }],
    justifyContent: "center",
    backgroundColor: "transparent",
    borderRadius: "50%",
  },
  container: {
    height: PANEL_HEIGHT,
    position: "absolute",
    bottom: 50,
    alignItems: "center",
    paddingTop: 32,
    paddingHorizontal: 20,
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  timerSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  timer: {
    fontSize: 20,
    fontWeight: "700",
    color: "rgba(60, 60, 60, 0.9)",
    letterSpacing: 0.5,
  },
  outerGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  simpleButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  mainButtonWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MicControlView;
