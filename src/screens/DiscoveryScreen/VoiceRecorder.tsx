import React, { useState, useRef } from "react";
import { Box } from "@/components/ui/box";
import MindfulGradient, { GradientPosition } from "./MindfulGradient";
import MicControlContainer from "./MicControlContainer";
import { SafeAreaView } from "react-native-safe-area-context";
import useAudioRecording from "@/hooks/useAudioRecording";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { format } from "date-fns";
import { useJournalEntry } from "@/hooks/useJournalEntry";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { selectedDateDiscoveryAtom } from "./helpers";
import { useAtomValue } from "jotai";

interface VoiceRecorderProps {
  onStop: (uri: string) => void;
}
const VoiceRecorder = ({ onStop }: VoiceRecorderProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { currentPrompt, shufflePrompt } = useJournalEntry();
  const rotation = useSharedValue(0);
  const selectedDate = useAtomValue(selectedDateDiscoveryAtom);

  const formattedDate = format(selectedDate || new Date(), "MMMM d, yyyy");

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
  } = useAudioRecording();

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

  const isRecording = recordingCurrentState === "recording";
  const isPaused = recordingCurrentState === "paused";

  return (
    <SafeAreaView className="flex-1 flex justify-start" edges={["top"]}>
      <MindfulGradient position={"top"} isSpeaking={isSpeaking} />

      {/* Date Header - Centered */}
      <View className="px-6 mt-80 pb-4 items-center">
        <Text className="text-[#1F2937] text-base font-semibold">
          {formattedDate}
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
              <Feather name="refresh-cw" size={16} color="#7B61FF" />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>

      <Box className="w-full" style={{ height: 40 }}></Box>
      <MicControlContainer
        isRecording={isRecording}
        isPaused={isPaused}
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
