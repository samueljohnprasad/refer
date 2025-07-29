import { useEffect, useRef, useState, useCallback } from "react";
import {
  useAudioRecorder,
  RecordingPresets,
  useAudioRecorderState,
  useAudioPlayer,
  AudioModule,
  setAudioModeAsync,
} from "expo-audio";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { useAudioRecorderStateCustom } from "./useAudioRecorderCustom";

/**
 * Strictly typed reusable hook that encapsulates all voice-recording
 * and playback logic based on `expo-audio`.
 *
 * This hook follows SOLID principles by isolating a single
 * responsibility — managing voice recording life-cycle — and exposes
 * a minimal, explicit API that can be reused across screens.
 */
export interface UseVoiceRecorderReturn {
  /** `true` while the microphone is actively capturing audio. */
  isRecording: boolean;
  /** `true` while recording is paused (not actively capturing but session continues). */
  isPaused: boolean;
  /** `true` while an existing recording is playing. */
  isPlaying: boolean;
  /** File-system URI of the completed recording, or `null` if none. */
  recordingUri: string | null;
  /** Current recording duration in seconds. */
  recordingDuration: number;
  /** Begin capturing audio. Ensures `AudioMode` is configured first. */
  startRecording: () => Promise<void>;
  /** Pause the current recording session (can be resumed). */
  pauseRecording: () => Promise<void>;
  /** Resume a paused recording session. */
  resumeRecording: () => Promise<void>;
  /** Stop the current capture and finalise the recording file. */
  stopRecording: () => Promise<void>;
  /** Play the most recent recording (if present). */
  play: () => Promise<void>;
  /** Pause playback (if any). */
  pause: () => Promise<void>;
  /** Clear the current recording and reset playback state. */
  clear: () => void;
  /** Whether the app has been granted microphone permission. */
  permissionGranted: boolean | null;
}

export const useVoiceRecorder = (): UseVoiceRecorderReturn => {
  const toast = useToast();

  // --- Internal audio handles -------------------------------------------------
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderStateCustom(audioRecorder, 4000);

  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  // The `useAudioPlayer` hook must be recreated whenever the URI changes.
  const audioPlayer = useAudioPlayer(recordingUri ?? undefined);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playbackListenerRef = useRef<any>(null);

  // Permission status: null = unknown, boolean once resolved.
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
    null
  );

  // ---------------------------------------------------------------------------
  // Microphone permission + Audio mode setup
  // ---------------------------------------------------------------------------
  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      setPermissionGranted(status.granted ?? false);

      // Configure to allow recording + playback even in silent mode.
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  // ---------------------------------------------------------------------------
  // Recording helpers with pause/resume support
  // ---------------------------------------------------------------------------
  const startRecording = useCallback(async (): Promise<void> => {
    if (recorderState.isRecording || isPaused) return;

    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();

      // Reset timing
      accumulatedTimeRef.current = 0;
      startTimeRef.current = Date.now();
      setRecordingDuration(0);
      setIsPaused(false);

      // Start accurate timer
      durationIntervalRef.current = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = Math.floor((currentTime - startTimeRef.current) / 1000);
        const totalDuration = accumulatedTimeRef.current + elapsed;
        setRecordingDuration(totalDuration);
      }, 100); // More frequent updates for smoother timer
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  }, [audioRecorder, recorderState.isRecording, isPaused]);

  const pauseRecording = useCallback(async (): Promise<void> => {
    if (!recorderState.isRecording || isPaused) return;

    try {
      audioRecorder.pause();

      // Store accumulated time before pausing
      const currentTime = Date.now();
      const elapsed = Math.floor((currentTime - startTimeRef.current) / 1000);
      accumulatedTimeRef.current += elapsed;

      setIsPaused(true);

      // Clear timer
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
    } catch (error) {
      console.error("Failed to pause recording:", error);
    }
  }, [audioRecorder, recorderState.isRecording, isPaused]);

  const resumeRecording = useCallback(async (): Promise<void> => {
    if (!isPaused) return;

    try {
      audioRecorder.record();

      // Reset start time for accurate timing
      startTimeRef.current = Date.now();
      setIsPaused(false);

      // Resume timer with accumulated time
      durationIntervalRef.current = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = Math.floor((currentTime - startTimeRef.current) / 1000);
        const totalDuration = accumulatedTimeRef.current + elapsed;
        setRecordingDuration(totalDuration);
      }, 100);
    } catch (error) {
      console.error("Failed to resume recording:", error);
    }
  }, [audioRecorder, isPaused]);

  const stopRecording = useCallback(async (): Promise<void> => {
    if (!recorderState.isRecording && !isPaused) return;

    try {
      await audioRecorder.stop();

      // Final duration calculation
      if (!isPaused) {
        const currentTime = Date.now();
        const elapsed = Math.floor((currentTime - startTimeRef.current) / 1000);
        accumulatedTimeRef.current += elapsed;
        setRecordingDuration(accumulatedTimeRef.current);
      }

      setRecordingUri(audioRecorder.uri);
      setIsPaused(false);

      // Clear timer
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  }, [audioRecorder, recorderState.isRecording, isPaused]);

  // ---------------------------------------------------------------------------
  // Playback helpers
  // ---------------------------------------------------------------------------
  const play = useCallback(async (): Promise<void> => {
    if (!recordingUri || isPlaying) return;

    try {
      // Clean up any existing listener
      if (playbackListenerRef.current) {
        playbackListenerRef.current.remove();
        playbackListenerRef.current = null;
      }

      setIsPlaying(true);
      audioPlayer.play();

      // Add new listener
      playbackListenerRef.current = audioPlayer.addListener(
        "playbackStatusUpdate",
        (status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
            if (playbackListenerRef.current) {
              playbackListenerRef.current.remove();
              playbackListenerRef.current = null;
            }
          }
        }
      );
    } catch (error) {
      console.error("Failed to play recording:", error);
      setIsPlaying(false);
    }
  }, [audioPlayer, recordingUri, isPlaying]);

  const pause = useCallback(async (): Promise<void> => {
    if (!recordingUri || !isPlaying) return;

    try {
      audioPlayer.pause();
      setIsPlaying(false);

      // Clean up listener
      if (playbackListenerRef.current) {
        playbackListenerRef.current.remove();
        playbackListenerRef.current = null;
      }
    } catch (error) {
      console.error("Failed to pause playback:", error);
    }
  }, [audioPlayer, recordingUri, isPlaying]);

  const clear = useCallback((): void => {
    // Clear all timers and listeners
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    if (playbackListenerRef.current) {
      playbackListenerRef.current.remove();
      playbackListenerRef.current = null;
    }

    // Reset all state
    setRecordingUri(null);
    setIsPlaying(false);
    setIsPaused(false);
    setRecordingDuration(0);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = 0;

    try {
      audioPlayer.pause();
    } catch (error) {
      console.error("Error clearing audio player:", error);
    }
  }, [audioPlayer]);

  // ---------------------------------------------------------------------------
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (playbackListenerRef.current) {
        playbackListenerRef.current.remove();
      }
    };
  }, []);

  // Cleanup listener when recordingUri changes
  useEffect(() => {
    return () => {
      if (playbackListenerRef.current) {
        playbackListenerRef.current.remove();
        playbackListenerRef.current = null;
      }
    };
  }, [recordingUri]);

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

  // ---------------------------------------------------------------------------
  return {
    isRecording: recorderState.isRecording,
    isPaused,
    isPlaying,
    recordingUri,
    recordingDuration,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    play,
    pause,
    clear,
    permissionGranted,
  };
};
