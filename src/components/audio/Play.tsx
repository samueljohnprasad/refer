import React from "react";
import { useAudioPlayer, useAudioSampleListener } from "expo-audio";
import { Button } from "react-native";

const Play = ({ audioSourceString }: { audioSourceString: string }) => {
  const player = useAudioPlayer({ uri: audioSourceString });
  useAudioSampleListener(player, (sample) => {
    // Use sample.channels array for audio visualization
    // console.log("Audio sample:", sample.channels[0].frames);
  });
  return (
    <>
      <Button title="Play Sound" onPress={() => player.play()} />
      <Button
        title="Replay Sound"
        onPress={() => {
          player.seekTo(0);
          player.play();
        }}
      />
    </>
  );
};

export default Play;
