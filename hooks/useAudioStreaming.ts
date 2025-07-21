import { useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export interface AudioStreamingOptions {
  onAudioChunk?: (audioData: ArrayBuffer) => void;
  chunkDuration?: number; // in milliseconds
  sampleRate?: number;
}

export const useAudioStreaming = () => {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const streamingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isStreamingRef = useRef(false);
  const lastPositionRef = useRef(0);

  const startStreaming = useCallback(async (options: AudioStreamingOptions) => {
    const {
      onAudioChunk,
      chunkDuration = 1000,
      sampleRate = 16000
    } = options;

    if (isStreamingRef.current || !recordingRef.current) {
      return;
    }

    isStreamingRef.current = true;
    lastPositionRef.current = 0;

    // Start periodic audio chunk extraction
    streamingIntervalRef.current = setInterval(async () => {
      try {
        if (!recordingRef.current || !isStreamingRef.current) {
          return;
        }

        const status = await recordingRef.current.getStatusAsync();
        if (!status.isRecording) {
          return;
        }

        // Get the current recording URI
        const uri = recordingRef.current.getURI();
        if (!uri) {
          return;
        }

        // Read the audio file and extract new data since last position
        const audioData = await extractAudioChunk(uri, lastPositionRef.current);
        if (audioData && audioData.byteLength > 0) {
          onAudioChunk?.(audioData);
          lastPositionRef.current += audioData.byteLength;
        }
      } catch (error) {
        console.error('Error streaming audio chunk:', error);
      }
    }, chunkDuration);
  }, []);

  const stopStreaming = useCallback(() => {
    isStreamingRef.current = false;
    
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
    }
    
    lastPositionRef.current = 0;
  }, []);

  const setRecording = useCallback((recording: Audio.Recording | null) => {
    recordingRef.current = recording;
  }, []);

  return {
    startStreaming,
    stopStreaming,
    setRecording,
    isStreaming: isStreamingRef.current,
  };
};

// Helper function to extract audio chunk from file
async function extractAudioChunk(uri: string, fromPosition: number): Promise<ArrayBuffer | null> {
  try {
    // Read the file as base64
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      return null;
    }

    // For now, we'll read the entire file and return a chunk
    // In a production app, you'd want to implement proper chunking
    const base64Data = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert base64 to ArrayBuffer
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Return a chunk starting from the specified position
    if (fromPosition >= bytes.length) {
      return null;
    }

    const chunkSize = Math.min(1024 * 4, bytes.length - fromPosition); // 4KB chunks
    const chunk = bytes.slice(fromPosition, fromPosition + chunkSize);
    
    return chunk.buffer;
  } catch (error) {
    console.error('Error extracting audio chunk:', error);
    return null;
  }
}
