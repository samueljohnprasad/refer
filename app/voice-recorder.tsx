import React, { useState, useEffect, useRef } from "react";
import { Animated } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Dimensions,
} from "react-native";
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
  useAudioPlayer,
} from "expo-audio";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { LinearGradient } from "expo-linear-gradient";
import ReanimatedView, {
  FadeInUp,
  FadeOutDown,
  SlideInUp,
  SlideOutDown,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function VoiceRecorderScreen(): JSX.Element {
  // Recorder and audio state hooks MUST come first
  const audioRecorder: ReturnType<typeof useAudioRecorder> = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const audioPlayer = useAudioPlayer(recordingUri ?? undefined);
  const toast = useToast();
  const [isPlaying, setIsPlaying] = useState(false);

  // Animated ripple setup
  const rippleScale = useRef<Animated.Value>(new Animated.Value(1)).current;
  const rippleOpacity = useRef<Animated.Value>(new Animated.Value(0.5)).current;

  // Waveform animation setup
  const waveformBars = useRef<Animated.Value[]>(
    Array.from({ length: 8 }, () => new Animated.Value(0.2))
  ).current;

  // Particle system for floating dots and sparkles
  const particleCount = 32;
  const particles = useRef<{
    x: Animated.Value;
    y: Animated.Value;
    opacity: Animated.Value;
    scale: Animated.Value;
    type: 'dot' | 'sparkle';
  }[]>(
    Array.from({ length: particleCount }, (_, i) => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * 600),
      opacity: new Animated.Value(Math.random() * 0.4 + 0.3), // More visible: 0.3-0.7
      scale: new Animated.Value(Math.random() * 0.8 + 0.6), // Larger: 0.6-1.4
      type: i % 3 === 0 ? 'sparkle' : 'dot',
    }))
  ).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;
    
    if (recorderState.isRecording) {
      // Start pulsing
      const pulse = () => {
        rippleScale.setValue(1);
        rippleOpacity.setValue(0.5);
        animation = Animated.parallel([
          Animated.timing(rippleScale, {
            toValue: 2.5,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(rippleOpacity, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]);
        animation.start(({ finished }) => {
          if (finished && recorderState.isRecording) {
            pulse();
          }
        });
      };
      pulse();
    } else {
      // Reset ripple
      rippleScale.setValue(1);
      rippleOpacity.setValue(0);
      if (animation) animation?.stop?.();
    }
    return () => {
      if (animation) animation?.stop?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recorderState.isRecording]);

  // Waveform animation effect
  useEffect(() => {
    let waveformInterval: number | null = null;
    
    if (recorderState.isRecording) {
      const animateWaveform = () => {
        const animations = waveformBars.map((bar: Animated.Value, index: number) => {
          const randomHeight = Math.random() * 0.8 + 0.2; // Random height between 0.2 and 1.0
          const delay = index * 50; // Stagger the animations
          
          return Animated.timing(bar, {
            toValue: randomHeight,
            duration: 150 + Math.random() * 100, // Vary animation duration
            delay,
            useNativeDriver: false,
          });
        });
        
        Animated.parallel(animations).start();
      };
      
      // Start immediate animation
      animateWaveform();
      
      // Set interval for continuous animation
      waveformInterval = setInterval(animateWaveform, 200) as number;
    } else {
      // Reset bars to minimum height when not recording
      const resetAnimations = waveformBars.map((bar: Animated.Value) => 
        Animated.timing(bar, {
          toValue: 0.2,
          duration: 300,
          useNativeDriver: false,
        })
      );
      
      Animated.parallel(resetAnimations).start();
    }
    
    return () => {
      if (waveformInterval) {
        clearInterval(waveformInterval);
      }
    };
  }, [recorderState.isRecording, waveformBars]);

  // Particle animation effect
  useEffect(() => {
    const animateParticles = () => {
      particles.forEach((particle, index) => {
        const initialY = Math.random() * 600;
        const floatAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(particle.y, {
              toValue: initialY - 20,
              duration: 3000 + Math.random() * 2000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.y, {
              toValue: initialY + 40,
              duration: 3000 + Math.random() * 2000,
              useNativeDriver: true,
            }),
          ])
        );

        const fadeAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(particle.opacity, {
              toValue: 0.2,
              duration: 2000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: 0.8,
              duration: 2000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
          ])
        );

        const scaleAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(particle.scale, {
              toValue: 0.5,
              duration: 1500 + Math.random() * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: 1.2,
              duration: 1500 + Math.random() * 1000,
              useNativeDriver: true,
            }),
          ])
        );

        floatAnimation.start();
        fadeAnimation.start();
        if (particle.type === 'sparkle') {
          scaleAnimation.start();
        }
      });
    };

    animateParticles();
  }, [particles]);

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        toast.show({
          placement: "bottom right",
          render: ({ id }) => {
            return (
              <Toast nativeID={id} variant="solid" action="error">
                <ToastTitle>
                  Permission to access microphone was denied
                </ToastTitle>
              </Toast>
            );
          },
        });
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  const startRecording = async () => {
    try {
      console.log("Starting recording..");
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      console.log("Recording started");
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast.show({
        placement: "bottom right",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle>Failed to start recording</ToastTitle>
          </Toast>
        ),
      });
    }
  };

  const stopRecording = async () => {
    try {
      console.log("Stopping recording..");
      await audioRecorder.stop();
      const uri = audioRecorder.uri;
      console.log("Recording stopped, URI:", uri);
      setRecordingUri(uri);
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };

  const playSound = async () => {
    if (!recordingUri) return;

    try {
      console.log("Playing Sound");
      setIsPlaying(true);
      audioPlayer.play();

      const unsubscribe = audioPlayer.addListener(
        "playbackStatusUpdate",
        (status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
            unsubscribe?.remove();
          }
        }
      );
    } catch (error) {
      console.error("Error playing sound:", error);
      Alert.alert("Error", "Failed to play recording");
      setIsPlaying(false);
    }
  };

  const stopSound = async () => {
    try {
      audioPlayer.pause();
      setIsPlaying(false);
    } catch (error) {
      console.error("Error stopping sound:", error);
    }
  };

  const clearRecording = () => {
    setRecordingUri(null);
    setIsPlaying(false);
    if (audioPlayer) {
      audioPlayer.pause();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient
        colors={["#E8F5E8", "#F0F9FF", "#FEF3C7"]}
        style={styles.gradientBackground}
      >
        {/* Particle Effects */}
        <View style={styles.particleContainer}>
          {particles.map((particle, index) => (
            <Animated.View
              key={index}
              style={[
                styles.particle,
                particle.type === 'sparkle' ? styles.sparkle : styles.dot,
                {
                  transform: [
                    { translateX: particle.x },
                    { translateY: particle.y },
                    { scale: particle.scale },
                  ],
                  opacity: particle.opacity,
                },
              ]}
            />
          ))}
        </View>
        <ReanimatedView.View
          entering={FadeInUp.duration(1200).springify().damping(20).stiffness(80)}
          exiting={FadeOutDown.duration(800).springify().damping(18).stiffness(60)}
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
              entering={FadeInUp.delay(400).duration(1000).springify().damping(25).stiffness(60)}
              style={styles.journalCard}
            >
              <Text style={styles.journalQuestion}>
                How did your voice recording go today?
              </Text>

              <View style={styles.recordingSection}>
                {!recorderState.isRecording && !recordingUri && (
                  <Text style={styles.tapToRecord}>
                    Tap to record entry or type
                  </Text>
                )}

                {recorderState.isRecording && (
                  <View style={styles.recordingIndicator}>
                    <View style={styles.pulsingDot} />
                    <Text style={styles.recordingText}>Recording...</Text>
                    
                    {/* Live Waveform */}
                    <View style={styles.waveformContainer}>
                      {waveformBars.map((barHeight: Animated.Value, index: number) => (
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
                      ))}
                    </View>
                  </View>
                )}

                {recordingUri && (
                  <View style={styles.recordingComplete}>
                    <Ionicons name="checkmark-circle" size={24} color="#4ECDC4" />
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

          <Animated.View
            style={[
              styles.rippleContainer,
              {
                opacity: rippleOpacity,
                transform: [{ scale: rippleScale }],
              },
            ]}
            pointerEvents="none"
          >
            {/* Empty view for ripple */}
          </Animated.View>
          <TouchableOpacity
            style={[
              styles.recordButton,
              recorderState.isRecording && styles.recordingActive,
            ]}
            onPress={
              recorderState.isRecording ? stopRecording : startRecording
            }
            activeOpacity={0.8}
          >
            <Ionicons
              name={recorderState.isRecording ? "stop" : "mic"}
              size={32}
              color={recorderState.isRecording ? "#FF6B6B" : "#2D3748"}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.typeButton}>
            <Ionicons name="create" size={20} color="#6B73FF" />
            <Text style={styles.controlButtonText}>Type</Text>
          </TouchableOpacity>
        </View>

        {recordingUri && (
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
        )}
      </LinearGradient>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E8D5FF', // Soft lavender
    shadowColor: '#E8D5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  sparkle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F0E6FF', // Lighter lavender
    shadowColor: '#E8D5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 255, 0.4)',
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
    marginBottom: 40,
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
  rippleContainer: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 100,
    height: 100,
    marginLeft: -50,
    marginTop: -50,
    borderRadius: 50,
    backgroundColor: "#FF6B6B", // pastel red ripple
    zIndex: 0,
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
