import {
  AudioModule,
  RecordingPresets,
  RecordingStatus,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import React, { useEffect, useState, useRef } from "react";
import { Alert, Linking } from "react-native";
import { useToast } from "heroui-native";
import { recorderOpenAtom } from "@/src/screens/DiscoveryScreen/helpers";
import { useAtom } from "jotai";
import { createLogger } from "@/src/lib/logger";

const log = createLogger("AudioRecording");

type recordStatus = "recording" | "paused" | "stopped" | "initial";

const useAudioRecording = () => {
  const [recorderOpen, setRecorderOpen] = useAtom(recorderOpenAtom);

  const [recordedStatus, setRecordedStatus] = useState<RecordingStatus | null>(
    null
  );
  const [recordingCurrentState, setRecordingCurrentState] =
    useState<recordStatus>("initial");
  const [totalDuration, setTotalDuration] = useState(0);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRecorder = useAudioRecorder(
    RecordingPresets.HIGH_QUALITY,
    (status) => {
      setRecordedStatus(status);
      if (status.isFinished) {
        log.info("Audio recorder finished recording", { url: status.url, id: status.id });
        setRecordingCurrentState("stopped");
      }
    }
  );
  const recorderState = useAudioRecorderState(audioRecorder);

  const { toast } = useToast();

  // Configure audio session on mount
  useEffect(() => {
    const configureAudioSession = async () => {
      try {
        log.info("Configuring audio session mode...");
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: true,
        });
        log.info("Audio session configured successfully");
      } catch (error) {
        log.error("Failed to configure audio session:", error);
      }
    };

    configureAudioSession();

    // Cleanup on unmount
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      log.debug("Cleaning up audio recording resources on unmount");
      setAudioModeAsync({
        playsInSilentMode: false,
        allowsRecording: false,
      }).catch((err) => log.error("Error resetting audio mode on unmount:", err));
    };
  }, []);

  const record = async () => {
    try {
      log.info("Requesting microphone recording permissions...");
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        log.warn("Microphone permission denied by user");
        Alert.alert(
          "Microphone Permission Needed",
          "Please enable microphone access in Settings.",
          [
            {
              text: "Open Settings",
              onPress: () => Linking.openURL("app-settings:"),
            },
            { text: "Cancel", style: "cancel" },
          ]
        );
        return setRecorderOpen(false);
      }

      log.info("Microphone permission granted, preparing audio recorder...");
      // Ensure audio mode is set before recording
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });

      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record({
        forDuration: 6000,
      });
      log.info("Audio recording initiated (preset: HIGH_QUALITY)");
      setRecordingCurrentState("recording");
      // Start timer
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setTotalDuration((prev) => prev + 1000); // +1 sec
      }, 1000);
    } catch (error) {
      log.error("Recording start error:", error);
      toast.show({
        placement: "top",
        variant: "danger",
        label: "Failed to start recording. Please try again.",
      });
    }
  };

  const stopRecording = async () => {
    try {
      log.info("Stopping audio recorder...", { totalDurationMs: totalDuration, url: recorderState?.url });
      await audioRecorder.stop();
      setRecordingCurrentState("stopped");
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      log.info("Audio recorder stopped successfully", { url: recorderState?.url });
      return recorderState;
    } catch (error) {
      log.error("Error stopping recording:", error);
    }
  };

  const pauseRecording = async () => {
    try {
      log.info("Pausing audio recorder...");
      audioRecorder.pause();
      setRecordingCurrentState("paused");
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      log.info("Audio recorder paused");
    } catch (error) {
      log.error("Error pausing recording:", error);
    }
  };

  return {
    recorderState,
    recordedStatus,
    recordingCurrentState,
    record,
    stopRecording,
    pauseRecording,
    totalDuration,
  };
};

export default useAudioRecording;
