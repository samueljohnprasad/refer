import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { TranscribeRealtimeOptions } from "whisper.rn/index.js";
import {
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
} from "expo-audio";
import { useWhisperModels } from "@/hooks/ai/useWhisperModels";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import { Button } from "@/src/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Mic01Icon } from "@hugeicons/core-free-icons";
import { SoundWaveIcon } from "@/src/components/ui/SoundWaveIcon";

// ─── Speak Button ───────────────────────────────────────────────────────────

interface SpeakButtonProps {
  isActive: boolean;
  isDisabled: boolean;
  isLoading: boolean;
  onPress: () => void;
}

const SpeakButton = ({
  isActive,
  isDisabled,
  isLoading,
  onPress,
}: SpeakButtonProps): React.JSX.Element => {
  const getButtonText = (): string => {
    if (isLoading && isActive) return "Stopping...";
    if (isLoading && !isActive) return "Starting...";
    if (isActive) return "Listening...";
    return "Speak";
  };

  // ponytail: outlined/light secondary button per audit; never filled green
  return (
    <Button
      disabled={isDisabled || isLoading}
      onPress={onPress}
      variant="secondary"
      size="sm"
      fullWidth={false}
      width={isActive ? 120 : 106}
      accessibilityLabel={isActive ? "Stop speaking" : "Speak to transcribe"}
      leftIcon={
        isLoading ? (
          <ActivityIndicator
            size="small"
            color={String(SEMANTIC_COLORS.text.primary)}
          />
        ) : isActive ? (
          <SoundWaveIcon
            isActive={true}
            size={15}
            color={String(SEMANTIC_COLORS.text.primary)}
          />
        ) : (
          <HugeiconsIcon
            icon={Mic01Icon}
            size={17}
            color={String(SEMANTIC_COLORS.text.primary)}
          />
        )
      }
      label={getButtonText()}
    />
  );
};

type WhisperUIProps = {
  setRealtimeResult: (result: string) => void;
  onStop: () => void;
  setIsRealtimeActive: (text: boolean) => void;
  isRealtimeActive: boolean;
};

export default function WhisperUI({
  setRealtimeResult,
  onStop,
  setIsRealtimeActive,
  isRealtimeActive,
}: WhisperUIProps) {
  const [realtimeTranscriber, setRealtimeTranscriber] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    whisperContext,
    isInitializingModel,
    isDownloading,
    currentModelId,
    initializeWhisperModel,
    getCurrentModel,
    getDownloadProgress,
  } = useWhisperModels();

  useEffect(() => {
    initializeModel();
  }, []);

  const initializeModel = async (modelId: string = "tiny") => {
    try {
      await initializeWhisperModel(modelId, { initVad: false });
    } catch (error) {
      console.error("Failed to initialize model:", error);
      setError(`Failed to initialize model: ${error}`);
    }
  };

  const ensureMicrophonePermission = async (): Promise<boolean> => {
    if (Platform.OS === "web") {
      Alert.alert(
        "Unsupported Platform",
        "Real-time transcription is not available on the web."
      );
      return false;
    }

    const getPermissionText = (blocked: boolean) =>
      blocked
        ? Platform.OS === "android"
          ? "Please enable microphone access in Android Settings to use real-time transcription."
          : "Please enable microphone access in iOS Settings to use real-time transcription."
        : "Microphone permission is required for real-time transcription.";

    try {
      let permissionStatus = await getRecordingPermissionsAsync();

      if (permissionStatus.granted) {
        return true;
      }

      if (!permissionStatus.canAskAgain) {
        Alert.alert("Microphone Permission", getPermissionText(true));
        console.warn("Microphone permission permanently denied.");
        return false;
      }

      permissionStatus = await requestRecordingPermissionsAsync();

      if (permissionStatus.granted) {
        return true;
      }

      const blocked = !permissionStatus.canAskAgain;
      Alert.alert("Microphone Permission", getPermissionText(blocked));
      console.warn("Microphone permission not granted:", permissionStatus);
      return false;
    } catch (err) {
      console.error("Failed to verify microphone permission:", err);
      Alert.alert(
        "Microphone Permission",
        "Unable to verify microphone permission. Please try again."
      );
      return false;
    }
  };

  const startRealtimeTranscription = async () => {
    if (!whisperContext) {
      Alert.alert("Error", "Whisper not initialized");
      return;
    }

    setIsLoading(true);
    try {
      const hasMicPermission = await ensureMicrophonePermission();
      if (!hasMicPermission) {
        setError("Real-time transcription requires microphone access.");
        setIsLoading(false);
        return;
      }

      setRealtimeResult("");
      setError("");

      const realtimeOptions: TranscribeRealtimeOptions = {
        language: "en",
        realtimeAudioSec: 300,
        realtimeAudioSliceSec: 20,
        realtimeAudioMinSec: 2,
        audioSessionOnStartIos: {
          category: "PlayAndRecord" as any,
          options: ["MixWithOthers" as any],
          mode: "Default" as any,
        },
        audioSessionOnStopIos: "restore" as any,
      };

      const { stop, subscribe } = await whisperContext.transcribeRealtime(
        realtimeOptions
      );

      subscribe((event: any) => {
        const { isCapturing, data, processTime, recordingTime } = event;

        if (data?.result) {
          const currentResult = data.result.trim();
          setRealtimeResult(currentResult);
        }

        if (!isCapturing) {
        }
      });

      setRealtimeTranscriber({ stop });
      setIsRealtimeActive(true);
    } catch (err) {
      const errorMessage = `Real-time transcription failed: ${err}`;
      console.error(errorMessage);
      setError(errorMessage);
      Alert.alert("Real-time Error", errorMessage);
      setIsRealtimeActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopRealtimeTranscription = async () => {
    setIsLoading(true);
    try {
      if (realtimeTranscriber?.stop) {
        await realtimeTranscriber.stop();
        setRealtimeTranscriber(null);
      }

      setIsRealtimeActive(false);
      onStop();
      setRealtimeResult("");
    } catch (err) {
      console.error("Error stopping real-time transcription:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakPress = () => {
    if (isRealtimeActive) {
      stopRealtimeTranscription();
    } else {
      startRealtimeTranscription();
    }
  };

  const activeModelLabel = getCurrentModel()?.label || "Model";
  const downloadPercentage = getDownloadProgress(currentModelId || "base") ?? 0;

  const statusText = isDownloading
    ? true
    : isInitializingModel
    ? true
    : whisperContext
    ? false
    : true;

  return (
    <View className="items-center justify-center">
      <SpeakButton
        isActive={isRealtimeActive}
        isDisabled={!whisperContext || isInitializingModel || isDownloading}
        isLoading={isLoading || statusText}
        onPress={handleSpeakPress}
      />
    </View>
  );
}
