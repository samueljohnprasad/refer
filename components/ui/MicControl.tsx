import React, { useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
import GentleProgressRing from "@/components/ui/GentleProgressRing";
import { useSeasonalTheme } from "@/hooks/useSeasonalTheme";

export interface MicControlProps {
  /** Whether the recorder is currently capturing */
  isRecording: boolean;
  /** Whether the recorder is currently paused */
  isPaused: boolean;
  /** Current duration in seconds */
  durationSeconds: number;
  /** Invoked when the main mic / pause / play button is pressed */
  onToggleRecord: () => void;
  /** Invoked when the stop button is pressed (finalise) */
  onStop: () => void;
}


/**
 * MicControl — bottom-sheet style recorder control mirroring the provided design.
 * Shows a large circular mic/pause/play button centred inside a soft rounded panel,
 * with a timer label above. Uses gentle colours consistent with Mentor Health UI.
 */
const MicControl: React.FC<MicControlProps> = ({
  isRecording,
  isPaused,
  durationSeconds,
  onToggleRecord,
  onStop,
}) => {
  const { width } = Dimensions.get("window");
  
  // Get theme colors using reusable hook
  const activeTheme = useSeasonalTheme();
  
  // Gentle heartbeat animation
  const heartbeatScale = useRef(new Animated.Value(1)).current;
  const breathingOpacity = useRef(new Animated.Value(0.7)).current;
  const glowScale = useRef(new Animated.Value(1)).current;
  
  // Wave flow animation
  const waveFlow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRecording) {
      // Gentle heartbeat pulsing
      const heartbeat = Animated.loop(
        Animated.sequence([
          Animated.timing(heartbeatScale, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(heartbeatScale, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      
      // Breathing glow effect
      const breathing = Animated.loop(
        Animated.sequence([
          Animated.timing(breathingOpacity, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(breathingOpacity, {
            toValue: 0.6,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      
      // Outer glow pulsing
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowScale, {
            toValue: 1.15,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowScale, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      
      // Wave flowing animation
      const waveAnimation = Animated.loop(
        Animated.timing(waveFlow, {
          toValue: 1,
          duration: 2000, // Even faster for more dynamic movement
          useNativeDriver: false,
        })
      );
      
      heartbeat.start();
      breathing.start();
      glow.start();
      waveAnimation.start();
      
      return () => {
        heartbeat.stop();
        breathing.stop();
        glow.stop();
        waveAnimation.stop();
      };
    } else {
      // Reset to default state
      Animated.timing(heartbeatScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(breathingOpacity, {
        toValue: 0.7,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(glowScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(waveFlow, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isRecording, heartbeatScale, breathingOpacity, glowScale, waveFlow]);

  const formatDuration = (s: number): string => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };
  
  // Generate animated wave path
  const getWavePath = (baseY: number, amplitude: number, frequency: number, phase: number) => {
    const animatedPhase = waveFlow.interpolate({
      inputRange: [0, 1],
      outputRange: [phase, phase + Math.PI * 2],
    });
    
    return waveFlow.interpolate({
      inputRange: [0, 1],
      outputRange: [
        `M0,${baseY} Q${width * 0.25},${baseY - amplitude} ${width * 0.5},${baseY} T${width},${baseY} L${width},${PANEL_HEIGHT} L0,${PANEL_HEIGHT} Z`,
        `M0,${baseY} Q${width * 0.25},${baseY + amplitude} ${width * 0.5},${baseY} T${width},${baseY} L${width},${PANEL_HEIGHT} L0,${PANEL_HEIGHT} Z`,
      ],
    });
  };

  return (
    <View style={[styles.container, { width }]}>
      {/* Wave-shaped background with theme colors and flowing animation */}
      <Svg
        height={PANEL_HEIGHT}
        width={width}
        style={StyleSheet.absoluteFillObject}
        viewBox={`0 0 ${width} ${PANEL_HEIGHT}`}
      >
        {isRecording ? (
          // Animated flowing waves when recording
          <>
            <Animated.View style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: waveFlow.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [1, 0.4, 1], // Even more dramatic opacity change
              }),
            }}>
              <Svg
                height={PANEL_HEIGHT}
                width={width}
                style={StyleSheet.absoluteFillObject}
                viewBox={`0 0 ${width} ${PANEL_HEIGHT}`}
              >
                <Path
                  d={`M0,${PANEL_HEIGHT * 0.35} Q${width * 0.25},${PANEL_HEIGHT * 0.15} ${width * 0.5},${PANEL_HEIGHT * 0.25} T${width},${PANEL_HEIGHT * 0.35} L${width},${PANEL_HEIGHT} L0,${PANEL_HEIGHT} Z`}
                  fill={`${activeTheme.gradient[0]}95`}
                />
                <Path
                  d={`M0,${PANEL_HEIGHT * 0.45} Q${width * 0.3},${PANEL_HEIGHT * 0.2} ${width * 0.6},${PANEL_HEIGHT * 0.3} T${width},${PANEL_HEIGHT * 0.4} L${width},${PANEL_HEIGHT} L0,${PANEL_HEIGHT} Z`}
                  fill={`${activeTheme.gradient[1]}85`}
                />
                <Path
                  d={`M0,${PANEL_HEIGHT * 0.55} Q${width * 0.35},${PANEL_HEIGHT * 0.3} ${width * 0.7},${PANEL_HEIGHT * 0.4} T${width},${PANEL_HEIGHT * 0.5} L${width},${PANEL_HEIGHT} L0,${PANEL_HEIGHT} Z`}
                  fill={`${activeTheme.gradient[2]}75`}
                />
              </Svg>
            </Animated.View>
            <Animated.View style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: waveFlow.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.3, 1, 0.3], // Even more dramatic opacity change
              }),
            }}>
              <Svg
                height={PANEL_HEIGHT}
                width={width}
                style={StyleSheet.absoluteFillObject}
                viewBox={`0 0 ${width} ${PANEL_HEIGHT}`}
              >
                <Path
                  d={`M0,${PANEL_HEIGHT * 0.45} Q${width * 0.25},${PANEL_HEIGHT * 0.25} ${width * 0.5},${PANEL_HEIGHT * 0.35} T${width},${PANEL_HEIGHT * 0.45} L${width},${PANEL_HEIGHT} L0,${PANEL_HEIGHT} Z`}
                  fill={`${activeTheme.gradient[0]}85`}
                />
                <Path
                  d={`M0,${PANEL_HEIGHT * 0.55} Q${width * 0.3},${PANEL_HEIGHT * 0.35} ${width * 0.6},${PANEL_HEIGHT * 0.45} T${width},${PANEL_HEIGHT * 0.55} L${width},${PANEL_HEIGHT} L0,${PANEL_HEIGHT} Z`}
                  fill={`${activeTheme.gradient[1]}75`}
                />
                <Path
                  d={`M0,${PANEL_HEIGHT * 0.65} Q${width * 0.35},${PANEL_HEIGHT * 0.45} ${width * 0.7},${PANEL_HEIGHT * 0.55} T${width},${PANEL_HEIGHT * 0.65} L${width},${PANEL_HEIGHT} L0,${PANEL_HEIGHT} Z`}
                  fill={`${activeTheme.gradient[2]}65`}
                />
              </Svg>
            </Animated.View>
          </>
        ) : (
          // Static waves when not recording
          <>
            <Path
              d={`M0,${PANEL_HEIGHT * 0.4} Q${width * 0.25},${PANEL_HEIGHT * 0.2} ${width * 0.5},${PANEL_HEIGHT * 0.3} T${width},${PANEL_HEIGHT * 0.4} L${width},${PANEL_HEIGHT} L0,${PANEL_HEIGHT} Z`}
              fill={`${activeTheme.gradient[0]}95`}
            />
            <Path
              d={`M0,${PANEL_HEIGHT * 0.5} Q${width * 0.3},${PANEL_HEIGHT * 0.25} ${width * 0.6},${PANEL_HEIGHT * 0.35} T${width},${PANEL_HEIGHT * 0.45} L${width},${PANEL_HEIGHT} L0,${PANEL_HEIGHT} Z`}
              fill={`${activeTheme.gradient[1]}85`}
            />
            <Path
              d={`M0,${PANEL_HEIGHT * 0.6} Q${width * 0.35},${PANEL_HEIGHT * 0.35} ${width * 0.7},${PANEL_HEIGHT * 0.45} T${width},${PANEL_HEIGHT * 0.55} L${width},${PANEL_HEIGHT} L0,${PANEL_HEIGHT} Z`}
              fill={`${activeTheme.gradient[2]}75`}
            />
          </>
        )}
      </Svg>
      {/* Therapeutic timer with breathing guidance */}
      <View style={styles.timerSection}>
        <Text style={styles.timer}>{formatDuration(durationSeconds)}</Text>
        {isRecording && (
          <Animated.Text style={[styles.breathingGuide, { opacity: breathingOpacity }]}>
            Breathe deeply...
          </Animated.Text>
        )}
      </View>

      {/* Outer glow ring for recording state */}
      {isRecording && (
        <Animated.View 
          style={[
            styles.outerGlow,
            {
              backgroundColor: `${activeTheme.particleDot}20`,
              transform: [{ scale: glowScale }],
              opacity: breathingOpacity
            }
          ]}
        />
      )}

      {/* Main mic button with modern design */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{ scale: heartbeatScale }],
          }
        ]}
      >
        <TouchableOpacity
          style={styles.mainButtonWrapper}
          onPress={onToggleRecord}
          activeOpacity={0.9}
        >
          {/* Therapeutic button with theme colors */}
          <View style={[
            styles.simpleButton,
            {
              backgroundColor: isRecording ? activeTheme.particleDot : activeTheme.particleSparkle,
              shadowColor: activeTheme.particleDot,
            }
          ]}>
            <Ionicons
              name={isRecording ? "pause" : isPaused ? "play" : "mic"}
              size={28}
              color="white"
            />
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Floating stop button with soft design */}
      {(isRecording || isPaused) && (
        <Animated.View
          style={[
            styles.stopButtonContainer,
            {
              opacity: breathingOpacity.interpolate({
                inputRange: [0.6, 1],
                outputRange: [0.8, 1],
              })
            }
          ]}
        >
          <TouchableOpacity
            style={styles.stopButton}
            onPress={onStop}
            activeOpacity={0.8}
          >
            <View style={styles.stopButtonSimple}>
              <Ionicons name="stop" size={20} color="#EF4444" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Mindful affirmation */}
      {/* {!isRecording && !isPaused && (
        <Text style={styles.affirmation}>Your voice matters</Text>
      )} */}
    </View>
  );
};

const PANEL_HEIGHT = 200;

const styles = StyleSheet.create({
  container: {
    height: PANEL_HEIGHT,
    position: "absolute",
    bottom: 20,  // Move up for better visibility
    alignItems: "center",
    paddingTop: 32,
    paddingHorizontal: 20,
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  timerSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  timer: {
    fontSize: 20,
    fontWeight: "700",
    color: "rgba(60, 60, 60, 0.9)",
    letterSpacing: 0.5,
  },
  breathingGuide: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(100, 100, 100, 0.8)",
    marginTop: 4,
    letterSpacing: 0.3,
  },
  outerGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    top: 75,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  mainButtonWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  simpleButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  stopButtonContainer: {
    position: "absolute",
    right: 24,
    top: 30,
  },
  stopButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  stopButtonSimple: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  affirmation: {
    fontSize: 11,
    fontWeight: "500",
    color: "rgba(100, 100, 100, 0.7)",
    opacity: 0.8,
    letterSpacing: 0.2,
    marginTop: 4,
  },
});

export default MicControl;
