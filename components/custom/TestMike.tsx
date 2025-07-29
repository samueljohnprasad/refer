import {
  AudioRecorderProvider,
  useSharedAudioRecorder,
  RecordingConfig,
} from "@siteed/expo-audio-studio";
import { View, Text, Button, SafeAreaView } from "react-native";
import { Box } from "../ui/box";
import { AudioVisualizer } from "@siteed/expo-audio-ui";
import {
  Waveform,
  useAudioPlayer,
  type IWaveformRef,
} from "@simform_solutions/react-native-audio-waveform";
import { useEffect, useRef, useState } from "react";

export default function ParentComponent() {
  // You can pass configuration options to the provider
  const ref = useRef<IWaveformRef>(null);
  const ref2 = useRef<IWaveformRef>(null);
  const {
    stopAllWaveFormExtractors,
    stopAllPlayers,
    stopPlayersAndExtractors,
    getDuration,
  } = useAudioPlayer();

  // useEffect(() => {
  //   return () => {
  //     console.log("stopped>>>>");
  //     ref.current?.stopRecord();
  //     ref2.current?.stopPlayer();
  //     ref.current?.currentState
  //     stopPlayersAndExtractors();
  //     stopAllPlayers();
  //     stopAllWaveFormExtractors();
  //   };
  // }, []);

  const [path, setPath] = useState<string | null>(null);
  return (
    <SafeAreaView className="flex-1">
      <Box className="flex-1 flex items-center justify-center">
        <Text className="text-2xl">hello</Text>
        <Button
          title="Start Recording"
          onPress={() => ref.current?.startRecord()}
        />
        <Button
          title="stopRecord"
          onPress={async () => {
            const path = await ref.current?.stopRecord();
            if (!path) return;
            setPath(path);
          }}
        />
        <Button
          title="pauseRecord"
          onPress={() => ref.current?.pauseRecord()}
        />
        <Button
          title="START PLAYER"
          onPress={() => ref2.current?.startPlayer()}
        />

        <Waveform
          candleHeightScale={18}
          mode="live"
          ref={ref}
          candleSpace={2}
          candleWidth={4}
          onRecorderStateChange={(recorderState) => console.log(recorderState)}
        />
        <Text>{path}</Text>
        <Box className="mt-2 w-full">
          {path && (
            <Waveform
              candleHeightScale={18}
              mode="static"
              ref={ref2}
              path={path}
              candleSpace={2}
              candleWidth={4}
              scrubColor="white"
              onPlayerStateChange={(playerState) => console.log(playerState)}
              onPanStateChange={(isMoving) => console.log(isMoving)}
            />
          )}
        </Box>
      </Box>
      <Box className="mt-2 w-full"></Box>
    </SafeAreaView>
  );
}

function RecordingControls() {
  const {
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    isRecording,
    isPaused,
    analysisData,
  } = useSharedAudioRecorder();

  const handleStartRecording = async () => {
    const config: RecordingConfig = {
      interval: 500, // Emit recording data every 500ms
      enableProcessing: true, // Enable audio analysis
      sampleRate: 48000, // Use 48000 Hz to match iOS hardware and avoid format mismatch
      channels: 1, // Mono recording
      encoding: "pcm_16bit", // PCM encoding (pcm_8bit, pcm_16bit, pcm_32bit)
      showWaveformInNotification: true,
      compression: {
        enabled: true,
        format: "aac",
        bitrate: 48000,
      },
      autoResumeAfterInterruption: true,

      onAudioStream: async (audioData) => {
        // console.log(`onAudioStream`, audioData);
      },

      // Optional: Handle audio analysis data
      onAudioAnalysis: async (analysisEvent) => {
        // console.log(`onAudioAnalysis`, analysisEvent);
      },

      // Optional: Handle recording interruptions
      onRecordingInterrupted: (event) => {
        // console.log(`Recording interrupted: ${event.reason}`);
      },
    };

    await startRecording(config);
  };

  return (
    <View className=" items-center justify-center ">
      {!isRecording && !isPaused && (
        <Button title="Start Recording" onPress={handleStartRecording} />
      )}

      {isRecording && (
        <>
          <Button title="Pause Recording" onPress={pauseRecording} />
          <Button title="Stop Recording" onPress={stopRecording} />
        </>
      )}

      {isPaused && (
        <>
          <Button title="Resume Recording" onPress={resumeRecording} />
          <Button title="Stop Recording" onPress={stopRecording} />
        </>
      )}
    </View>
  );
}

function RecordingStatus() {
  const { isRecording, isPaused, durationMs, size, analysisData } =
    useSharedAudioRecorder();

  if (!isRecording && !isPaused) {
    return <Text>Ready to record</Text>;
  }

  return (
    <View className="w-full ">
      <Text>Status: {isRecording ? "Recording" : "Paused"}</Text>
      <Text>Duration: {durationMs / 1000} seconds</Text>
      <Text>Size: {size} bytes</Text>;
      <Box className="mt-1 w-full">
        <AudioVisualizer
          showDottedLine={false}
          candleSpace={4}
          disableTapSelection={true}
          theme={{
            container: {
              backgroundColor: "transparent",
            },
            canvasContainer: {
              backgroundColor: "transparent",
            },
            referenceLine: {
              backgroundColor: "red",
            },
            button: {
              backgroundColor: "red",
            },
            candle: {
              activeAudioColor: "#F1948A",
            },
          }}
          amplitudeScaling="humanVoice"
          _visualizationType="candles"
          mode="live"
          showYAxis={false}
          showNavigation={false}
          showRuler={false}
          showReferenceLine={false}
          scaleToHumanVoice={true}
          audioData={
            analysisData || {
              durationMs: 10,
              segmentDurationMs: 10,
              bitDepth: 16,
              samples: 48000,
              sampleRate: 48000,
              numberOfChannels: 1,
              rmsRange: {
                max: 1,
                min: 0,
              },
              amplitudeRange: {
                max: 1,
                min: 0,
              },
              dataPoints: [],
            }
          }
        />
      </Box>
    </View>
  );
}
