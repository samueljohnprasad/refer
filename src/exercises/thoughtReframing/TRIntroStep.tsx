// ponytail: .agents/thought-reframing.html intro — scene, Happi's one question, then the four stages so the
// ten minutes have a shape before you start. Happi's pose (reframe, with the frame) comes from the flow.
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { StepHappiTitle } from "@/src/components/exercise/steps/StepHappiTitle";
import { TRIntroScene, TRPathGlyph } from "./TRPatternArt";

const PATH = [
  { glyph: "notice", title: "Notice", body: "What happened, and what you told yourself" },
  { glyph: "weigh", title: "Weigh", body: "The facts for it, and against it" },
  { glyph: "reframe", title: "Reframe", body: "A fairer way to put it" },
  { glyph: "check", title: "Check", body: "How true it feels afterwards" },
] as const;

export function TRIntroStep(): React.JSX.Element {
  return (
    <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 4, paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
      <Text className="mb-3 text-t-foot font-bold text-happy-label-2">Thought Reframing · 10 to 15 min · private to you</Text>
      <TRIntroScene />
      <View className="mb-1 mt-4">
        <StepHappiTitle title="A thought got stuck?" subtitle="Let’s write it down, weigh it against the facts, and find a fairer way to say it." />
      </View>
      <View accessibilityLabel="How it goes">
        {PATH.map((p) => (
          <View key={p.title} className="flex-row items-center gap-3 py-2">
            <TRPathGlyph name={p.glyph} />
            <View className="flex-1">
              <Text className="text-t-body font-extrabold text-happy-label">{p.title}</Text>
              <Text className="text-t-sub font-semibold leading-[20px] text-happy-label-2">{p.body}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
