import { View, Text, SafeAreaView, Alert, Platform, Animated, Easing, StyleSheet } from "react-native";
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
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
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
import AnimatedProcessingIndicator from "@/components/analysis/AnimatedProcessingIndicator";
import { analyzeText, AnalysisProgress, TextAnalysisResult } from "@/utils/textAnalysisService";
import { format } from "date-fns";

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
  const [currentTimestamp, setCurrentTimestamp] = useState<string>('');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
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

  // Setup animations between states
  const runTransitionAnimations = useCallback((toInsights: boolean = false) => {
    // Fade out current content
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start(() => {
      // After fade out, update state and fade back in
      if (toInsights) {
        setShowInsights(true);
      }
      
      // Slide and fade in new content
      slideAnim.setValue(50);
      opacityAnim.setValue(0);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          delay: 100,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
      ]).start();
    });
  }, [fadeAnim, slideAnim, opacityAnim]);
  
  const handleAnalysisProgress = useCallback((progress: AnalysisProgress) => {
    // Only update timestamp once when entering a stage
    if ((progress.stage === 'analyzing' || progress.stage === 'generating-insights') && 
        progress.stage !== analysisProgress?.stage) {
      setCurrentTimestamp(format(new Date(), 'MMMM d • h:mm a'));
    }
    
    // Only animate transitions between different stages, not on every progress update
    if (progress.stage !== analysisProgress?.stage) {
      console.log(`Stage transition: ${analysisProgress?.stage || 'none'} -> ${progress.stage}`);
      runTransitionAnimations();
    }
    
    // Prevent unnecessary state updates if only progress percentage changed
    if (progress.stage === analysisProgress?.stage && 
        progress.message === analysisProgress?.message && 
        progress.progress === analysisProgress?.progress) {
      console.log('Skipping identical progress update');
      return;
    }
    
    setAnalysisProgress(progress);
    
    if (progress.stage === 'complete' && progress.result) {
      console.log('Analysis complete, showing insights');
      setAnalysisResult(progress.result);
      // Use animation before showing insights (only once)
      runTransitionAnimations(true);
    }
  }, [analysisProgress, runTransitionAnimations]);


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
    // Use animation to transition out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start(() => {
      // Reset all states after fade out
      setShowInsights(false);
      setAnalysisResult(null);
      setAnalysisProgress(null);
      setTranscripts([]);
      setRecordingUri(null);
      
      // Fade back in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    });
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
                <Animated.View
                  style={[
                    { flex: 1, paddingTop: 40, alignItems: 'center', justifyContent: 'center' },
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                  ]}
                >
                  {analysisProgress.stage === 'error' ? (
                    // Error state
                    <Box className="px-4 flex-1">
                      <Text className="text-2xl font-bold text-center mb-6">Processing Error</Text>
                      <ProcessingStageIndicator progress={analysisProgress} />
                      <Box className="items-center mt-8">
                        <Button 
                          onPress={handleResetRecording}
                          className="bg-blue-500 px-6"
                        >
                          <ButtonText>Try Again</ButtonText>
                        </Button>
                      </Box>
                    </Box>
                  ) : analysisProgress.stage === 'transcribing' ? (
                    // Enhanced premium transcribing UI
                    <Animated.View style={[styles.animatedContainer]}>                      
                      <Box className="items-center justify-center">
                        <AnimatedProcessingIndicator 
                          message="Converting speech to text" 
                          timestamp={currentTimestamp || format(new Date(), 'MMMM d • h:mm a')}
                          iconType="cloud"
                        />
                        
                        {/* Progress Indicator below animation */}
                        <Box className="px-6 w-full mt-6 max-w-xs">
                          <Progress 
                            value={analysisProgress.progress} 
                            max={100} 
                            className="h-1.5 rounded-full overflow-hidden bg-gray-200/60"
                          >
                            <ProgressFilledTrack 
                              className="bg-blue-400"
                            />
                          </Progress>
                          <Text className="text-center text-sm text-gray-500 mt-2">
                            {analysisProgress.message}
                          </Text>
                        </Box>
                      </Box>
                    </Animated.View>
                  ) : (
                    // Analysis states with premium animated design (analyzing, generating-insights)
                    <AnimatedProcessingIndicator 
                      message={analysisProgress.stage === 'analyzing' ? 
                        'Analyzing emotions' : 
                        'Generating insights'}
                      timestamp={currentTimestamp}
                    />
                  )}
                </Animated.View>
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
            // Insights View with animations
            <Animated.View 
              style={[
                { flex: 1 },
                { opacity: opacityAnim }
              ]}
            >
              <Box className="flex-row justify-between items-center px-4 py-3 bg-white/90 shadow-sm">
                <Text className="text-xl font-bold">Journal Analysis</Text>
                <Button 
                  onPress={handleResetRecording} 
                  className="bg-gray-100 px-4"
                >
                  <ButtonText className="text-gray-800">New Journal</ButtonText>
                </Button>
              </Box>
              
              {analysisResult && (
                <Animated.View
                  style={[{ flex: 1, transform: [{ translateY: slideAnim }] }]}
                >
                  <JournalInsightsView 
                    transcripts={transcripts} 
                    analysisResult={analysisResult} 
                  />
                </Animated.View>
              )}
            </Animated.View>
          )}
        </SafeAreaView>
      </MindfulBackground>
    </VoiceRecorderModal>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default VoiceRecorderModalWrapper;
