import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useState, useEffect, useCallback, useRef } from "react";
import MicControlContainer from "./MicControlContainer";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useJournalEntry } from "@/hooks/useJournalEntry";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { selectedDateDiscoveryAtom } from "./helpers";
import { useAtom, useAtomValue } from "jotai";
import { formattedDateTime, formatTime } from "@/src/utils/date";
import { ReloadIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { startRecordingAtom } from "../DailyNotesScreen/atoms";
import useAudioRecording from "@/hooks/useAudioRecording";
import * as Haptics from "expo-haptics";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import { Feather } from "@expo/vector-icons";
import { createLogger } from "@/src/lib/logger";
import { StaggeredText, type StaggeredTextRef } from "@/src/animations/everybody-can-cook/components/staggered-text";
import { useInterval } from "@/src/hooks/useInterval";

const log = createLogger("VoiceRecorder");

interface VoiceRecorderProps {
  onStop: (uri: string, enableAIInsights: boolean) => void;
  onClose: () => void;
}

const RecordingStatus = () => {
  const opacity = useSharedValue(0.4);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View className="flex-row items-center justify-center mt-3 gap-2">
      <Animated.View style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#059669' }, animatedStyle]} />
      <Text className="text-emerald-600 text-sm happy-font-body-semibold">
        Recording
      </Text>
    </View>
  );
};

const VoiceRecorder = ({ onStop, onClose }: VoiceRecorderProps) => {
  const { currentPrompt, shufflePrompt } = useJournalEntry();
  const rotation = useSharedValue(0);
  const selectedDate = useAtomValue(selectedDateDiscoveryAtom);
  const [startRecording, setStartRecording] = useAtom(startRecordingAtom);
  const [enableAIInsights] = useState<boolean>(true);
  const textRef = useRef<StaggeredTextRef>(null);

  useEffect(() => {
    textRef.current?.reset();
    textRef.current?.animate();
  }, [currentPrompt]);

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    log.info("VoiceRecorder mounted");
  }, []);

  const lastShuffleTime = useRef(0);

  const handleShufflePrompt = useCallback(() => {
    const now = Date.now();
    if (now - lastShuffleTime.current > 300) {
      Haptics.selectionAsync();
      lastShuffleTime.current = now;
    }
    rotation.value = withSpring(rotation.value + 360, { damping: 20, stiffness: 100, overshootClamping: true });
    shufflePrompt();
    log.debug("Prompt shuffled");
  }, [shufflePrompt, rotation]);

  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const {
    recorderState,
    recordingCurrentState,
    record,
    pauseRecording,
    stopRecording,
    totalDuration,
  } = useAudioRecording();

  useInterval(
    () => {
      if (recordingCurrentState === "initial" && totalDuration === 0) {
        handleShufflePrompt();
      }
    },
    30000
  );

  const isStopped = recordingCurrentState === "stopped";

  const handleStopRecording = async () => {
    if (
      recordingCurrentState === "recording" ||
      recordingCurrentState === "paused"
    ) {
      log.info("Stopping audio recording...", { totalDuration });
      const pathState = await stopRecording();
      if (!pathState?.url) return;
      onStop(pathState.url, enableAIInsights);
    }
  };

  const handlePauseRecording = async () => {
    if (recordingCurrentState === "recording") {
      log.info("Pausing audio recording...");
      await pauseRecording();
    }
  };

  const handleStartRecording = async (): Promise<void> => {
    if (
      recordingCurrentState === "initial" ||
      recordingCurrentState === "paused"
    ) {
      log.info("Starting audio recording...");
      await record();
    }
  };

  const handleDiscardRecording = useCallback(async () => {
    log.info("Discarding audio recording...");
    try {
      if (
        recordingCurrentState === "recording" ||
        recordingCurrentState === "paused"
      ) {
        await stopRecording();
      }
    } catch (error) {
      log.error("Error discarding recording:", error);
    } finally {
      onClose();
    }
  }, [recordingCurrentState, stopRecording, onClose]);

  useEffect(() => {
    if (startRecording) {
      handleStartRecording();
    }
    return () => {
      setStartRecording(false);
    };
  }, [startRecording]);

  useEffect(() => {
    if (isStopped) {
      if (!recorderState?.url) return;
      onStop(recorderState.url, enableAIInsights);
    }
  }, [isStopped]);

  const handleCloseRecorder = useCallback(() => {
    if (totalDuration > 0) {
      Alert.alert(
        "Discard recording?",
        "This will permanently delete your current audio and cannot be undone.",
        [
          { text: "Keep Recording", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              handleDiscardRecording();
            },
          },
        ]
      );
    } else {
      onClose();
    }
  }, [totalDuration, handleDiscardRecording, onClose]);

  const isRecording = recordingCurrentState === "recording";
  const isPaused = recordingCurrentState === "paused";

  return (
    <View className="flex-1 bg-sage-50">
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>

        <View className="flex-1 justify-between px-6 py-6">
          {/* Top Header Row */}
          <View className="items-center justify-center h-12">
            <Text className="text-ink-soft text-sm happy-font-body-semibold">
              {formattedDateTime(selectedDate)}
            </Text>
          </View>

          {/* Center Section: Prompt Text & Shuffle */}
          <View className="flex-1 justify-center items-center py-8">
            <View key={currentPrompt} className="px-4 mb-5 w-full">
              <StaggeredText
                ref={textRef}
                text={currentPrompt}
                fontSize={28}
                textStyle={{
                  fontFamily: APP_FONT_FAMILIES.extraBold,
                  color: SEMANTIC_COLORS.text.primary,
                  lineHeight: 36,
                  textAlign: "center"
                }}
                containerStyle={{
                  justifyContent: 'center',
                }}
              />
            </View>
            
            <TouchableOpacity
              onPress={handleShufflePrompt}
              className="py-2 flex-row items-center gap-2 active:opacity-60"
              activeOpacity={0.7}
            >
              <Animated.View style={rotateStyle}>
                <HugeiconsIcon icon={ReloadIcon} size={16} color={SEMANTIC_COLORS.text.secondary} />
              </Animated.View>
              <Text className="text-ink-soft text-sm happy-font-body-semibold">
                Shuffle prompt
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Section: Timer Display and Controls */}
          <View className="items-center gap-6 pb-4">
            <View className="items-center">
              <Text 
                className="text-ink-soft text-5xl tracking-tight happy-font-body-bold"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {formatTime(totalDuration)}
              </Text>
              {isRecording && <RecordingStatus />}
              {isPaused && (
                <Text className="text-ink-soft text-sm mt-3 happy-font-body-semibold">
                  Paused
                </Text>
              )}
            </View>

            <MicControlContainer
              isRecording={isRecording}
              isPaused={isPaused}
              isStopped={isStopped}
              durationSeconds={recorderState.durationMillis / 1000}
              onToggleRecord={() => {
                Haptics.selectionAsync();
                if (isRecording) {
                  return handlePauseRecording();
                }
                return handleStartRecording();
              }}
              onStop={handleStopRecording}
              onDiscard={handleDiscardRecording}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default VoiceRecorder;
