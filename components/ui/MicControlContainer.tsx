import React, { useEffect, useRef, useMemo } from "react";
import { Animated } from "react-native";
import { useSeasonalTheme } from "@/hooks/useSeasonalTheme";
import MicControlView from "./MicControlView";

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
  // ========================================================================
  // Business Logic & State Management
  // ========================================================================

  // Get theme colors using reusable hook
  const activeTheme = useSeasonalTheme();

  // Animation values
  const heartbeatScale = useRef(new Animated.Value(1)).current;
  const breathingOpacity = useRef(new Animated.Value(0.7)).current;
  const glowScale = useRef(new Animated.Value(1)).current;
  const waveFlow = useRef(new Animated.Value(0)).current;

  // ========================================================================
  // Side Effects & Animation Management
  // ========================================================================

  useEffect(() => {
    if (isRecording) {
      // Gentle heartbeat pulsing animation
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

      // Breathing glow effect animation
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

      // Outer glow pulsing animation
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
          duration: 2000,
          useNativeDriver: false,
        })
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

export default MicControlContainer;
