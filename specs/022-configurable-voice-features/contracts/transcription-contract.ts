/**
 * Contract: Dual-Engine Audio Transcription
 */

export interface TranscribeResult {
  transcript: string;
  duration: number;
}

export interface UseTranscribeAudioReturn {
  transcribeAudio: (uri: string) => Promise<TranscribeResult>;
  isTranscribing: boolean;
  transcriptionEngine: "local_whisper" | "cloud_edge_function";
}
