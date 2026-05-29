import React, { useState, useEffect, useCallback } from "react";
import MindfulGradient from "./MindfulGradient";
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

  const handleShufflePrompt = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    rotation.value = withSpring(rotation.value + 360, {
      damping: 15,
      stiffness: 150,
    });
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
    <View style={{ flex: 1, backgroundColor: "#F8FAF7" }}>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <MindfulGradient position={"top"} isSpeaking={isRecording} />

        <View className="flex-1 justify-between px-6 py-6">
          {/* Top Header Row */}
          <View className="flex-row justify-between items-center h-12">
            <TouchableOpacity
              onPress={handleCloseRecorder}
              className="p-2.5 rounded-full bg-sage-pill shadow-sm active:opacity-80"
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Close voice recorder"
            >
              <Feather name="x" size={20} color={INK_SOFT} />
            </TouchableOpacity>

            <Text className="text-ink-soft text-sm happy-font-body-semibold">
              {formattedDateTime(selectedDate)}
            </Text>

            {/* Hidden layout balancer */}
            <View className="w-11 h-11" />
          </View>

          {/* Center Section: Prompt Text & Shuffle */}
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-ink text-center text-[28px] leading-[36px] happy-font-heading-bold px-4 mb-5">
              {currentPrompt}
            </Text>
            
            <TouchableOpacity
              onPress={handleShufflePrompt}
              className="px-4 py-2 bg-sage-pill rounded-full flex-row items-center gap-2 shadow-sm active:opacity-80"
              activeOpacity={0.7}
            >
              <Animated.View style={rotateStyle}>
                <HugeiconsIcon icon={ReloadIcon} size={14} color={SAGE[600]} />
              </Animated.View>
              <Text className="text-sage-600 text-xs happy-font-body-bold">
                Shuffle prompt
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Section: Timer Display and Controls */}
          <View className="items-center gap-6 pb-4">
            <View className="items-center">
              <Text className="text-ink text-5xl tracking-tight happy-font-body-bold">
                {formatTime(totalDuration)}
              </Text>
              {isRecording && (
                <Text className="text-emerald-600 text-[11px] tracking-widest mt-1.5 happy-font-body-bold uppercase">
                  Recording...
                </Text>
              )}
              {isPaused && (
                <Text className="text-amber-600 text-[11px] tracking-widest mt-1.5 happy-font-body-bold uppercase">
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
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
