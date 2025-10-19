import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { Animated } from "react-native";
import MicControlView from "./MicControlView";

// Animation configuration constants
const HEARTBEAT_CONFIG = {
  toValue1: 1.05,
  toValue2: 1,
  duration: 800,
  useNativeDriver: true,
} as const;

const BREATHING_CONFIG = {
  toValue1: 1,
  toValue2: 0.6,
  duration: 2000,
  useNativeDriver: true,
} as const;

const GLOW_CONFIG = {
  toValue1: 1.15,
  toValue2: 1,
  duration: 1500,
  useNativeDriver: true,
} as const;

const WAVE_CONFIG = {
  toValue: 1,
  duration: 2000,
  useNativeDriver: false,
} as const;

const RESET_CONFIG = {
  duration: 300,
  useNativeDriver: true,
} as const;

const WAVE_RESET_CONFIG = {
  toValue: 0,
  duration: 300,
  useNativeDriver: false,
} as const;

// Original props interface for the container
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
 * MicControlContainer - Smart component that handles business logic, state management, and side effects
 * Manages animations, theme, and computed values, then passes everything to the presenter
 */
const MicControlContainer: React.FC<MicControlProps> = ({
  isRecording,
  isPaused,
  durationSeconds,
  onToggleRecord,
  onStop,
}) => {
  // Animation values
  const heartbeatScale = useRef(new Animated.Value(1)).current;
  const breathingOpacity = useRef(new Animated.Value(0.7)).current;
  const glowScale = useRef(new Animated.Value(1)).current;
  const waveFlow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRecording) {
      // Gentle heartbeat pulsing animation
      const heartbeat = Animated.loop(
        Animated.sequence([
          Animated.timing(heartbeatScale, {
            toValue: HEARTBEAT_CONFIG.toValue1,
            duration: HEARTBEAT_CONFIG.duration,
            useNativeDriver: HEARTBEAT_CONFIG.useNativeDriver,
          }),
          Animated.timing(heartbeatScale, {
            toValue: HEARTBEAT_CONFIG.toValue2,
            duration: HEARTBEAT_CONFIG.duration,
            useNativeDriver: HEARTBEAT_CONFIG.useNativeDriver,
          }),
        ])
      );

      // Breathing glow effect animation
      const breathing = Animated.loop(
        Animated.sequence([
          Animated.timing(breathingOpacity, {
            toValue: BREATHING_CONFIG.toValue1,
            duration: BREATHING_CONFIG.duration,
            useNativeDriver: BREATHING_CONFIG.useNativeDriver,
          }),
          Animated.timing(breathingOpacity, {
            toValue: BREATHING_CONFIG.toValue2,
            duration: BREATHING_CONFIG.duration,
            useNativeDriver: BREATHING_CONFIG.useNativeDriver,
          }),
        ])
      );

      // Outer glow pulsing animation
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowScale, {
            toValue: GLOW_CONFIG.toValue1,
            duration: GLOW_CONFIG.duration,
            useNativeDriver: GLOW_CONFIG.useNativeDriver,
          }),
          Animated.timing(glowScale, {
            toValue: GLOW_CONFIG.toValue2,
            duration: GLOW_CONFIG.duration,
            useNativeDriver: GLOW_CONFIG.useNativeDriver,
          }),
        ])
      );

      // Wave flowing animation
      const waveAnimation = Animated.loop(
        Animated.timing(waveFlow, WAVE_CONFIG)
      );

      // Start all animations
      heartbeat.start();
      breathing.start();
      glow.start();
      waveAnimation.start();

      // Cleanup function
      return () => {
        heartbeat.stop();
        breathing.stop();
        glow.stop();
        waveAnimation.stop();
      };
    } else {
      // Reset animations to default state when not recording
      Animated.timing(heartbeatScale, {
        toValue: 1,
        ...RESET_CONFIG,
      }).start();

      Animated.timing(breathingOpacity, {
        toValue: 0.7,
        ...RESET_CONFIG,
      }).start();

      Animated.timing(glowScale, {
        toValue: 1,
        ...RESET_CONFIG,
      }).start();

      Animated.timing(waveFlow, WAVE_RESET_CONFIG).start();
    }
  }, [isRecording, heartbeatScale, breathingOpacity, glowScale, waveFlow]);

  // ========================================================================
  // Computed Values & Business Logic
  // ========================================================================

  // Format duration from seconds to MM:SS
  const formattedDuration = useMemo((): string => {
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, [durationSeconds]);

  // ========================================================================
  // Render Presenter Component
  // ========================================================================

  return (
    <MicControlView
      // Core state
      isRecording={isRecording}
      isPaused={isPaused}
      durationSeconds={durationSeconds}
      // Actions
      onToggleRecord={onToggleRecord}
      onStop={onStop}
      // Animation values
      heartbeatScale={heartbeatScale}
      breathingOpacity={breathingOpacity}
      glowScale={glowScale}
      waveFlow={waveFlow}
      formattedDuration={formattedDuration}
    />
  );
};

export default React.memo(MicControlContainer);
