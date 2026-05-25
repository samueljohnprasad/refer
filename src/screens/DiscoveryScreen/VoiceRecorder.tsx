import React, { useState, useRef, useEffect } from "react";
import MindfulGradient from "./MindfulGradient";
import MicControlContainer from "./MicControlContainer";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity } from "react-native";
import { useJournalEntry } from "@/hooks/useJournalEntry";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { selectedDateDiscoveryAtom } from "./helpers";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { formattedDateTime, formatTime } from "@/src/utils/date";
import { ReloadIcon, SparklesIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { startRecordingAtom } from "../DailyNotesScreen/atoms";
import useAudioRecording from "@/hooks/useAudioRecording";
import * as Haptics from "expo-haptics";
import { SAGE } from "@/lib/tokens";

interface VoiceRecorderProps {
  onStop: (uri: string, enableAIInsights: boolean) => void;
}
const VoiceRecorder = ({ onStop }: VoiceRecorderProps) => {
  const { currentPrompt, shufflePrompt } = useJournalEntry();
  const rotation = useSharedValue(0);
  const selectedDate = useAtomValue(selectedDateDiscoveryAtom);
  const [startRecording, setStartRecording] = useAtom(startRecordingAtom);
  const [enableAIInsights, setEnableAIInsights] = useState<boolean>(true);

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, []);

  const handleShufflePrompt = () => {
    rotation.value = withSpring(rotation.value + 360, {
      damping: 15,
      stiffness: 150,
    });
    shufflePrompt();
  };

  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const {
    recorderState,
    recordedStatus,
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

  const isRecording = recordingCurrentState === "recording";
  const isPaused = recordingCurrentState === "paused";

  return (
    <SafeAreaView className="flex-1 flex justify-start" edges={["top"]}>
      <MindfulGradient position={"top"} isSpeaking={isRecording} />

      {/* Date Header - Centered */}
      <View className="px-6 mt-80 pb-4 items-center gap-6">
        <Text className="text-ink text-3xl happy-font-body-bold">
          {formatTime(totalDuration)}
        </Text>
        <Text className="text-ink-soft text-base happy-font-body-semibold">
          {formattedDateTime(selectedDate)}
        </Text>
      </View>

      {/* Prompt Section - No Card, Just Text */}
      <View className="px-6 pb-8">
        <View className="flex-row justify-between items-start">
          <Text className="flex-1 text-ink text-[30px] leading-9 pr-4 happy-font-heading-bold">
            {currentPrompt}
          </Text>
          <TouchableOpacity
            onPress={handleShufflePrompt}
            className="p-2 bg-sage-pill rounded-full"
            activeOpacity={0.7}
          >
            <Animated.View style={rotateStyle}>
              <HugeiconsIcon icon={ReloadIcon} size={18} color={SAGE[600]} />
            </Animated.View>
          </TouchableOpacity>
        </View>
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
    </SafeAreaView>
  );
};

export default VoiceRecorder;
