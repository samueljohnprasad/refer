import { View, Text, SafeAreaView, Alert, Platform } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import VoiceRecorderModal from "@/components/modals/VoiceRecorderModal";
import BreathingBackground from "@/components/ui/BreathingBackground";
import MicControlContainer from "@/components/ui/MicControlContainer";
import {
  PlayerState,
  RecorderState,
  Waveform,
  useAudioPlayer,
  type IWaveformRef,
} from "@simform_solutions/react-native-audio-waveform";
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { ScrollView } from "@/components/ui/scroll-view";
import MindfulBackground from "@/components/ui/MindfulBackground";
import { useSeasonalTheme } from "@/hooks/useSeasonalTheme";
import { DurationType } from "@simform_solutions/react-native-audio-waveform/lib/constants";
import { transcribeAudio } from "@/network/transcribeAudio";
import MindfulGradient, {
  GradientPosition,
} from "../components/MindfulGradient";
import { Buffer } from "buffer";
import ProcessingStageIndicator from "@/components/analysis/ProcessingStageIndicator";
import JournalInsightsView from "@/components/analysis/JournalInsightsView";
import { analyzeText, AnalysisProgress, TextAnalysisResult } from "@/utils/textAnalysisService";

const stateBasedDetails = {
  [PlayerState.paused]: {
    isPlaying: false,
    brightness: 1,
  },
  [PlayerState.playing]: {
    isPlaying: true,
    brightness: 1.3,
  },
  [PlayerState.stopped]: {
    isPlaying: false,
    brightness: 1,
  },
};
type VoiceRecorderModalWrapperProps = {
  recorderOpen: boolean;
  setRecorderOpen: (open: boolean) => void;
};

