import { AudioRecorder, RecorderState } from "expo-audio";
import { useEffect, useState } from "react";

export function useAudioRecorderStateCustom(
  recorder: AudioRecorder,
  interval: number = 500
) {
  const [state, setState] = useState<RecorderState>(recorder.getStatus());

  useEffect(() => {
    console.log("recorder.getStatus()", recorder.getStatus());
    if (!recorder.isRecording) {
      setState(recorder.getStatus());
      clearInterval(interval);
      return;
    }
    const int = setInterval(() => {
      setState(recorder.getStatus());
    }, interval);

    return () => clearInterval(int);
  }, [recorder.id, recorder.isRecording]);

  return state;
}
