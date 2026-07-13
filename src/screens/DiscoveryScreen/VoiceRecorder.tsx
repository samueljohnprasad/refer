import React, { useState, useEffect, useCallback, useRef } from "react";
import MicControlContainer from "./MicControlContainer";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useJournalEntry } from "@/hooks/useJournalEntry";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { selectedDateDiscoveryAtom } from "./helpers";
import { useAtom, useAtomValue } from "jotai";
import { formattedDateTime, formatTime } from "@/src/utils/date";
import { ReloadIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { startRecordingAtom } from "../DailyNotesScreen/atoms";
import useAudioRecording from "@/hooks/useAudioRecording";
import * as Haptics from "expo-haptics";
import { SAGE, INK_SOFT } from "@/lib/tokens";
import { Feather } from "@expo/vector-icons";

interface VoiceRecorderProps {
  onStop: (uri: string, enableAIInsights: boolean) => void;
  onClose: () => void;
}

const VoiceRecorder = ({ onStop, onClose }: VoiceRecorderProps) => {
  const { currentPrompt, shufflePrompt } = useJournalEntry();
  const rotation = useSharedValue(0);
  const selectedDate = useAtomValue(selectedDateDiscoveryAtom);
  const [startRecording, setStartRecording] = useAtom(startRecordingAtom);
  const [enableAIInsights] = useState<boolean>(true);

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
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

  const isStopped = recordingCurrentState === "stopped";

  const handleStopRecording = async () => {
    if (
      recordingCurrentState === "recording" ||
      recordingCurrentState === "paused"
    ) {
      const pathState = await stopRecording();
      if (!pathState?.url) return;
      onStop(pathState.url, enableAIInsights);
    }
  };

  const handlePauseRecording = async () => {
    if (recordingCurrentState === "recording") {
      await pauseRecording();
    }
  };

  const handleStartRecording = async (): Promise<void> => {
    if (
      recordingCurrentState === "initial" ||
      recordingCurrentState === "paused"
    ) {
      await record();
    }
  };

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
              onClose();
            },
          },
        ]
      );
    } else {
      onClose();
    }
  }, [totalDuration, onClose]);

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
            <Text className="text-ink text-center text-[28px] leading-[36px] happy-font-heading-bold px-4 mb-5">
              {currentPrompt}
            </Text>
            
            <TouchableOpacity
              onPress={handleShufflePrompt}
              className="py-2 flex-row items-center gap-2 active:opacity-60"
              activeOpacity={0.7}
            >
              <Animated.View style={rotateStyle}>
                <HugeiconsIcon icon={ReloadIcon} size={16} color={INK_SOFT} />
              </Animated.View>
              <Text className="text-ink-soft text-sm happy-font-body-semibold">
                Shuffle prompt
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Section: Timer Display and Controls */}
          <View className="items-center gap-6 pb-4">
            <View className="items-center">
              <Text className="text-ink-soft text-5xl tracking-tight happy-font-body-bold">
                {formatTime(totalDuration)}
              </Text>
              {isRecording && (
                <Text className="text-emerald-600 text-sm mt-3 happy-font-body-semibold">
                  Recording...
                </Text>
              )}
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
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default VoiceRecorder;
