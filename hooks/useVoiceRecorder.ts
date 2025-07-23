import { useEffect, useRef, useState, useCallback } from 'react';
import {
  useAudioRecorder,
  RecordingPresets,
  useAudioRecorderState,
  useAudioPlayer,
  AudioModule,
  setAudioModeAsync,
} from 'expo-audio';

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
  // --- Internal audio handles -------------------------------------------------
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // The `useAudioPlayer` hook must be recreated whenever the URI changes.
  const audioPlayer = useAudioPlayer(recordingUri ?? undefined);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Permission status: null = unknown, boolean once resolved.
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
    null,
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

    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    setRecordingDuration(0);
    
    // Start duration timer
    durationIntervalRef.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
  }, [audioRecorder, recorderState.isRecording, isPaused]);

  const pauseRecording = useCallback(async (): Promise<void> => {
    if (!recorderState.isRecording || isPaused) return;

    await audioRecorder.pause();
    setIsPaused(true);
    
    // Pause duration timer
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  }, [audioRecorder, recorderState.isRecording, isPaused]);

  const resumeRecording = useCallback(async (): Promise<void> => {
    if (!isPaused) return;

    audioRecorder.record();
    setIsPaused(false);
    
    // Resume duration timer
    durationIntervalRef.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
  }, [audioRecorder, isPaused]);

  const stopRecording = useCallback(async (): Promise<void> => {
    if (!recorderState.isRecording && !isPaused) return;

    await audioRecorder.stop();
    setRecordingUri(audioRecorder.uri);
    setIsPaused(false);
    
    // Clear duration timer
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  }, [audioRecorder, recorderState.isRecording, isPaused]);

  // ---------------------------------------------------------------------------
  // Playback helpers
  // ---------------------------------------------------------------------------
  const play = useCallback(async (): Promise<void> => {
    if (!recordingUri) return;
    setIsPlaying(true);

    audioPlayer.play();

    const sub = audioPlayer.addListener('playbackStatusUpdate', (status) => {
      if (status.isLoaded && status.didJustFinish) {
        setIsPlaying(false);
        sub?.remove();
      }
    });
  }, [audioPlayer, recordingUri]);

  const pause = useCallback(async (): Promise<void> => {
    if (!recordingUri) return;

    await audioPlayer.pause();
    setIsPlaying(false);
  }, [audioPlayer, recordingUri]);

  const clear = useCallback((): void => {
    setRecordingUri(null);
    setIsPlaying(false);
    setIsPaused(false);
    setRecordingDuration(0);
    
    // Clear any active timer
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    
    audioPlayer.pause();
  }, [audioPlayer]);

  // ---------------------------------------------------------------------------
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

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
