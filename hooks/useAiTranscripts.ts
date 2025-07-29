import { View, Text } from "react-native";
import React from "react";
import { AssemblyAI, TranscribeParams } from "assemblyai";
const client = new AssemblyAI({
  apiKey: "4a7628b5aff2413e9cd71b14775388ee",
});
const useAiTranscripts = () => {
  const run = async (audioFile: string) => {
    const params: TranscribeParams = {
      audio: audioFile,
      speech_model: "universal",
    };
    const transcript = await client.transcripts.transcribe(params);
    return transcript.text;
  };
  return { run };
};

export default useAiTranscripts;
