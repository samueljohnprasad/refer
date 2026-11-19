// ponytail: the start screen (.agents/behavioral-activation.html `intro`): what this takes, the picture,
// Happi's question, and the sentence the exercise will build — every part still a gap.
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { ExerciseArt } from "@/src/domains/exercises/ui/presentation/components/ExerciseArt";
import { BaAsk } from "./baAsk";
import { resetBaCrisis } from "./baHelp";
import { BaOpenLine } from "./baParts";

export function BaIntroStep(): React.JSX.Element {
  useEffect(resetBaCrisis, []); // a new run: Happi may come back
  return (
    <View>
      <Text className="text-t-foot font-semibold text-happy-label-2">Behavioral Activation · 8 to 10 min · private to you</Text>
      <View className="mt-3 overflow-hidden rounded-3xl bg-[#fde5dc]" style={{ aspectRatio: 160 / 120 }}>
        <ExerciseArt type="behavioral_activation" />
      </View>
      <BaAsk question="Low on energy today?" />
      <BaOpenLine />
    </View>
  );
}