const VoiceRecorderModalWrapper = ({
  recorderOpen,
  setRecorderOpen,
}: VoiceRecorderModalWrapperProps) => {
  const [recoderCurrentState, setRecoderCurrentState] = useState<
    RecorderState | undefined
  >();
  const activeTheme = useSeasonalTheme();
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress | null>(null);
  const [analysisResult, setAnalysisResult] = useState<TextAnalysisResult | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  
  const ref = useRef<IWaveformRef>(null);
  const ref2 = useRef<IWaveformRef>(null);
  const isRecording = recoderCurrentState === RecorderState.recording;
  const isPaused = recoderCurrentState === RecorderState.paused;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [position, setPosition] = useState<GradientPosition>("top");

  const {
    stopAllWaveFormExtractors,
    stopAllPlayers,
    stopPlayersAndExtractors,
    onCurrentDuration,
  } = useAudioPlayer();

  useEffect(() => {
    return () => {
      ref.current?.stopRecord();
      ref2.current?.stopPlayer();
      ref.current?.currentState;
      stopPlayersAndExtractors();
      stopAllPlayers();
      stopAllWaveFormExtractors();
    };
  }, []);

  const handleStartRecording = async () => {
    await ref.current?.startRecord();
    setIsSpeaking(true);
  };

  const handleAnalysisProgress = useCallback((progress: AnalysisProgress) => {
    setAnalysisProgress(progress);
    
    if (progress.stage === 'complete' && progress.result) {
      setAnalysisResult(progress.result);
      setShowInsights(true);
    }
  }, []);

  const uploadAndTranscribe = async (uri: string) => {
    try {
      // Reset states
      setShowInsights(false);
      setAnalysisResult(null);
      
      // Start with transcribing stage
      setAnalysisProgress({
        stage: 'transcribing',
        progress: 0,
        message: 'Preparing audio for transcription...'
      });
      
      // Step 1: Upload audio file to AssemblyAI
      const audioData = await fetch(uri);
      const audioBlob = await audioData.arrayBuffer();
      const base64Audio = Buffer.from(audioBlob).toString("base64");
      
      setAnalysisProgress({
        stage: 'transcribing',
        progress: 50,
        message: 'Converting speech to text...'
      });
      
      const transcriptResults = await transcribeAudio(
        "AIzaSyCfc4bT2M0K4z3mVjvra2T-VV65ZtWr7cM",
        base64Audio
      );
      
      console.log("Transcripts:", transcriptResults);
      setTranscripts(transcriptResults);
      
      // If we have transcripts, analyze them
      if (transcriptResults.length > 0) {
        // Join all transcripts into a single text for analysis
        const fullText = transcriptResults.join(" ");
        // Begin analysis with progress reporting
        await analyzeText(fullText, handleAnalysisProgress);
      } else {
        setAnalysisProgress({
          stage: 'error',
          progress: 100,
          message: 'No speech detected in recording',
          error: 'Unable to transcribe audio. Please try recording again with clearer speech.'
        });
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      setAnalysisProgress({
        stage: 'error',
        progress: 100,
        message: 'Error processing audio',
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  };

  const handleStopRecording = async () => {
    const path = await ref.current?.stopRecord();
    if (!path) return Alert.alert("Error", "Failed to stop recording");
    setRecordingUri(path);
    uploadAndTranscribe(path);
    setIsSpeaking(false);
  };
  
  const handleResetRecording = () => {
    setShowInsights(false);
    setAnalysisResult(null);
    setAnalysisProgress(null);
    setTranscripts([]);
    setRecordingUri(null);
  };

  const handlePauseRecording = async () => {
    await ref.current?.pauseRecord();
    setIsSpeaking(false);
  };

  const handleResumeRecording = async () => {
    await ref.current?.resumeRecord();
    setIsSpeaking(true);
  };

  // Remove noisy debugging logs

  return (
    <VoiceRecorderModal
      visible={recorderOpen}
      onRequestClose={() => {
        if (!isRecording && !isPaused) {
          setRecorderOpen(false);
          // Reset states when closing modal
          handleResetRecording();
        } else {
          Alert.alert(
            "Recording in Progress", 
            "Stop recording before closing",
            [{ text: "OK" }]
          );
        }
      }}
    >
      <MindfulBackground>
        <SafeAreaView className="flex-1">
          {!showInsights ? (
            <>
              <MindfulGradient position={position} isSpeaking={isSpeaking} />
              
              {/* Recording Waveform */}
              {!analysisProgress && (
                <Box className="w-full mb-4" style={{ height: 200 }}>
                  <Waveform
                    key={"player1"}
                    showsHorizontalScrollIndicator={true}
                    candleHeightScale={12}
                    mode="live"
                    waveColor={activeTheme.highlight}
                    ref={ref}
                    candleSpace={4}
                    candleWidth={6}
                    onRecorderStateChange={(recorderState) => {
                      setRecoderCurrentState(recorderState);
                    }}
                  />
                </Box>
              )}
              
              {/* Processing Stages */}
              {analysisProgress && (
                <Box className="px-4 pt-10 flex-1">
                  <Text className="text-2xl font-bold text-center mb-6">
                    {analysisProgress.stage === 'error' ? 'Processing Error' : 'Processing Journal'}
                  </Text>
                  
                  <ProcessingStageIndicator progress={analysisProgress} />
                  
                  {/* Error state actions */}
                  {analysisProgress.stage === 'error' && (
                    <Box className="items-center mt-8">
                      <Button 
                        onPress={handleResetRecording}
                        className="bg-blue-500 px-6"
                      >
                        <ButtonText>Try Again</ButtonText>
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
              
              {/* Recording Controls */}
              {!analysisProgress && (
                <MicControlContainer
                  isRecording={isRecording}
                  isPaused={isPaused}
                  durationSeconds={1}
                  onToggleRecord={
                    isRecording
                      ? () => handlePauseRecording()
                      : isPaused
                      ? () => {
                          handleResumeRecording();
                        }
                      : () => handleStartRecording()
                  }
                  onStop={handleStopRecording}
                />
              )}
            </>
          ) : (
            // Insights View
            <Box className="flex-1">
              <Box className="flex-row justify-between items-center px-4 py-3 bg-white/90">
                <Text className="text-xl font-bold">Journal Analysis</Text>
                <Button 
                  onPress={handleResetRecording} 
                  className="bg-gray-100 px-4"
                >
                  <ButtonText className="text-gray-800">New Journal</ButtonText>
                </Button>
              </Box>
              
              {analysisResult && (
                <JournalInsightsView 
                  transcripts={transcripts} 
                  analysisResult={analysisResult} 
                />
              )}
            </Box>
          )}
        </SafeAreaView>
      </MindfulBackground>
    </VoiceRecorderModal>
  );
};

export default VoiceRecorderModalWrapper;
