import React from "react";
import MicControlView from "./MicControlView";
import { BottomSheet } from "@/components/ui/bottomsheet";

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
  isStopped: boolean;
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
  isStopped,
}) => {
  return (
    <BottomSheet>
      <MicControlView
        isStopped={isStopped}
        // Core state
        isRecording={isRecording}
        isPaused={isPaused}
        durationSeconds={durationSeconds}
        // Actions
        onToggleRecord={onToggleRecord}
        onStop={onStop}
      />
    </BottomSheet>
  );
};

export default React.memo(MicControlContainer);
