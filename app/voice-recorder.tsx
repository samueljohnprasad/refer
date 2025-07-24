import React, { useEffect, useState } from "react";
import { Animated } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";

import ReanimatedView, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import BreathingBackground from "@/components/ui/BreathingBackground";
import { useWaveformBars } from "@/hooks/useWaveformBars";
import { useRippleAnimation } from "@/hooks/useRippleAnimation";
import GentleProgressRing from "@/components/ui/GentleProgressRing";
import VoiceRecorderModal from "@/components/modals/VoiceRecorderModal";
import MicControl from "@/components/ui/MicControl";
import MindfulBackground from "@/components/ui/MindfulBackground";

export default function VoiceRecorderScreen(): JSX.Element {
  const toast = useToast();

  const {
    isRecording,
    isPaused,
    isPlaying,
    recordingUri,
    recordingDuration,
    startRecording: startRecordingHook,
    pauseRecording: pauseRecordingHook,
    resumeRecording: resumeRecordingHook,
    stopRecording: stopRecordingHook,
    play: playHook,
    pause: pauseHook,
    clear: clearRecordingHook,
    permissionGranted,
  } = useVoiceRecorder();

  const waveformBars = useWaveformBars(isRecording);

  const [recorderOpen, setRecorderOpen] = useState(false);

  // Helper functions
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressValue = (): number => {
    // For demo: progress based on duration (resets every 60 seconds)
    const maxDuration = 300; // 5 minutes max for gentle progress
    return Math.min(recordingDuration / maxDuration, 1);
  };

  useEffect(() => {
    if (permissionGranted === false) {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle>Permission to access microphone was denied</ToastTitle>
          </Toast>
        ),
      });
    }
  }, [permissionGranted, toast]);

  const startRecording = async (): Promise<void> => {
    await startRecordingHook();
  };

  const pauseRecording = async (): Promise<void> => {
    await pauseRecordingHook();
  };

  const resumeRecording = async (): Promise<void> => {
    await resumeRecordingHook();
  };

  const stopRecording = async (): Promise<void> => {
    await stopRecordingHook();
  };

  const playSound = async (): Promise<void> => {
    await playHook();
  };

  const stopSound = async (): Promise<void> => {
    await pauseHook();
  };

  const clearRecording = (): void => {
    clearRecordingHook();
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <MindfulBackground>
        <ReanimatedView.View
          entering={FadeInUp.duration(1200)
            .springify()
            .damping(20)
            .stiffness(80)}
          exiting={FadeOutDown.duration(800)
            .springify()
            .damping(18)
            .stiffness(60)}
          style={styles.safeArea}
        >
          <SafeAreaView style={styles.safeAreaInner}>
            <View style={styles.header}>
              <Text style={styles.date}>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
              <View style={styles.streakContainer}>
                <Ionicons name="flame" size={16} color="#FF6B6B" />
                <Text style={styles.streakText}>1</Text>
              </View>
            </View>

            <ReanimatedView.View
              entering={FadeInUp.delay(400)
                .duration(1000)
                .springify()
                .damping(25)
                .stiffness(60)}
              style={styles.journalCard}
            >
              <Text style={styles.journalQuestion}>
                How did your voice recording go today?
              </Text>

              <View style={styles.recordingSection}>
                {!isRecording && !isPaused && !recordingUri && (
                  <Text style={styles.tapToRecord}>
                    Tap to record entry or type
                  </Text>
                )}

                {(isRecording || isPaused) && (
                  <View style={styles.recordingIndicator}>
                    {/* Gentle Progress Ring with Timer */}
                    <GentleProgressRing
                      progress={getProgressValue()}
                      size={120}
                      strokeWidth={4}
                      backgroundColor="rgba(232, 213, 255, 0.2)"
                      progressColor="#E8D5FF"
                    >
                      <View style={styles.timerContainer}>
                        <Text style={styles.timerText}>
                          {formatDuration(recordingDuration)}
                        </Text>
                        <Text style={styles.statusText}>
                          {isPaused ? "Paused" : "Recording"}
                        </Text>
                      </View>
                    </GentleProgressRing>

                    {/* Live Waveform (only when actively recording) */}
                    {isRecording && (
                      <View style={styles.waveformContainer}>
                        {waveformBars.map(
                          (barHeight: Animated.Value, index: number) => (
                            <Animated.View
                              key={index}
                              style={[
                                styles.waveformBar,
                                {
                                  height: barHeight.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [4, 32], // Min 4px, Max 32px height
                                  }),
                                },
                              ]}
                            />
                          )
                        )}
                      </View>
                    )}
                  </View>
                )}

                {recordingUri && (
                  <View style={styles.recordingComplete}>
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#4ECDC4"
                    />
                    <Text style={styles.recordingCompleteText}>
                      Recording saved!
                    </Text>
                  </View>
                )}
              </View>
            </ReanimatedView.View>
          </SafeAreaView>
        </ReanimatedView.View>
        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.promptsButton}>
            <Ionicons name="list" size={20} color="#6B73FF" />
            <Text style={styles.controlButtonText}>Prompts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.recordButton,
              (isRecording || isPaused) && styles.recordingActive,
            ]}
            onPress={
              isRecording
                ? pauseRecording
                : isPaused
                ? resumeRecording
                : startRecording
            }
            activeOpacity={0.8}
          >
            <Ionicons
              name={isRecording ? "pause" : isPaused ? "play" : "mic"}
              size={32}
              color={isRecording || isPaused ? "#FF6B6B" : "#2D3748"}
            />
          </TouchableOpacity>

          {/* Stop button (when recording or paused) */}
          {(isRecording || isPaused) && (
            <TouchableOpacity
              style={styles.stopButton}
              onPress={stopRecording}
              activeOpacity={0.8}
            >
              <Ionicons name="stop" size={24} color="#FF6B6B" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => {
              setRecorderOpen(true);
            }}
            style={styles.typeButton}
          >
            <Ionicons name="create" size={20} color="#6B73FF" />
            <Text style={styles.controlButtonText}>Type</Text>
          </TouchableOpacity>
        </View>

        {/* {recordingUri && (
          <View style={styles.playbackContainer}>
            <View style={styles.playbackControls}>
              <TouchableOpacity
                style={styles.playButton}
                onPress={isPlaying ? stopSound : playSound}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={20}
                  color="#6B73FF"
                />
                <Text style={styles.playButtonText}>
                  {isPlaying ? "Pause" : "Play"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearRecording}
                activeOpacity={0.7}
              >
                <Ionicons name="trash" size={20} color="#FF6B6B" />
                <Text style={styles.clearButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )} */}
        <VoiceRecorderModal
          visible={recorderOpen}
          onRequestClose={() => setRecorderOpen(false)}
        >
          <BreathingBackground
            brightness={isRecording ? 1.3 : isPaused ? 0.8 : 1}
          >
            <MicControl
              isRecording={isRecording}
              isPaused={isPaused}
              durationSeconds={recordingDuration}
              onToggleRecord={
                isRecording
                  ? pauseRecording
                  : isPaused
                  ? resumeRecording
                  : startRecording
              }
              onStop={stopRecording}
            />
          </BreathingBackground>
        </VoiceRecorderModal>
      </MindfulBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  safeAreaInner: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 30,
  },
  date: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginLeft: 4,
  },
  journalCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    padding: 32,
    marginBottom: 40,
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
    // Soft drop shadow with pastel accent
    shadowColor: "#E8D5FF", // Soft lavender shadow
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    // Subtle inner border for inset effect
    borderWidth: 1,
    borderColor: "rgba(232, 213, 255, 0.3)", // Soft lavender border
    // Additional visual depth
    transform: [{ translateY: -2 }],
  },
  journalQuestion: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2D3748",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 32,
  },
  recordingSection: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
  },
  tapToRecord: {
    fontSize: 16,
    color: "#A0AEC0",
    textAlign: "center",
  },
  recordingIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  pulsingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF6B6B",
    marginRight: 12,
  },
  recordingText: {
    fontSize: 16,
    color: "#FF6B6B",
    fontWeight: "500",
    marginBottom: 16,
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    color: "#A0AEC0",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  waveformContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    height: 40,
    gap: 3,
    marginTop: 8,
  },
  waveformBar: {
    width: 3,
    backgroundColor: "#FF6B6B",
    borderRadius: 1.5,
    opacity: 0.7,
  },
  particleContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  particle: {
    position: "absolute",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E8D5FF", // Soft lavender
    shadowColor: "#E8D5FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  sparkle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#F0E6FF", // Lighter lavender
    shadowColor: "#E8D5FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(232, 213, 255, 0.4)",
  },
  recordingComplete: {
    flexDirection: "row",
    alignItems: "center",
  },
  recordingCompleteText: {
    fontSize: 16,
    color: "#4ECDC4",
    fontWeight: "500",
    marginLeft: 8,
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 120,
  },
  promptsButton: {
    alignItems: "center",
    padding: 12,
  },
  typeButton: {
    alignItems: "center",
    padding: 12,
  },
  controlButtonText: {
    fontSize: 14,
    color: "#6B73FF",
    marginTop: 4,
    fontWeight: "500",
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  recordingActive: {
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderWidth: 2,
    borderColor: "#FF6B6B",
  },
  stopButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginLeft: 16,
  },
  playbackContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  playbackControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(107, 115, 255, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  playButtonText: {
    fontSize: 16,
    color: "#6B73FF",
    marginLeft: 8,
    fontWeight: "500",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  clearButtonText: {
    fontSize: 16,
    color: "#FF6B6B",
    marginLeft: 8,
    fontWeight: "500",
  },
});
