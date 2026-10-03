import React, { useState, useEffect, useCallback, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import VoiceWaveform from "./VoiceWaveform";
import MicControlContainer from "./MicControlContainer";
import { SafeAreaView } from "@/src/components/tw";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useJournalEntry } from "@/hooks/useJournalEntry";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { selectedDateDiscoveryAtom } from "./helpers";
import { useAtom, useAtomValue } from "jotai";
import { formatTime } from "@/src/utils/date";
import { startRecordingAtom } from "../DailyNotesScreen/atoms";
import useAudioRecording from "@/hooks/useAudioRecording";
import * as Haptics from "expo-haptics";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { createLogger } from "@/src/lib/logger";
import { useInterval } from "@/src/hooks/useInterval";
import { useAppDispatch } from "@/src/store/hooks";
import { setVisible as setAssistantVisible } from "@/src/store/slices/happyAssistantSlice";
import { useTranslation } from "react-i18next";
import { VoiceRecorderPromptStage } from "./components/VoiceRecorderPromptStage";

const log = createLogger("VoiceRecorder");

interface VoiceRecorderProps {
  onStop: (uri: string, enableAIInsights: boolean) => void;
  onClose: () => void;
}

// ponytail: subtle pulse on recording dot (1 -> 0.4 -> 1 across ~1.3s)
const RecordingStatus = () => {
  const { t } = useTranslation("journal");
  const opacity = useSharedValue(1);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.4, { duration: 650 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View className="flex-row items-center justify-center mt-2 gap-2">
      <Animated.View
        style={[
          { width: 6, height: 6, borderRadius: 3, backgroundColor: "#059669" },
          animatedStyle,
        ]}
      />
      <Text className="text-emerald-600 text-sm happy-font-body-semibold">
        {t("capture.voice.recording")}
      </Text>
    </View>
  );
};

const VoiceRecorder = ({ onStop, onClose }: VoiceRecorderProps) => {
  const { i18n, t } = useTranslation("journal");
  const { currentPrompt, shufflePrompt } = useJournalEntry();
  const selectedDate = useAtomValue(selectedDateDiscoveryAtom);
  const [startRecording, setStartRecording] = useAtom(startRecordingAtom);
  const [enableAIInsights] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  // ponytail: hide floating panda assistant during voice recording
  useEffect(() => {
    dispatch(setAssistantVisible(false));
    return () => {
      dispatch(setAssistantVisible(true));
    };
  }, [dispatch]);

  useEffect(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    log.info("VoiceRecorder mounted");
  }, []);

  const lastShuffleTime = useRef(0);

  const handleShufflePrompt = useCallback(() => {
    const now = Date.now();
    if (now - lastShuffleTime.current > 300) {
      void Haptics.selectionAsync();
      lastShuffleTime.current = now;
    }
    shufflePrompt();
    log.debug("Prompt shuffled");
  }, [shufflePrompt]);

  const {
    recorderState,
    recordingCurrentState,
    record,
    pauseRecording,
    stopRecording,
    totalDuration,
  } = useAudioRecording();

  useInterval(() => {
    if (recordingCurrentState === "initial" && totalDuration === 0) {
      handleShufflePrompt();
    }
  }, 30000);

  const isRecording = recordingCurrentState === "recording";
  const isPaused = recordingCurrentState === "paused";
  const isStopped = recordingCurrentState === "stopped";
  const hasStarted = isRecording || isPaused || totalDuration > 0;

  const handleStopRecording = async () => {
    if (isRecording || isPaused) {
      log.info("Stopping audio recording...", { totalDuration });
      const pathState = await stopRecording();
      if (!pathState?.url) return;
      onStop(pathState.url, enableAIInsights);
    }
  };

  const handlePauseRecording = async () => {
    if (isRecording) {
      log.info("Pausing audio recording...");
      await pauseRecording();
    }
  };

  const handleStartRecording = async (): Promise<void> => {
    if (recordingCurrentState === "initial" || isPaused) {
      log.info("Starting audio recording...");
      await record();
    }
  };

  const handleDiscardRecording = useCallback(async () => {
    log.info("Discarding audio recording...");
    try {
      if (isRecording || isPaused) {
        await stopRecording();
      }
    } catch (error) {
      log.error("Error discarding recording:", error);
    } finally {
      onClose();
    }
  }, [isRecording, isPaused, stopRecording, onClose]);

  useEffect(() => {
    if (startRecording) {
      void handleStartRecording();
    }
    return () => {
      setStartRecording(false);
    };
  }, [startRecording]);

  useEffect(() => {
    if (isStopped && recorderState?.url) {
      onStop(recorderState.url, enableAIInsights);
    }
  }, [isStopped, recorderState?.url]);

  const handleCloseRecorder = useCallback(() => {
    if (hasStarted) {
      Alert.alert(
        t("capture.voice.discardTitle"),
        t("capture.voice.discardMessage"),
        [
          { text: t("capture.voice.keep"), style: "cancel" },
          {
            text: t("capture.voice.discard"),
            style: "destructive",
            onPress: () => {
              void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              void handleDiscardRecording();
            },
          },
        ]
      );
    } else {
      onClose();
    }
  }, [hasStarted, handleDiscardRecording, onClose, t]);

  return (
    <View className="flex-1 bg-sage-50">
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <View className="flex-1 justify-between px-6 py-5">
          {/* Top Header Row with Dismiss Affordance */}
          <View className="flex-row items-center justify-between h-11 px-1">
            <TouchableOpacity
              onPress={handleCloseRecorder}
              className="w-10 h-10 items-center justify-center rounded-full active:opacity-60"
              accessibilityLabel={t("capture.voice.close")}
              accessibilityRole="button"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Feather name="x" size={22} color={SEMANTIC_COLORS.text.secondary as string} />
            </TouchableOpacity>

            <Text
              className="text-xs happy-font-body-semibold"
              style={{ color: SEMANTIC_COLORS.text.secondary }}
            >
              {new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium", timeStyle: "short" }).format(selectedDate)}
            </Text>

            {/* Empty balance spacer so date stays centered */}
            <View className="w-10 h-10" />
          </View>

          {/* Center Section: Prompt, Waveform, Timer & Status */}
          <View className="flex-1 justify-center items-center py-2">
            <VoiceRecorderPromptStage
              key={currentPrompt}
              prompt={currentPrompt}
              hasStarted={hasStarted}
              onShuffle={handleShufflePrompt}
            />

            {/* ponytail: 25-bar live animated waveform */}
            <View className="mt-6 mb-2 w-full items-center">
              <VoiceWaveform
                isRecording={isRecording}
                isPaused={isPaused}
              />
            </View>

            {/* ponytail: timer directly below waveform creates unified sound instrument (Apple Journal benchmark) */}
            <View className="items-center mt-2">
              <Text
                className="text-ink-soft text-[38px] leading-[44px] tracking-tight happy-font-body-bold"
                style={{ fontVariant: ["tabular-nums"] }}
              >
                {formatTime(totalDuration)}
              </Text>
              {isRecording && <RecordingStatus />}
              {isPaused && (
                <Text className="text-ink-muted text-sm mt-1.5 happy-font-body-semibold">
                  {t("capture.voice.paused")}
                </Text>
              )}
            </View>
          </View>

          {/* Bottom Section: Controls anchored for comfortable thumb reach */}
          <View className="items-center pb-4">
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
              onDiscard={handleDiscardRecording}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default VoiceRecorder;
