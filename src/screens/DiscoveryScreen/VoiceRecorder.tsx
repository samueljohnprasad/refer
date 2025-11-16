import React, { useState, useRef, useEffect } from "react";
import MindfulGradient from "./MindfulGradient";
import MicControlContainer from "./MicControlContainer";
import { SafeAreaView } from "react-native-safe-area-context";
import useAudioRecording from "@/hooks/useAudioRecording";
import { View, Text, TouchableOpacity } from "react-native";
import { useJournalEntry } from "@/hooks/useJournalEntry";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { selectedDateDiscoveryAtom } from "./helpers";
import { useAtomValue } from "jotai";
import { formattedDateTime, formatTime } from "@/src/utils/date";
import { ReloadIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";

interface VoiceRecorderProps {
  onStop: (uri: string) => void;
}
const VoiceRecorder = ({ onStop }: VoiceRecorderProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { currentPrompt, shufflePrompt } = useJournalEntry();
  const rotation = useSharedValue(0);
  const selectedDate = useAtomValue(selectedDateDiscoveryAtom);

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
      setIsSpeaking(false);

      if (!pathState?.url) return;
      onStop(pathState.url);
    }
  };

  const handlePauseRecording = async () => {
    if (recordingCurrentState === "recording") {
      await pauseRecording();
    }
    setIsSpeaking(false);
  };

  const handleStartRecording = async (): Promise<void> => {
    if (
      recordingCurrentState === "initial" ||
      recordingCurrentState === "paused"
    ) {
      await record();
      setIsSpeaking(true);
    }
  };

  useEffect(() => {
    if (isStopped) {
      if (!recorderState?.url) return;
      onStop(recorderState.url);
    }
  }, [isStopped]);

  const isRecording = recordingCurrentState === "recording";
  const isPaused = recordingCurrentState === "paused";

  return (
    <SafeAreaView className="flex-1 flex justify-start" edges={["top"]}>
      <MindfulGradient position={"top"} isSpeaking={isSpeaking} />

      {/* Date Header - Centered */}
      <View className="px-6 mt-80 pb-4 items-center">
        <Text className="text-[#1F2937] text-3xl font-bold">
          {formatTime(totalDuration)}
        </Text>
        <Text className="text-[#1F2937] text-base font-semibold">
          {formattedDateTime(selectedDate)}
        </Text>
      </View>

      {/* Prompt Section - No Card, Just Text */}
      <View className="px-6 pb-8">
        <View className="flex-row justify-between items-start">
          <Text className="flex-1 text-[#1F2937] text-2xl font-bold leading-tight pr-4">
            {currentPrompt}
          </Text>
          <TouchableOpacity
            onPress={handleShufflePrompt}
            className="p-1.5 bg-[#7B61FF]/10 rounded-full"
            activeOpacity={0.7}
          >
            <Animated.View style={rotateStyle}>
              <HugeiconsIcon icon={ReloadIcon} size={16} color="#7B61FF" />
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
