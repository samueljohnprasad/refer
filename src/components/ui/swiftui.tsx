import React, { useState, useEffect } from "react";
import {
  StyleSheet,
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
import * as Haptics from "expo-haptics";
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

const ACCENT_COLOR = "#0A84FF";
const DARK_BG = "#1C1C1E";

// Animated Sound Wave Bar Component
interface WaveBarProps {
  delay: number;
  isActive: boolean;
  height: number;
}

const WaveBar = ({ delay, isActive, height }: WaveBarProps) => {
  const animatedHeight = useSharedValue(height * 0.4);

  useEffect(() => {
    if (isActive) {
      animatedHeight.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(height, {
              duration: 300 + Math.random() * 200,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(height * 0.3, {
              duration: 300 + Math.random() * 200,
              easing: Easing.inOut(Easing.ease),
            })
          ),
          -1,
          true
        )
      );
    } else {
      cancelAnimation(animatedHeight);
      animatedHeight.value = withTiming(height * 0.4, { duration: 200 });
    }
  }, [isActive, height]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }));

  return (
    <Animated.View
      style={[styles.waveBar, { backgroundColor: ACCENT_COLOR }, animatedStyle]}
    />
  );
};

// Sound Wave Icon Component
interface SoundWaveIconProps {
  isActive: boolean;
  size?: number;
}

const SoundWaveIcon = ({ isActive, size = 20 }: SoundWaveIconProps) => {
  const barHeights = [size * 0.5, size * 0.8, size, size * 0.8, size * 0.5];
  const delays = [0, 50, 100, 150, 200];

  return (
    <View
      style={[styles.soundWaveContainer, { height: size, width: size * 1.2 }]}
    >
      {barHeights.map((height, index) => (
        <WaveBar
          key={index}
          delay={delays[index]}
          isActive={isActive}
          height={height}
        />
      ))}
    </View>
  );
};

// Speak Button Component
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
}: SpeakButtonProps) => {
  const getButtonText = () => {
    if (isLoading && isActive) return "Stopping...";
    if (isLoading && !isActive) return "Starting...";
    if (isActive) return "Listening...";
    return "Speak";
  };

  return (
    <View style={styles.speakButtonWrapper}>
      <TouchableOpacity
        style={[
          styles.speakButton,
          isActive && styles.speakButtonActive,
          (isDisabled || isLoading) && styles.speakButtonDisabled,
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPress();
        }}
        disabled={isDisabled || isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={ACCENT_COLOR} />
        ) : (
          <SoundWaveIcon isActive={isActive} size={18} />
        )}
        <Text
          style={[
            styles.speakButtonText,
            isActive && styles.speakButtonTextActive,
          ]}
          className="font-cormorantBold"
        >
          {getButtonText()}
        </Text>
      </TouchableOpacity>
    </View>
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

      console.log("Starting real-time transcription...");

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

        console.log(
          `Realtime transcribing: ${isCapturing ? "ON" : "OFF"}\n` +
            `Result: ${data?.result || "No result"}\n` +
            `Process time: ${processTime}ms\n` +
            `Recording time: ${recordingTime}ms`
        );

        if (data?.result) {
          const currentResult = data.result.trim();
          console.log("currentResult", currentResult);
          setRealtimeResult(currentResult);

          console.log("📝 Real-time update:", {
            isCapturing,
            length: currentResult.length,
            lastWords: currentResult.split(" ").slice(-5).join(" "),
            totalWords: currentResult.split(" ").length,
          });
        }

        if (!isCapturing) {
          console.log("Speech segment finished, but continuing to listen...");
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
      console.log("Real-time transcription stopped");
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
    <View className="flex-1 items-center justify-center">
      <SpeakButton
        isActive={isRealtimeActive}
        isDisabled={!whisperContext || isInitializingModel || isDownloading}
        isLoading={isLoading || statusText}
        onPress={handleSpeakPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  transcriptionCard: {
    flex: 1,
    backgroundColor: "#2C2C2E",
    borderRadius: 20,
    marginBottom: 32,
    overflow: "hidden",
  },
  transcriptionScroll: {
    flex: 1,
  },
  transcriptionContent: {
    padding: 20,
    minHeight: 200,
  },
  transcriptionText: {
    fontSize: 18,
    lineHeight: 28,
    color: "#FFFFFF",
    fontWeight: "400",
  },
  placeholderText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#636366",
    textAlign: "center",
    marginTop: 60,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#FF453A",
    textAlign: "center",
    marginTop: 60,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  speakButtonWrapper: {
    borderRadius: 30,
    overflow: "hidden",
  },
  speakButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
    gap: 10,
    minWidth: 140,
  },
  speakButtonActive: {
    backgroundColor: "#FFFFFF",
  },
  speakButtonDisabled: {
    opacity: 0.5,
  },
  speakButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  speakButtonTextActive: {
    color: ACCENT_COLOR,
  },
  soundWaveContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  waveBar: {
    width: 3,
    borderRadius: 2,
  },
  statusContainer: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  statusText: {
    fontSize: 13,
    color: "#8E8E93",
    textAlign: "center",
  },
  footerHint: {
    fontSize: 13,
    color: "#636366",
    textAlign: "center",
  },
});
